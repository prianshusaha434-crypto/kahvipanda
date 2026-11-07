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
    const hasKeyId = Boolean(CONFIG.RAZORPAY.KEY_ID);
    const hasKeySecret = Boolean(CONFIG.RAZORPAY.KEY_SECRET);
    if (hasKeyId !== hasKeySecret) {
      throw new Error('Payment gateway credentials are incomplete. Please contact the store.');
    }

    const isTestMode = !hasKeyId;
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

        if (!rzpResponse.ok) {
          throw new Error(`Razorpay returned HTTP ${rzpResponse.status}.`);
        }

        const rzpData = await rzpResponse.json() as { id?: string };
        if (!rzpData.id) {
          throw new Error('Razorpay did not return an order ID.');
        }
        razorpayOrderId = rzpData.id;
      } catch (error) {
        console.error('Razorpay order creation failed.', error);
        throw new Error('Unable to start secure payment right now. Please try again.');
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
          const stockUpdate = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              productId: item.productId,
              isAvailable: true,
              stockQuantity: { gte: item.quantity }
            },
            data: {
              stockQuantity: { decrement: item.quantity }
            }
          });
          if (stockUpdate.count !== 1) {
            throw new Error(`Item "${item.name}" is no longer available in the requested quantity.`);
          }

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

    const payment = await prisma.payment.findFirst({
      where: { orderId, razorpayOrderId },
      include: { order: true }
    });
    if (!payment || payment.status !== 'PENDING' || payment.order.status !== 'PENDING') {
      throw new Error('Payment does not match a pending order.');
    }

    // Verify HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', CONFIG.RAZORPAY.KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const signatureBuffer = Buffer.from(razorpaySignature, 'hex');
    const generatedSignatureBuffer = Buffer.from(generatedSignature, 'hex');
    if (
      !/^[a-f\d]{64}$/i.test(razorpaySignature) ||
      signatureBuffer.length !== generatedSignatureBuffer.length ||
      !crypto.timingSafeEqual(generatedSignatureBuffer, signatureBuffer)
    ) {
      throw new Error('Invalid Razorpay signature. Potential fraudulent transaction.');
    }

    // Capture payment and decrement stock atomically; duplicate callbacks cannot sell twice.
    const order = await prisma.$transaction(async (tx) => {
      const paymentUpdate = await tx.payment.updateMany({
        where: { id: payment.id, status: 'PENDING' },
        data: {
          status: 'CAPTURED',
          razorpayPayId: razorpayPaymentId,
          razorpaySig: razorpaySignature
        }
      });
      if (paymentUpdate.count !== 1) {
        throw new Error('Payment has already been processed.');
      }

      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        const stockUpdate = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            productId: item.productId,
            isAvailable: true,
            stockQuantity: { gte: item.quantity }
          },
          data: { stockQuantity: { decrement: item.quantity } }
        });
        if (stockUpdate.count !== 1) {
          throw new Error(`Item "${item.name}" is no longer available in the requested quantity.`);
        }
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            quantity: -item.quantity,
            reason: 'SALE',
            reference: payment.order.orderNumber
          }
        });
      }

      const orderUpdate = await tx.order.updateMany({
        where: { id: orderId, status: 'PENDING' },
        data: { status: 'CONFIRMED' }
      });
      if (orderUpdate.count !== 1) {
        throw new Error('Order has already been processed.');
      }

      return payment.order;
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
      select: {
        id: true,
        orderNumber: true,
        status: true,
        subtotal: true,
        shippingAmount: true,
        discountAmount: true,
        totalAmount: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            name: true,
            weight: true,
            grindType: true,
            unitPrice: true,
            quantity: true,
            totalPrice: true
          }
        }
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
