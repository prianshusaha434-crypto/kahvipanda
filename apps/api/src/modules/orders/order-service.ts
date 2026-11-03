import crypto from 'crypto';
import { prisma } from '../../db';
import { CONFIG } from '../../config';
import { CartService } from '../cart/cart-service';
import { CheckoutPayloadDTO } from '@kahvi-panda/shared';

export interface OrderCreationResult {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMode: 'RAZORPAY' | 'TEST_MODE';
  razorpay?: {
    orderId: string;
    keyId: string;
    amount: number;
    currency: string;
  };
}

export class OrderService {
  static async createOrder(
    payload: CheckoutPayloadDTO,
    userId?: string
  ): Promise<OrderCreationResult> {
    // 1. Verify and compute real server-side prices and totals
    const calculation = await CartService.calculateCart(payload.items, payload.couponCode);

    if (calculation.items.length === 0) {
      throw new Error('Cannot create an order with empty cart.');
    }

    // Verify stock availability
    for (const item of calculation.items) {
      if (!item.inStock) {
        throw new Error(`Item "${item.name}" is currently out of stock for the selected variant.`);
      }
    }

    const orderNumber = `KP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Determine payment flow: Test Mode vs Live Razorpay
    const isTestMode = CONFIG.RAZORPAY.TEST_MODE;
    let razorpayOrderId: string | undefined = undefined;

    if (!isTestMode && CONFIG.RAZORPAY.KEY_ID && CONFIG.RAZORPAY.KEY_SECRET) {
      try {
        const authHeader = Buffer.from(`${CONFIG.RAZORPAY.KEY_ID}:${CONFIG.RAZORPAY.KEY_SECRET}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Math.round(calculation.totalAmount * 100), // amount in paise
            currency: 'INR',
            receipt: orderNumber,
            notes: {
              customerEmail: payload.address.email,
              customerPhone: payload.address.phone
            }
          })
        });

        if (rzpResponse.ok) {
          const rzpData: any = await rzpResponse.json();
          razorpayOrderId = rzpData.id;
        }
      } catch (err) {
        console.error('Razorpay order creation failed, falling back to safe local order:', err);
      }
    }

    // 3. Atomically create Order, OrderItems, and Payment record
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          customerName: payload.address.fullName,
          customerEmail: payload.address.email,
          customerPhone: payload.address.phone,
          shippingAddress: JSON.stringify(payload.address),
          subtotal: calculation.subtotal,
          shippingAmount: calculation.shippingAmount,
          discountAmount: calculation.discountAmount,
          taxAmount: 0,
          totalAmount: calculation.totalAmount,
          couponCode: payload.couponCode || null,
          notes: payload.notes || null,
          status: isTestMode ? 'CONFIRMED' : 'PENDING',
          items: {
            create: calculation.items.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              weight: item.weight,
              grindType: item.grindType,
              unitPrice: item.price,
              quantity: item.quantity,
              totalPrice: item.subtotal
            }))
          },
          payments: {
            create: {
              provider: isTestMode ? 'TEST_MODE' : 'RAZORPAY',
              status: isTestMode ? 'CAPTURED' : 'PENDING',
              amount: calculation.totalAmount,
              currency: 'INR',
              razorpayOrderId: razorpayOrderId || null
            }
          }
        }
      });

      // If test mode or instant confirmation, decrement inventory right away
      if (isTestMode) {
        for (const item of calculation.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: { decrement: item.quantity }
            }
          });

          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              quantity: -item.quantity,
              reason: 'SALE',
              reference: createdOrder.orderNumber
            }
          });
        }
      }

      return createdOrder;
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMode: isTestMode ? 'TEST_MODE' : 'RAZORPAY',
      razorpay: razorpayOrderId ? {
        orderId: razorpayOrderId,
        keyId: CONFIG.RAZORPAY.KEY_ID,
        amount: Math.round(calculation.totalAmount * 100),
        currency: 'INR'
      } : undefined
    };
  }

  static async verifyRazorpayPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    if (!CONFIG.RAZORPAY.KEY_SECRET) {
      throw new Error('Razorpay secret not configured on server.');
    }

    // Verify HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', CONFIG.RAZORPAY.KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new Error('Invalid Razorpay signature. Potential fraudulent transaction.');
    }

    // Update order and decrement stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          payments: {
            updateMany: {
              where: { orderId },
              data: {
                status: 'CAPTURED',
                razorpayPayId: razorpayPaymentId,
                razorpaySig: razorpaySignature
              }
            }
          }
        },
        include: { items: true }
      });

      for (const item of updatedOrder.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } }
        });
      }

      return updatedOrder;
    });

    return { success: true, orderNumber: order.orderNumber };
  }

  static async getOrderByIdOrNumber(identifier: string) {
    return prisma.order.findFirst({
      where: {
        OR: [
          { id: identifier },
          { orderNumber: identifier }
        ]
      },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } }
            }
          }
        },
        payments: true,
        shipments: true
      }
    });
  }

  static async getAllOrders(status?: string) {
    return prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: true,
        payments: true,
        shipments: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateOrderStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}
