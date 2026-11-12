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
│   └── kahvi-panda/
│       ├── web/                     # React 18 + Vite + TypeScript + Tailwind CSS
│       │   ├── src/
│       │   │   ├── app/App.tsx       # Full route tree (Storefront, Account, Admin)
│       │   │   ├── components/       # Header, Footer, ProductCard, SearchModal
│       │   │   ├── features/
│       │   │   │   ├── ai-assistant/
│       │   │   │   └── cart/
│       │   │   ├── pages/
│       │   │   ├── services/api.ts
│       │   │   └── styles/
│       ├── api/                     # Node.js + Express + TypeScript + Prisma
│       │   ├── src/
│       │   │   ├── config/
│       │   │   ├── modules/
│       │   │   ├── routes/index.ts
│       │   │   └── server.ts
│       └── shared/                  # Shared Zod schemas, TypeScript types, and constants
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
- Admin accounts are created only when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are explicitly set before seeding. No default administrator password is shipped.

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js >= 20.0.0 (Node 24 recommended)
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
Set `DATABASE_URL` to your PostgreSQL connection string and `DIRECT_URL` to its direct (non-pooled) connection string. A local PostgreSQL instance or hosted database is required.

### Step 3: Initialize Database & Seed
```bash
npm run db:generate
npm run db:push
$env:SEED_RESET="true"
npm run db:seed
```
Run the seed only against a new database: it clears existing store data. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding if you need an admin account.

### Step 4: Start Development Servers
Run backend API and frontend concurrently:
```bash
# API and storefront together:
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 5: Run Integration Tests
With the API running on port 5000 and the database seeded, run:
```bash
npm test
```

---

## 6. Integrations & Credentials Guide

| Service | Environment Variable | Status / Behavior |
| :--- | :--- | :--- |
| **Panda AI** | `OPENAI_API_KEY` | When provided, uses `gpt-4o` with function calling. When empty, the autonomous high-intelligence engine handles budget and brew matching out-of-the-box. |
| **WhatsApp Business** | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | When configured, automatically dispatches server-side notifications. When empty, generates immediate pre-filled click-to-chat link to `+91 9874199454`. |
| **Razorpay** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | When provided, generates live order IDs and verifies HMAC-SHA256 signatures. In test mode, permits zero-friction instant order placement. |

---

## 7. Production Deployment on Vercel

Deploy this repository as **one Vercel project rooted at the repository root**. The root Express app serves the API, and the production build places the storefront in Vercel's root `public/` directory. Do not import the nested `api` or `web` workspaces as separate Vercel projects.

1. Import the GitHub repository and set **Root Directory** to `.`. Vercel should detect the root Express app. Use `npm ci` for install and `npm run build` for build.
2. Create a PostgreSQL database (for example, Neon, Supabase, or Prisma Postgres). Add these Vercel environment variables for Production, Preview, and Development as needed:
   - `DATABASE_URL`: pooled PostgreSQL connection string for the app.
   - `DIRECT_URL`: direct PostgreSQL connection string for Prisma schema setup.
   - `NODE_ENV=production`.
   - `JWT_SECRET`: a random secret of at least 32 characters.
   - Add any optional integration credentials listed above.
3. Before deploying, initialize the empty database from a machine with both database URLs configured:
   ```bash
   npm ci
   npm run db:push
   ```
   To load the starter catalogue, set `SEED_RESET=true` and run `npm run db:seed` once against this empty database. Seeding clears existing data; do not run it against a database containing live orders.
4. Deploy the root project. Vercel builds the API, generates Prisma Client, and publishes the storefront from `public/`.

The existing SQLite database is not automatically copied into PostgreSQL. Export and migrate any data you need to keep before switching production traffic.
