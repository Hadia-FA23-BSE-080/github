# TradePro 360 — Smart Booking & Dispatch Platform

A complete job management system for UK plumbers, electricians, and cleaners. Built with Next.js 15, Prisma, Supabase, Stripe, and Leaflet maps.

## Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Dispatch** | Automatically assigns jobs to the nearest available engineer based on GPS, skills, and rating |
| **Live Customer Tracking** | Real-time map showing engineer location and ETA |
| **Dynamic UK Pricing** | Instant quotes using local part prices, labour rates, callout fees, and 20% VAT |
| **Stripe Payments** | Pay Now or Pay Later with automatic PDF invoice generation |
| **Client Portal** | Photo uploads, chat, service ratings |
| **GMB Integration** | "Book a Free Quote" widget with location pre-fill from Google Business Profile |
| **White-Label Dashboard** | Trade owners manage all bookings from one place |
| **Supabase Backend** | PostgreSQL database, authentication, and real-time subscriptions |

## Quick Start

### Prerequisites

1. Create a free [Supabase](https://supabase.com) project
2. Node.js 18+ installed

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase credentials (see below)

# Push database schema to Supabase
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed demo data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Supabase Credentials

Get these from your [Supabase Dashboard](https://supabase.com/dashboard):

| Variable | Where to Find |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` key |
| `DATABASE_URL` | Settings → Database → Connection string → URI (Transaction mode) |
| `DIRECT_URL` | Settings → Database → Connection string → URI (Session mode) |

## Demo Businesses

| Business | Slug | Trade |
|----------|------|-------|
| Apex Trades London | `apex-trades-london` | Plumber |
| Spark & Clean Manchester | `spark-clean-manchester` | Cleaner |

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/book?business=apex-trades-london` | Booking widget (GMB entry point) |
| `/dashboard?business=apex-trades-london` | White-label owner dashboard |
| `/portal/[jobId]` | Client portal (chat, photos, payment, reviews) |
| `/track/[jobId]` | Live engineer tracking map |

## Google Business Profile Integration

Add a "Book a Free Quote" button to your GMB listing using this URL pattern:

```
https://yourdomain.com/book?source=gmb&business=YOUR-SLUG&lat=51.5074&lng=-0.1278&city=London&postcode=SW1A+1AA
```

**Parameters:**
- `source=gmb` — tracks bookings from Google Business Profile
- `business` — your business slug
- `lat`, `lng`, `city`, `postcode` — optional pre-fill from Google Maps

When a customer clicks the button on GMB, the booking page opens with their location data pre-filled and requests browser GPS for precise dispatch.

### GMB Setup Steps

1. Go to Google Business Profile → Edit profile → Business information
2. Add your booking URL as a website link or appointment link
3. Label the button "Book a Free Quote"
4. Monitor bookings in your dashboard at `/dashboard?business=YOUR-SLUG`

## Environment Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-xx.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-xx.pooler.supabase.com:5432/postgres"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Optional — app uses mock payments without these)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/jobs` | List/create jobs |
| GET/PATCH | `/api/jobs/[id]` | Get/update job |
| POST | `/api/jobs/[id]/dispatch` | Manual AI dispatch |
| GET/POST | `/api/jobs/[id]/tracking` | Live tracking data |
| POST/GET | `/api/pricing` | Quote calculator / parts search |
| POST/GET | `/api/payments` | Stripe checkout / PDF invoice |
| GET | `/api/business` | Business details |
| GET | `/api/business/stats` | Dashboard statistics |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **Maps:** Leaflet + OpenStreetMap
- **Payments:** Stripe Checkout
- **Invoices:** jsPDF
- **Styling:** Tailwind CSS 4

## License

MIT
