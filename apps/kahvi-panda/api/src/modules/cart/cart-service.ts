import { prisma } from '../../db';
import { CONFIG } from '../../config';
import { CartItemDTO } from '@kahvi-panda/shared';

export interface CartCalculationResult {
  items: Array<{
    productId: string;
    variantId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    weight: string;
    grindType: string;
    quantity: number;
    subtotal: number;
    inStock: boolean;
  }>;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  couponApplied?: {
    code: string;
    discountValue: number;
    discountType: string;
  };
}

export class CartService {
  static async calculateCart(
    items: CartItemDTO[],
    couponCode?: string
  ): Promise<CartCalculationResult> {
    if (!items || items.length === 0) {
      return {
        items: [],
        subtotal: 0,
        shippingAmount: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        freeShippingThreshold: CONFIG.COMMERCE.FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping: CONFIG.COMMERCE.FREE_SHIPPING_THRESHOLD
      };
    }

    // Fetch verified variants from DB to guarantee trustworthy pricing
    const variantIds = items.map(i => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: {
          include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
        }
      }
    });

    const variantMap = new Map(dbVariants.map(v => [v.id, v]));

    let subtotal = 0;
    const computedItems = items.map(item => {
      const dbVariant = variantMap.get(item.variantId);
      const verifiedPrice = dbVariant ? dbVariant.price : item.price;
      const verifiedName = dbVariant ? dbVariant.product.name : item.name;
      const verifiedImage = (dbVariant?.product.images[0]?.url) || item.image;
      const inStock = dbVariant ? (dbVariant.stockQuantity >= item.quantity && dbVariant.isAvailable) : true;

      const itemSubtotal = verifiedPrice * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: item.productId,
        variantId: item.variantId,
        name: verifiedName,
        slug: item.slug,
        image: verifiedImage,
        price: verifiedPrice,
        weight: dbVariant?.weight || item.weight,
        grindType: item.grindType,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        inStock
      };
    });

    // Shipping logic: Free above threshold (₹999), else flat ₹99
    const shippingAmount = subtotal >= CONFIG.COMMERCE.FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : CONFIG.COMMERCE.SHIPPING_FEE;

    const amountNeededForFreeShipping = Math.max(0, CONFIG.COMMERCE.FREE_SHIPPING_THRESHOLD - subtotal);

    // Coupon validation
    let discountAmount = 0;
    let couponApplied: any = undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() }
      });

      if (coupon && coupon.isActive && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        couponApplied = {
          code: coupon.code,
          discountValue: coupon.discountValue,
          discountType: coupon.discountType
        };
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingAmount - discountAmount);

    return {
      items: computedItems,
      subtotal,
      shippingAmount,
      taxAmount: 0, // In India coffee retail prices include GST
      discountAmount,
      totalAmount,
      freeShippingThreshold: CONFIG.COMMERCE.FREE_SHIPPING_THRESHOLD,
      amountNeededForFreeShipping,
      couponApplied
    };
  }
}
