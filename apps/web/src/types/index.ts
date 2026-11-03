import { formatINR, BRAND } from '@kahvi-panda/shared';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  weight: string;
  grindType: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  category?: Category;
  coffeeType: string;
  roastLevel: string;
  origin: string;
  tastingNotes: string;
  compatibleBrewingMethods: string;
  ingredients?: string;
  status: string;
  featured: boolean;
  bestseller: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface CartItem {
  key: string; // productId + variantId
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  weight: string;
  grindType: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    weight: string;
    grindType: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    product?: {
      images: Array<{ url: string }>;
    };
  }>;
}

export { formatINR, BRAND };
