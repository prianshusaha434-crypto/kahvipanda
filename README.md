# KAHVI PANDA — THE NORDIC BLEND 🐼☕

> **"Rush. Sip. Repeat."**  
> Specialty coffee inspired by Nordic simplicity, roasted small-batch in Kolkata for India.

---

## 1. Project Overview

Kahvi Panda is a complete, production-grade full-stack e-commerce platform built to transition the initial Base44 design demo (`https://kahvi-panda-brew.base44.app`) into an independent, highly scalable TypeScript monorepo. It combines:

- **Specialty Coffee Credibility** (inspired by Blue Tokai): Terroir storytelling, roasting curves, grind options, estate origins, and brewing guides.
- **Accessible Discovery** (inspired by Sleepy Owl): Category navigation, bundles, instant coffee reserves, and an interactive 60-second brew quiz.
- **Distinctive Brand Identity**: Scandinavian minimalism meets Kolkata's historic coffee-house culture, with playful panda mascot details and animal-friendly values.
- **PANDA AI Concierge**: An intelligent floating sales assistant with live database tool-calling, budget and roast filtering, and multilingual fluency (English, Bengali, Hindi, Hinglish).
- **Official WhatsApp Business Dispatch**: Direct customer support and wholesale enquiry pipeline connected to **+91 9874199454**.
- **Commerce Engine**: Real-time server-side price validation, free delivery thresholds (₹999), promotional coupon engine (`RUSH10`, `FIRSTSIP`), and Razorpay checkout architecture.

---

## 2. Monorepo Architecture

```
kahvi-panda/
├── apps/
│   ├── web/                          # React 18 + Vite + TypeScript + Tailwind CSS
│   │   ├── src/
│   │   │   ├── app/App.tsx           # Full route tree (Storefront, Account, Admin)
│   │   │   ├── components/           # Header, Footer, ProductCard, SearchModal
│   │   │   ├── features/
│   │   │   │   ├── ai-assistant/     # Panda AI floating concierge widget
│   │   │   │   ├── cart/             # Slide-over cart drawer & CartContext
│   │   │   ├── pages/                # Storefront, Shop, ProductDetails, Quiz, Checkout...
│   │   │   ├── services/api.ts       # Centralized API client
│   │   │   └── styles/               # Nordic brand tokens & global CSS
│   └── api/                          # Node.js + Express + TypeScript + Prisma
│       ├── src/
│       │   ├── config/               # Environment validation
│       │   ├── modules/
│       │   │   ├── ai/               # OpenAI tool calling + Autonomous concierge engine
│       │   │   ├── auth/             # JWT & session authentication
│       │   │   ├── cart/             # Verified cart calculations & coupons
│       │   │   ├── enquiry/          # Shared contact/B2B service & WhatsApp dispatch
│       │   │   ├── orders/           # Inventory-safe checkout & Razorpay HMAC verifier
│       │   │   └── products/         # Full-text catalogue search & filtering
│       │   ├── routes/index.ts       # All REST endpoints mounted at /api/v1
│       │   └── server.ts             # Express server with Helmet, CORS, and rate-limiting
├── packages/
│   └── shared/                       # Shared Zod schemas, TypeScript types, and constants
├── prisma/
│   ├── schema.prisma                 # 25+ normalized relational models (Postgres / SQLite)
│   └── seed.ts                       # Kolkata launch catalogue & default admin user
├── tests/
│   └── api.test.ts                   # 7 automated end-to-end integration tests
├── .env.example
├── package.json
└── README.md
```

---

## 3. Brand Design System

### Nordic Coffee Palette
- **Espresso Brown**: `#30231C` (Primary headers, dark buttons)
- **Roasted Brown**: `#4B3428` (Secondary body typography, borders)
- **Warm Ivory (Canvas)**: `#F8F5EE` (Background canvas)
- **Oat Beige (Surfaces)**: `#E9DCC9` (Pills, badges, card backdrops)
- **Nordic Sage (Accent)**: `#9CA88E` (Success states, free shipping bar, highlight badges)
- **Muted Terracotta**: `#BC785C` (Eyebrows, discount tags, warnings)
- **Charcoal**: `#252525` (High-contrast text)

### Typography
- **Headings & Display**: `DM Serif Display` (Warm, editorial, Scandinavian elegance)
- **UI & Body**: `Manrope` / `Inter` (Geometric, ultra-legible)

---

## 4. Route Map

### Storefront Routes
- `/` — Homepage (Hero, Category Grid, Panda Picks, Brand Story, Brew Quiz CTA, Wholesale Banner, Innovation Lab, Newsletter)
- `/shop` — All Products (Category filters, roast curves, price sorting, live search)
- `/shop/:categorySlug` — Category Filtered Catalogue (Whole Beans, Ground, Instant, Bundles, Accessories, Innovations)
- `/products/:slug` — Product Details (Pack size selection, grind type selector, tasting notes, brewing recipe)
- `/coffee-finder` — 60-Second Interactive Brew Quiz
- `/our-story` — Brand Story & Roasting Philosophy
- `/coffee-journal` — Coffee Education & Brewing Guides
- `/coffee-journal/:slug` — Individual Article View
- `/wholesale` — B2B Cafe & Hospitality Supply Form
- `/contact` — Contact Details & Direct WhatsApp Chat
- `/cart` — Full Bag Review with Coupon Application (`RUSH10`, `FIRSTSIP`)
- `/checkout` — Indian PIN Code Validated Checkout with Razorpay / Test Mode
- `/order-confirmation/:orderId` — Celebratory Confetti Confirmation
- `/track-order` — Live Order Status & Roastery Dispatch Timeline
- `/faq`, `/shipping-policy`, `/refund-policy`, `/privacy-policy`, `/terms` — Legal & FAQs

### Customer Account
- `/account/login` — Authentication & Sign Up
- `/account/profile` — Order History, Saved Addresses, and Quick Reorder

### Staff Admin Dashboard
- `/admin` — Control Center (Revenue, Orders, Enquiries, Panda AI Analytics, Status Management)
- **Default Credentials**: `admin@kahvipanda.in` / `admin123`

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js >= 18.0.0 (Node 24 recommended)
- npm >= 10.0.0

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Step 3: Initialize Database & Seed
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 4: Run Tests
```bash
npx tsx tests/api.test.ts
```

### Step 5: Start Development Servers
Run backend API and frontend concurrently:
```bash
# Terminal 1 (Backend API on port 5000):
npm run dev --workspace=@kahvi-panda/api

# Terminal 2 (Frontend on port 5173):
npm run dev --workspace=@kahvi-panda/web
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Integrations & Credentials Guide

| Service | Environment Variable | Status / Behavior |
| :--- | :--- | :--- |
| **Panda AI** | `OPENAI_API_KEY` | When provided, uses `gpt-4o` with function calling. When empty, the autonomous high-intelligence engine handles budget and brew matching out-of-the-box. |
| **WhatsApp Business** | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | When configured, automatically dispatches server-side notifications. When empty, generates immediate pre-filled click-to-chat link to `+91 9874199454`. |
| **Razorpay** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | When provided, generates live order IDs and verifies HMAC-SHA256 signatures. In test mode, permits zero-friction instant order placement. |

---

## 7. Production Deployment Instructions

1. **Database**: Switch `datasource db { provider = "postgresql" }` in `prisma/schema.prisma` and provide any PostgreSQL connection string (Supabase, Neon, AWS RDS) via `DATABASE_URL`.
2. **Build Web**:
   ```bash
   npm run build --workspace=@kahvi-panda/web
   ```
3. **Build API**:
   ```bash
   npm run build --workspace=@kahvi-panda/api
   ```
4. **Deploy**:
   - `apps/web`: Deploy `dist/` to Vercel, Netlify, or Cloudflare Pages.
   - `apps/api`: Deploy container or Node server to Render, Railway, AWS ECS, or Google Cloud Run.
