import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or current folder
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config(); // fallback

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  JWT_SECRET: process.env.JWT_SECRET || 'kahvi_panda_jwt_secret_kolkata_2026',
  SESSION_SECRET: process.env.SESSION_SECRET || 'kahvi_panda_session_secret_2026',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
  WHATSAPP: {
    API_TOKEN: process.env.WHATSAPP_API_TOKEN || '',
    PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    TARGET_PHONE: process.env.WHATSAPP_TARGET_PHONE || '919874199454',
    OFFICIAL_DISPLAY: '+91 9874199454'
  },
  RAZORPAY: {
    KEY_ID: process.env.RAZORPAY_KEY_ID || '',
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
    WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    TEST_MODE: !process.env.RAZORPAY_KEY_ID
  },
  COMMERCE: {
    FREE_SHIPPING_THRESHOLD: 999, // ₹999
    SHIPPING_FEE: 99, // ₹99
    ESTIMATED_METRO_DAYS: '2-5 business days',
    ESTIMATED_STANDARD_DAYS: '4-8 business days'
  }
} as const;
