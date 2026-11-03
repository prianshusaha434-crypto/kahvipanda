import { z } from 'zod';

// ==========================================
// BRAND CONSTANTS
// ==========================================
export const BRAND = {
  name: 'KAHVI PANDA',
  descriptor: 'THE NORDIC BLEND',
  tagline: 'Rush. Sip. Repeat.',
  established: 2026,
  location: 'Kolkata, India',
  whatsappNumber: '+91 9874199454',
  whatsappRaw: '919874199454',
  whatsappUrl: 'https://wa.me/919874199454',
  supportEmail: 'hello@kahvipanda.in',
  freeShippingThreshold: 999, // ₹999 free shipping
  shippingFee: 99, // ₹99 flat delivery fee
  currency: 'INR',
  currencySymbol: '₹',
  logoUrl: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/749ca56a8_KahviPandaCoffeeLogo.png',
  palette: {
    espresso: '#30231C',
    roasted: '#4B3428',
    ivory: '#F8F5EE',
    oat: '#E9DCC9',
    sage: '#9CA88E',
    terracotta: '#BC785C',
    charcoal: '#252525'
  }
} as const;

export const formatINR = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

// ==========================================
// SHARED ENUMS & TYPES
// ==========================================
export type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export type CoffeeType = 
  | 'Whole Beans' 
  | 'Ground Coffee' 
  | 'Instant Coffee' 
  | 'Coffee Bundles' 
  | 'Brewing Accessories' 
  | 'Innovations';

export type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark' | 'Nordic Roast';

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'DISPATCHED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'CAPTURED' 
  | 'FAILED' 
  | 'REFUNDED';

export type EnquiryType = 
  | 'GENERAL' 
  | 'PRODUCT' 
  | 'WHOLESALE_B2B' 
  | 'CORPORATE' 
  | 'SUPPORT' 
  | 'AI_ESCALATION';

// ==========================================
// ZOD SCHEMAS
// ==========================================
export const CartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().url().or(z.string()),
  price: z.number().positive(),
  weight: z.string().min(1),
  grindType: z.string().min(1),
  quantity: z.number().int().min(1).max(50)
});

export type CartItemDTO = z.infer<typeof CartItemSchema>;

export const EnquiryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9+ \-]{10,15}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  type: z.enum(['GENERAL', 'PRODUCT', 'WHOLESALE_B2B', 'CORPORATE', 'SUPPORT', 'AI_ESCALATION']).default('GENERAL'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  businessName: z.string().optional(),
  city: z.string().optional(),
  estimatedMonthlyKg: z.number().optional(),
  productsOfInterest: z.string().optional()
});

export type EnquiryFormDTO = z.infer<typeof EnquiryFormSchema>;

export const CheckoutAddressSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[0-9+ \-]{10,15}$/, 'Valid phone is required'),
  street: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Valid 6-digit Indian PIN code is required'),
  country: z.literal('India').default('India')
});

export type CheckoutAddressDTO = z.infer<typeof CheckoutAddressSchema>;

export const CheckoutPayloadSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Cart is empty'),
  address: CheckoutAddressSchema,
  couponCode: z.string().optional(),
  notes: z.string().optional()
});

export type CheckoutPayloadDTO = z.infer<typeof CheckoutPayloadSchema>;

export const AIChatRequestSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
  language: z.enum(['en', 'bn', 'hi', 'hinglish', 'auto']).default('auto'),
  contextCart: z.array(z.any()).optional()
});

export type AIChatRequestDTO = z.infer<typeof AIChatRequestSchema>;
