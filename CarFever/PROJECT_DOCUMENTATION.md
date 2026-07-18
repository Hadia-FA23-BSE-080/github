# CarFever — Complete Project Documentation

> **Purpose:** AI tool ke saath discussion aur future development ke liye complete reference document.
> **Last Updated:** July 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Environment Variables](#3-environment-variables)
4. [Folder Structure](#4-folder-structure)
5. [Database Schema (Supabase)](#5-database-schema-supabase)
6. [Public Website Pages](#6-public-website-pages)
7. [Admin Panel Pages](#7-admin-panel-pages)
8. [Components Library](#8-components-library)
9. [Lib / Utility Files](#9-lib--utility-files)
10. [Hooks](#10-hooks)
11. [Supabase Integration Map](#11-supabase-integration-map)
12. [SEO Implementation](#12-seo-implementation)
13. [Realtime Features](#13-realtime-features)
14. [Feature Status (Working vs Broken)](#14-feature-status-working-vs-broken)
15. [Known Issues & Bugs](#15-known-issues--bugs)
16. [Data Flow Diagrams](#16-data-flow-diagrams)

---

## 1. PROJECT OVERVIEW

**CarFever** Pakistan ka premium car marketplace hai jahan users:
- Used/new cars **browse** aur **buy** kar sakte hain
- Apni car **sell** kar sakte hain (listing submit)
- Professional **car inspection** book kar sakte hain
- Automotive **blog** articles parh sakte hain
- Cars ko **wishlist** mein save kar sakte hain

**Admin panel** mein admins:
- Car listings approve/reject kar sakte hain
- Blog posts likh aur publish kar sakte hain
- Inquiries manage kar sakte hain
- Inspection bookings track kar sakte hain
- Users manage kar sakte hain
- SEO settings configure kar sakte hain
- Analytics dekh sakte hain

**Brand Color:** `#0055FE` (Electric Blue)
**Currency:** PKR (Pakistani Rupees, Lacs format)
**Framework:** Next.js 16.2.10 with App Router
**Styling:** Tailwind CSS v4

---

## 2. TECH STACK

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.2.10 |
| Language | TypeScript | ^5 |
| React | React | 19.2.4 |
| Styling | Tailwind CSS | ^4 |
| Database | Supabase (PostgreSQL) | ^2.110.2 |
| Auth | Supabase SSR | ^0.12.3 |
| UI Components | shadcn/ui (custom) | ^4.13.0 |
| Icons | lucide-react | ^1.24.0 |
| Charts | recharts | ^3.9.2 |
| Toasts | sonner | ^2.0.7 |
| Date Utils | date-fns | ^4.4.0 |
| Animations | tw-animate-css | ^1.4.0 |
| CSS Merge | tailwind-merge + clsx | latest |

---

## 3. ENVIRONMENT VARIABLES

File: `.env.local` (copy from `env.local.template`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- `NEXT_PUBLIC_SUPABASE_URL` — Browser + Server dono mein use hota hai
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public reads ke liye, RLS respect karta hai
- `SUPABASE_SERVICE_ROLE_KEY` — Server Actions mein ONLY, RLS bypass karta hai (NEVER client side)

**Agar ye variables "placeholder" hain to server.ts throw kar dega.**

---

## 4. FOLDER STRUCTURE

```
CarFever/
├── .env.local                        # Environment variables (gitignored)
├── env.local.template                # Template for .env.local
├── next.config.ts                    # Next.js config (Unsplash images allowed)
├── components.json                   # shadcn/ui config
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS (Tailwind)
├── tsconfig.json                     # TypeScript config
│
├── public/                           # Static assets (SVGs)
│
└── src/
    ├── app/                          # Next.js App Router pages
    │   ├── layout.tsx                # Root layout (Inter font, metadata, ScrollToTop)
    │   ├── page.tsx                  # Homepage (/)
    │   ├── manifest.ts               # PWA manifest
    │   ├── globals.css               # Global styles + Tailwind imports
    │   │
    │   ├── buy-car/
    │   │   ├── page.tsx              # Car listing/browse page (/buy-car)
    │   │   └── [id]/
    │   │       └── page.tsx          # Single car detail page (/buy-car/:id)
    │   │
    │   ├── sell-car/
    │   │   └── page.tsx              # Multi-step sell car wizard (/sell-car)
    │   │
    │   ├── inspections/
    │   │   └── page.tsx              # Inspection booking page (/inspections)
    │   │
    │   ├── wishlist/
    │   │   └── page.tsx              # User wishlist page (/wishlist)
    │   │
    │   ├── blog/
    │   │   ├── layout.tsx            # Blog layout wrapper
    │   │   ├── loading.tsx           # Blog loading skeleton
    │   │   ├── page.tsx              # Blog listing page (/blog)
    │   │   ├── [slug]/
    │   │   │   └── page.tsx          # Single blog post (/blog/:slug)
    │   │   ├── category/[slug]/
    │   │   │   └── page.tsx          # Blog by category
    │   │   ├── tag/[slug]/
    │   │   │   └── page.tsx          # Blog by tag
    │   │   ├── author/[id]/
    │   │   │   └── page.tsx          # Blog by author
    │   │   └── search/
    │   │       └── page.tsx          # Blog search results
    │   │
    │   └── admin/
    │       ├── layout.tsx            # Admin layout (sidebar + topbar + auth guard)
    │       ├── page.tsx              # Admin root → redirects to dashboard
    │       ├── login/
    │       │   └── page.tsx          # Admin login (/admin/login)
    │       ├── dashboard/
    │       │   └── page.tsx          # Dashboard overview (/admin/dashboard)
    │       ├── cars/
    │       │   ├── page.tsx          # Cars list + approve/reject (/admin/cars)
    │       │   └── new/
    │       │       └── page.tsx      # Add/Edit car form (/admin/cars/new)
    │       ├── blogs/
    │       │   ├── page.tsx          # Blog posts list (/admin/blogs)
    │       │   └── new/
    │       │       └── page.tsx      # Create/Edit blog (/admin/blogs/new)
    │       ├── inquiries/
    │       │   └── page.tsx          # Contact inquiries (/admin/inquiries)
    │       ├── inspections/
    │       │   └── page.tsx          # Inspection bookings (/admin/inspections)
    │       ├── users/
    │       │   └── page.tsx          # User management (/admin/users)
    │       ├── seo/
    │       │   └── page.tsx          # SEO settings (/admin/seo)
    │       ├── analytics/
    │       │   └── page.tsx          # Analytics dashboard (/admin/analytics)
    │       └── settings/
    │           └── page.tsx          # Site settings (/admin/settings)
    │
    ├── components/                   # Reusable UI components
    │   ├── navbar.tsx
    │   ├── footer.tsx
    │   ├── hero-section.tsx
    │   ├── featured-cars.tsx
    │   ├── browse-brands.tsx
    │   ├── why-choose-us.tsx
    │   ├── cta-section.tsx
    │   ├── scroll-to-top.tsx
    │   ├── blog-card.tsx
    │   ├── blog-categories.tsx
    │   ├── blog-newsletter.tsx
    │   ├── blog-search.tsx
    │   ├── blog-share.tsx
    │   ├── blog-toc.tsx
    │   └── ui/                       # shadcn/ui base components
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── table.tsx
    │       └── textarea.tsx
    │
    ├── hooks/
    │   └── useRealtimeNotifications.ts  # Supabase realtime hook (admin)
    │
    └── lib/
        ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
        ├── supabase.ts               # Legacy supabase client (anon key)
        ├── supabase/
        │   ├── client.ts             # Browser Supabase client
        │   ├── server.ts             # Server Supabase clients (anon + service role)
        │   └── types.ts              # Full TypeScript database types
        ├── actions.ts                # Server Actions (sell-car, inquiry, inspection)
        ├── server-actions.ts         # Server Actions v2 (fetchApprovedCars, getCarById)
        ├── admin-actions.ts          # Admin Server Actions (CRUD cars, blogs, etc.)
        ├── car-data.ts               # Static mock car data (12 cars) — LEGACY
        ├── home-cars.ts              # DbCar → HomeCarCard mapper
        ├── blog-utils.ts             # Blog helpers (readTime, formatDate, slugify)
        ├── storage.ts                # localStorage helpers + Supabase storage utils
        └── wishlist.ts               # localStorage wishlist helpers
```

---

## 5. DATABASE SCHEMA (SUPABASE)

### Tables

#### `cars`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| seller_id | uuid | FK → users.id (nullable) |
| title | text | e.g. "2023 Toyota Corolla GLi" |
| slug | text | URL-friendly slug (nullable) |
| make | text | e.g. "Toyota" |
| model | text | e.g. "Corolla" |
| year | int | e.g. 2023 |
| mileage | int | in km (nullable) |
| price | int | in PKR (full amount, not lacs) |
| currency | text | default "PKR" |
| condition | text | e.g. "Used", "New" |
| fuel_type | text | e.g. "Petrol", "Hybrid" |
| transmission | text | e.g. "Automatic", "Manual" |
| color | text | nullable |
| city | text | e.g. "Lahore" |
| description | text | nullable |
| features | jsonb | array of strings |
| images | jsonb | array of image URLs |
| status | enum | 'pending' / 'approved' / 'rejected' / 'draft' |
| is_featured | bool | default false |
| views_count | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |

#### `inquiries`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | Sender's name |
| email | text | Sender's email |
| phone | text | nullable |
| subject | text | |
| message | text | |
| car_id | uuid | FK → cars.id (nullable) |
| status | enum | 'pending' / 'read' / 'replied' / 'archived' |
| is_read | bool | default false |
| created_at | timestamp | |

#### `inspections`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| make | text | |
| model | text | |
| year | int | |
| registration_number | text | |
| address | text | Inspection location |
| plan | enum | 'basic' / 'standard' / 'premium' |
| plan_price | int | 3500 / 5500 / 8500 PKR |
| scheduled_date | text | Date string |
| time_slot | text | e.g. "morning" / "afternoon" |
| customer_name | text | |
| customer_phone | text | |
| customer_email | text | nullable |
| status | enum | 'pending' / 'scheduled' / 'completed' / 'cancelled' |
| created_at | timestamp | |

#### `blogs`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | |
| slug | text | URL slug (unique) |
| excerpt | text | nullable |
| content | text | HTML or plain text |
| featured_image | text | URL (nullable) |
| author_id | uuid | FK → users.id (nullable) |
| status | enum | 'draft' / 'published' / 'scheduled' |
| published_at | timestamp | nullable |
| created_at | timestamp | |

#### `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | e.g. "News", "Reviews" |
| slug | text | e.g. "news", "reviews" |

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| auth_user_id | uuid | Supabase auth user ID (nullable) |
| name | text | |
| email | text | |
| phone | text | nullable |
| role | enum | 'buyer' / 'seller' / 'admin' / 'content_manager' / 'inspection_manager' |
| status | enum | 'active' / 'suspended' / 'pending' |
| avatar_url | text | nullable |
| bio | text | nullable |
| listings_count | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |
| last_login | timestamp | nullable |

#### `seo_settings`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| site_name | text | nullable |
| meta_title | text | nullable |
| meta_description | text | nullable |
| contact_email | text | nullable |
| contact_phone | text | nullable |
| address | text | nullable |
| social_links | jsonb | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### Database Functions
- `increment_car_views(car_id uuid)` — Views counter increment karta hai (RPC)

---

## 6. PUBLIC WEBSITE PAGES

---

### 6.1 Homepage — `/`
**File:** `src/app/page.tsx`
**Type:** Server Component (async)

**Kya karta hai:**
- Homepage render karta hai with hero, featured cars, recent cars, brands, why-choose-us, CTA sections
- Supabase se **directly** (server-side) do queries run karta hai:
  1. Featured cars: `status=approved AND is_featured=true` (limit 6, newest first)
  2. Recent cars: `status=approved` (limit 8, newest first)
- `mapDbCarToHomeCard()` se database cars ko display format mein convert karta hai

**Supabase Connected:** ✅ YES (server-side)
**Components Used:** Navbar, HeroSection, FeaturedCars, RecentlyAddedCars, BrowseByBrand, WhyChooseUs, CTASection, Footer
**SEO:** Static metadata in `layout.tsx` — title, description, keywords, apple web app

---

### 6.2 Buy Car Page — `/buy-car`
**File:** `src/app/buy-car/page.tsx`
**Type:** Client Component (`'use client'`)

**Kya karta hai:**
- Cars ka browseable marketplace with filters aur pagination
- Filters: Make/Brand, Max Price (slider), Model Year, Fuel Type (checkboxes)
- Sort options: Newest First, Price Low→High, Price High→Low, Year Newest
- URL search param se initial search query sync karta hai
- Active filter badges show karta hai (individually removable)
- Loading state mein skeleton cards show karta hai
- Empty state mein "No Cars Found" message

**Supabase Connected:** ✅ YES
- `fetchApprovedCars()` server action call karta hai jo `status=approved` cars return karta hai
- Filters, sorting, pagination sab server action mein handle hota hai
- `isInWishlist()`, `addToWishlist()`, `removeFromWishlist()` — localStorage se

**Pagination:** 6 cars per page, paginated buttons
**Wishlist:** localStorage based (car IDs stored as numbers — BUG: DB IDs are UUIDs)
**Mobile:** Sheet component se slide-out filter panel

---

### 6.3 Car Details Page — `/buy-car/[id]`
**File:** `src/app/buy-car/[id]/page.tsx`
**Type:** Client Component (`'use client'`)

**Kya karta hai:**
- Single car ki detailed view
- Image gallery with thumbnail switcher
- Key specs grid: Year, Mileage, Fuel, Engine, Transmission
- Tab system: Description / Features & Options / Inspection Report
- Similar cars section (horizontal scroll, same brand se)
- "Contact Seller" modal — form submit karta hai inquiry as
- "Make an Offer" modal — offer form submit karta hai inquiry as
- View counter increment
- "12 people viewing" realtime-looking badge (STATIC/FAKE)
- Mobile sticky bottom bar with Contact + Offer buttons

**Supabase Connected:** ✅ YES
- `getCarById(id)` — single car fetch
- `incrementCarViews(id)` — RPC call ya manual update
- `fetchApprovedCars({ make })` — similar cars
- `submitInquiry()` — contact/offer form submission

---

### 6.4 Sell Car Page — `/sell-car`
**File:** `src/app/sell-car/page.tsx`
**Type:** Client Component (`'use client'`)

**Kya karta hai:**
- 4-step wizard for selling a car:
  - **Step 1:** Vehicle Details (Make, Model, Year, Mileage, Fuel, Transmission, Engine CC)
  - **Step 2:** Pricing & Location (City, Price in Lacs, Seller Name/Phone, Description)
  - **Step 3:** Photo Upload (drag-drop or file picker, preview with remove)
  - **Step 4:** Success screen (shows what happens next)
- Step validation (disabled Continue button jab tak required fields nahi bhare)
- Custom toast messages (success/error)

**Supabase Connected:** ✅ YES
- `submitCarListing()` from `server-actions.ts` call karta hai
- Images Supabase Storage `car-images` bucket mein upload hoti hain
- Car `status: 'pending'` ke saath insert hota hai
- Price: lacs input → `* 100000` = PKR stored

**Notes:**
- `submitCarListing` `actions.ts` aur `server-actions.ts` dono mein hai (DUPLICATE) — page `server-actions.ts` version use karta hai
- Sell button sirf tabhi enable hota hai jab minimum 1 image upload ho

---

### 6.5 Wishlist Page — `/wishlist`
**File:** `src/app/wishlist/page.tsx`
**Type:** Client Component (`'use client'`)

**Kya karta hai:**
- User ki saved/wishlisted cars show karta hai
- Remove button se individual car remove kar sakte hain
- Empty state with CTA to browse cars
- `wishlist-updated` custom event listen karta hai

**Supabase Connected:** ❌ NO
- **PROBLEM:** Wishlist page `car-data.ts` ki **static mock data** use karta hai (`getAllCars()`)
- Wishlist IDs numbers hain (1-12) lekin database IDs UUIDs hain
- Agar DB se car add ki gayi aur wishlist mein save ki toh woh show NAHI hogi
- Yeh page sirf static 12 mock cars ke liye kaam karta hai

---

### 6.6 Inspections Page — `/inspections`
**File:** `src/app/inspections/page.tsx`
**Type:** Client Component (`'use client'`)

**Kya karta hai:**
- Landing section: inspection features describe karta hai (6 feature cards)
- "Book an Inspection" button se booking flow start hota hai
- 4-step booking wizard:
  - **Step 1:** Vehicle details (Make, Model, Year, Reg Number, Address)
  - **Step 2:** Plan selection (Basic PKR 3500 / Standard PKR 5500 / Premium PKR 8500)
  - **Step 3:** Schedule (Date picker, Time slot, Customer name/phone)
  - **Step 4:** Success confirmation with Booking ID

**Supabase Connected:** ✅ YES
- `submitInspectionBooking()` from `actions.ts` use karta hai
- Inspection `inspections` table mein insert hota hai
- Booking ID success screen par show hota hai

---

### 6.7 Blog Listing Page — `/blog`
**File:** `src/app/blog/page.tsx`
**Type:** Server Component (async)
**Cache:** `revalidate = 3600` (1 hour)

**Kya karta hai:**
- Blog posts list karta hai
- Featured article (first post), categories, recent posts grid
- Newsletter signup section
- Search bar

**Supabase Connected:** ⚠️ PARTIALLY
- `getBlogData()` function hai lekin **HARDCODED fallback data return karta hai** — Supabase call commented/skipped
- 2 static fallback posts hamesha show honge regardless of DB content
- Categories bhi static fallback hain

---

### 6.8 Blog Post Detail Page — `/blog/[slug]`
**File:** `src/app/blog/[slug]/page.tsx`
**Type:** Server Component (async)
**Cache:** `revalidate = 3600`

**Kya karta hai:**
- Single blog post full content render karta hai
- Breadcrumb navigation
- Author info box
- Read time calculation
- Table of Contents (BlogTOC component)
- Social share buttons (BlogShare component)
- Related posts section
- Tags section
- Comments section (disabled)
- OpenGraph metadata generation

**Supabase Connected:** ⚠️ PARTIALLY
- `getPost(slug)` pehle fallback posts check karta hai — agar match toh DB call nahi hota
- Static fallback slugs: `first-blog`, `second-blog`
- Actual DB posts bhi fetch kar sakta hai by slug

---

## 7. ADMIN PANEL PAGES

**Base Path:** `/admin`
**Auth Guard:** `admin/layout.tsx` mein localStorage se `cf_admin_user` check hota hai
**Login Credentials (HARDCODED):**
- Email: `admin@carfever.com`
- Password: `admin123`

> ⚠️ **SECURITY NOTE:** Admin auth sirf localStorage based hai — real Supabase auth nahi hai. Production ke liye replace karna zaroori hai.

---

### 7.1 Admin Login — `/admin/login`
**File:** `src/app/admin/login/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Dark themed login card
- Demo credentials hint visible
- Submit pe hardcoded check: `admin@carfever.com / admin123`
- Success pe `cf_admin_user` JSON localStorage mein store karta hai
- Already logged in hone par dashboard redirect
- 900ms simulated loading delay

**Supabase Connected:** ❌ NO (pure localStorage auth)

---

### 7.2 Admin Dashboard — `/admin/dashboard`
**File:** `src/app/admin/dashboard/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- 4 stat cards: Total Views, Car Listings, Active Users, Blog Posts
- Bar chart (manual CSS bars, mock data)
- Recent Activity panel (STATIC hardcoded data)
- Quick Action links (Add Car, Write Post, View Cars, View Inquiries)

**Supabase Connected:** ⚠️ PARTIALLY
- Cars count: `supabase.from('cars').select('*', { count: 'exact', head: true })` ✅
- Blogs count: `supabase.from('blogs').select('*', { count: 'exact', head: true })` ✅
- Users count: **HARDCODED** `1284`
- Views count: **HARDCODED** `48320`
- Recent Activity: **HARDCODED** static array (not real DB data)
- Monthly Traffic chart: **MOCK** math.sin() generated data

---

### 7.3 Admin Layout — `/admin/layout.tsx`
**File:** `src/app/admin/layout.tsx`
**Type:** Client Component

**Kya karta hai:**
- Dark sidebar (240px fixed) with navigation menu
- Mobile hamburger menu + overlay
- Top header bar with breadcrumb, notification bell, profile dropdown
- Auth guard: localStorage check, unauthenticated → `/admin/login`
- **Realtime notifications** via `useRealtimeNotifications()` hook
- Notification badge counts on Cars + Inquiries menu items
- Bell icon badge with total count

**Sidebar Menu Items:**
1. Dashboard → `/admin/dashboard`
2. Manage Cars → `/admin/cars`
3. Manage Blogs → `/admin/blogs`
4. Inspections → `/admin/inspections`
5. Inquiries → `/admin/inquiries`
6. Manage Users → `/admin/users`
7. SEO Settings → `/admin/seo`
8. Site Settings → `/admin/settings`
9. Analytics → `/admin/analytics`

---

### 7.4 Admin Cars — `/admin/cars`
**File:** `src/app/admin/cars/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Cars table (title, make, year, price, status, date added)
- Debounced search by title (450ms delay)
- Status badges: Approved (green), Pending (orange), Rejected (red)
- Per-row action dropdown (3-dot menu):
  - Edit → `/admin/cars/new?id=CAR_ID`
  - Approve
  - Reject
  - Delete (confirm dialog)
- Toast notifications on all actions

**Supabase Connected:** ✅ YES
- Fetch: `supabase.from('cars').select(...)` with optional title filter
- Approve: `approveCar(id)` → `updateCar(id, { status: 'approved' })`
- Reject: `rejectCar(id)` → `updateCar(id, { status: 'rejected' })`
- Delete: `deleteCar(id)` → `supabase.from('cars').delete()`

---

### 7.5 Admin Cars New/Edit — `/admin/cars/new`
**File:** `src/app/admin/cars/new/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- New car create karna (no `?id` param)
- Existing car edit karna (`?id=UUID` param)
- Form sections: Basic Info, Specifications, Images, Description
- Fields: title, make, model, year, price, mileage, transmission, fuel_type, body_type, exterior_color, engine, horsepower, description, status
- Image upload with preview + remove

**Supabase Connected:** ✅ YES
- Fetch: `supabase.from('cars').select('*').eq('id', id)`
- Create: `createCar(data)` server action
- Update: `updateCar(id, data)` server action
- Image upload: `uploadImage(file)` — **MOCK** (returns dummy URL, NOT real Supabase storage)

**⚠️ BUG:** `uploadImage()` in `admin-actions.ts` is a **MOCK** — returns `dummyimage.com` URL. Real storage upload code is commented out.

---

### 7.6 Admin Blogs — `/admin/blogs`
**File:** `src/app/admin/blogs/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Blog posts table (title, category, status, views, date)
- Debounced search
- Per-row actions: Edit, Preview, Publish, Delete
- Status badges: Published (green), Draft (orange)

**Supabase Connected:** ✅ YES
- Fetch: `supabase.from('blogs').select('id, title, status, views_count, created_at, featured_image, categories(name)')`
- **⚠️ BUG:** `categories(name)` — `blogs` table mein `category_id` foreign key nahi hai `categories` table se (types.ts mein relationship nahi define), yeh query fail ho sakti hai

---

### 7.7 Admin Blogs New/Edit — `/admin/blogs/new`
**File:** `src/app/admin/blogs/new/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Blog create/edit form
- Auto-generate slug from title (new post ke liye)
- Featured image upload
- SEO settings section (meta title, description, focus keyword)
- Save Draft + Publish buttons

**Supabase Connected:** ✅ YES
- Categories fetch: `supabase.from('categories').select('*')`
- Blog fetch (edit): `supabase.from('blogs').select('*').eq('id', id)`
- Create: `createBlog(data)` server action
- Update: `updateBlog(id, data)` server action
- **⚠️ BUG:** `uploadImage()` MOCK hai (same as cars)

---

### 7.8 Admin Inquiries — `/admin/inquiries`
**File:** `src/app/admin/inquiries/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Inquiries table (desktop) + cards (mobile)
- Stats: Total, Unread, This Week
- Search by name/email
- Filter: All / Unread / Read
- Mark as Read/Unread
- Mark All Read button
- Clear All button (with confirmation)
- View full message modal
- Delete with confirmation

**Supabase Connected:** ✅ YES (full)
- Fetch: Supabase client, `inquiries` table, ordered by `created_at`
- Update status: `updateInquiryStatus()` server action
- Delete: `deleteInquiry()` server action
- Mark all read: `markAllInquiriesRead()` server action
- Clear all: `clearAllInquiries()` server action

---

### 7.9 Admin Inspections — `/admin/inspections`
**File:** `src/app/admin/inspections/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Inspection bookings list (expandable rows)
- Stats: Pending, Scheduled, Completed, Cancelled
- Expand row → customer details, location, booking ID
- Mark Complete / Cancel buttons
- Delete button

**Supabase Connected:** ✅ YES (full)
- Fetch: `supabase.from('inspections').select('*')` ordered by created_at
- Update status: `updateInspectionStatus()` server action
- Delete: `deleteInspection()` server action

---

### 7.10 Admin Users — `/admin/users`
**File:** `src/app/admin/users/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Users table with search
- Stats: Total, Active, Suspended, Sellers
- Per-user: View Profile button, Suspend/Activate toggle
- Role badges (Buyer, Seller, Both)
- Status badges (Active, Suspended, Pending)

**Supabase Connected:** ❌ NO
- **Completely STATIC/MOCK data** — 8 hardcoded users in component
- Suspend/Activate sirf local state mein change hota hai, DB update nahi karta
- "View Profile" button kaam nahi karta (no navigation)

---

### 7.11 Admin SEO — `/admin/seo`
**File:** `src/app/admin/seo/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- Page selector (Home, Cars, About, Contact, Blog)
- Per-page SEO fields: Meta Title, Meta Description, Canonical URL, OG Image, JSON-LD Schema
- Character count hints
- Save button

**Supabase Connected:** ⚠️ PARTIALLY BROKEN
- Fetch: `supabase.from('seo_settings').select('*').eq('page_path', selectedPage)`
- Save: `updateSEOSettings(path, data)` server action
- **⚠️ BUG:** `seo_settings` table current schema mein `page_path`, `canonical_url`, `og_image`, `schema_markup` columns **NAHI HAIN** (types.ts mein ye columns defined nahi). Actual table columns hain: `site_name`, `meta_title`, `meta_description`, `contact_email`, `contact_phone`, `address`, `social_links`
- Queries fail hongi ya empty data return karengi

---

### 7.12 Admin Analytics — `/admin/analytics`
**File:** `src/app/admin/analytics/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- 4 stat cards: Page Views, Unique Visitors, Conversion Rate, Avg Session Duration
- Revenue Trend area chart (SVG)
- Blog Traffic bar chart
- Inspection Status pie chart
- Top Performing Cars list
- Time range filter (7 days / 30 days / 12 months)
- Export button

**Supabase Connected:** ❌ NO
- **Completely STATIC/MOCK data** — all numbers hardcoded
- Charts are CSS/SVG with hardcoded values
- Time range filter UI only, no actual data change
- Export button does nothing

---

### 7.13 Admin Settings — `/admin/settings`
**File:** `src/app/admin/settings/page.tsx`
**Type:** Client Component

**Kya karta hai:**
- General Info: Site Name, Contact Email, Support Phone, Currency
- API Keys: Stripe Public Key, Google Analytics ID
- Save button

**Supabase Connected:** ❌ NO
- **Completely MOCK** — save button just shows toast after 800ms delay
- No actual DB save hota hai

---

## 8. COMPONENTS LIBRARY

### Public Components

#### `navbar.tsx`
- Responsive navigation bar
- Logo + menu items (Home, Buy Car, Sell Car, Blog, Inspections)
- Wishlist icon with count badge (localStorage based)
- Mobile hamburger menu

#### `hero-section.tsx`
- Homepage hero with search bar
- Search input → routes to `/buy-car?search=query`
- Background gradient, animated elements

#### `featured-cars.tsx`
- Exports `FeaturedCars` and `RecentlyAddedCars` components
- Takes `cars: HomeCarCard[]` prop
- Displays car cards with price, year, mileage, fuel, location
- Heart/wishlist button (localStorage)
- Links to `/buy-car/{id}`
- Fallback UI when no cars in DB

#### `browse-brands.tsx`
- Brand logos/names grid (Toyota, Honda, Suzuki, KIA, Hyundai, Tesla)
- Click → navigates to `/buy-car?make=BrandName` (if implemented)

#### `why-choose-us.tsx`
- Static feature cards explaining platform benefits

#### `cta-section.tsx`
- Call-to-action section with Sell Car + Book Inspection links

#### `footer.tsx`
- Links, social icons, copyright

#### `scroll-to-top.tsx`
- Floating scroll-to-top button (appears after scrolling down)

### Blog Components

#### `blog-card.tsx`
- Blog post card (thumbnail, title, excerpt, author, date, views)
- `featured` prop for large featured layout

#### `blog-categories.tsx`
- Category pills/badges with post count

#### `blog-newsletter.tsx`
- Email newsletter signup form (UI only, no backend)

#### `blog-search.tsx`
- Search input for blog posts

#### `blog-toc.tsx`
- Table of Contents generated from HTML headings (h2, h3)
- Parses `content` prop for headings

#### `blog-share.tsx`
- Social share buttons (Twitter/X, Facebook, WhatsApp, copy link)
- Uses Web Share API

### UI Components (shadcn/ui)
`badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `separator`, `sheet`, `table`, `textarea`

---

## 9. LIB / UTILITY FILES

### `lib/supabase/client.ts`
```typescript
// Browser-side Supabase client (createBrowserClient from @supabase/ssr)
createClient() → SupabaseClient
```
Use: Client Components, Realtime subscriptions

### `lib/supabase/server.ts`
```typescript
createServerClient()       // Anon key, respects RLS — for Server Components
createServiceRoleClient()  // Service role, bypasses RLS — ONLY Server Actions
isSupabaseConfigured()     // Boolean check for env vars
```

### `lib/supabase/types.ts`
- Complete TypeScript types for all DB tables
- `Database` interface with Tables, Views, Functions
- Individual types: `DbCar`, `DbUser`, `DbInquiry`, `DbInspection`, `DbBlog`, `DbCategory`, `DbSEOSetting`
- Enum types: `CarStatus`, `InquiryStatus`, `InspectionStatus`, `InspectionPlan`, `UserRole`, `UserStatus`, `BlogStatus`

### `lib/supabase.ts` (LEGACY)
```typescript
// Old-style direct createClient() — used by admin pages
export const supabase        // Anon key client
export const supabaseAdmin   // Service role client
```
⚠️ Not type-safe — no Database generic. Admin pages use this instead of the typed server.ts

### `lib/server-actions.ts` (PRIMARY)
Server Actions — `'use server'` directive
- `fetchApprovedCars(filters)` — Filtered/sorted/paginated approved cars
- `submitCarListing(formData)` — Car listing + image upload
- `submitInquiry(formData)` — Contact form submission
- `submitInspectionBooking(formData)` — Inspection booking
- `getCarById(id)` — Single car fetch
- `incrementCarViews(id)` — RPC + fallback manual update

### `lib/actions.ts` (DUPLICATE — older version)
Same server actions as server-actions.ts — slight differences:
- `submitCarListing`: price `* 1000000` (WRONG, should be `* 100000`)
- `submitInspectionBooking` identical
- `submitInquiry` identical
⚠️ **DUPLICATE CODE** — pages should use `server-actions.ts` only

### `lib/admin-actions.ts`
Admin Server Actions — `'use server'` directive
- `createCar(data)` / `updateCar(id, data)` / `deleteCar(id)`
- `approveCar(id)` / `rejectCar(id)`
- `createBlog(data)` / `updateBlog(id, data)` / `deleteBlog(id)` / `publishBlog(id)`
- `uploadImage(file)` — **MOCK** returns dummy URL
- `updateSEOSettings(path, data)` — queries non-existent `page_path` column
- `getAnalytics(type, dateRange)` — **MOCK** returns random numbers
- `updateInquiryStatus(id, status)` / `deleteInquiry(id)` / `markAllInquiriesRead()` / `clearAllInquiries()`
- `updateInspectionStatus(id, status)` / `deleteInspection(id)`

### `lib/car-data.ts` (LEGACY STATIC DATA)
- 12 hardcoded static car listings (Toyota Corolla, Honda Civic, etc.)
- `getAllCars()` / `getCarById(id: number)` functions
- **Only used by wishlist page** — should be replaced with DB fetch
- IDs are numbers (1-12), incompatible with UUID-based DB

### `lib/home-cars.ts`
- `mapDbCarToHomeCard(car: DbCar): HomeCarCard` — DB car → display format
- Price conversion: `price / 100000` → Lacs format
- Image fallback to Unsplash

### `lib/blog-utils.ts`
- `calculateReadTime(content)` — words/200 = minutes
- `formatDate(dateString)` — "Jan 15, 2026"
- `formatRelativeDate(dateString)` — "2 days ago"
- `generateExcerpt(content, length)` — strips HTML, truncates
- `slugify(text)` — "My Title" → "my-title"

### `lib/wishlist.ts`
- localStorage based wishlist (`cf_wishlist` key)
- `getWishlist(): number[]`
- `addToWishlist(carId: number)`
- `removeFromWishlist(carId: number)`
- `isInWishlist(carId: number): boolean`
- `getWishlistCount(): number`
- Dispatches `wishlist-updated` custom event on change
⚠️ **BUG:** IDs are `number` type but DB uses UUIDs (strings)

### `lib/storage.ts`
Two separate purposes:
1. **localStorage helpers** (seed data, CRUD for mock data) — used by old admin flow
2. **Supabase Storage helpers:**
   - `uploadCarImages(carId, files[])` — uploads to `car-images` bucket
   - `deleteCarImages(urls[])` — deletes from `car-images` bucket

### `lib/utils.ts`
```typescript
cn(...inputs: ClassValue[]) // tailwind-merge + clsx helper
```

---

## 10. HOOKS

### `hooks/useRealtimeNotifications.ts`
**Type:** Client Hook (`'use client'`)
**Used In:** `admin/layout.tsx`

**Kya karta hai:**
Supabase Realtime subscriptions setup karta hai — 3 channels:

**Channel 1: `admin-cars-notifications`**
- `INSERT` on `cars` where `status=pending` → counter increment + toast "New Car Listing Submitted!"
- `UPDATE` on `cars` → status change detect karta hai
  - `approved` → toast "Car Approved!"
  - `rejected` → toast "Car Rejected"

**Channel 2: `admin-inquiries-notifications`**
- `INSERT` on `inquiries` → counter increment + toast "New Inquiry Received!"
- Toast mein sender name + subject show hota hai
- Action button "View" → `/admin/inquiries`

**Channel 3: `admin-inspections-notifications`**
- `INSERT` on `inspections` → toast "New Inspection Booked!"
- `UPDATE` on `inspections` → status change toast

**Returns:**
```typescript
{
  newListingsCount: number,
  newInquiriesCount: number,
  clearCounts: () => void
}
```

**Status:** ✅ Code complete — Supabase Realtime configured karna hoga DB mein (Realtime enabled on tables)

---

## 11. SUPABASE INTEGRATION MAP

### Kaunse Pages/Files Supabase Use Karte Hain

| File | Client Type | Tables Used | Purpose |
|------|------------|-------------|---------|
| `app/page.tsx` | Server (anon) | `cars` | Featured + recent cars fetch |
| `app/buy-car/page.tsx` | Server Action | `cars` | Filtered car listing |
| `app/buy-car/[id]/page.tsx` | Server Action | `cars`, `inquiries` | Car detail, views, inquiry |
| `app/sell-car/page.tsx` | Server Action | `cars` + Storage | New listing submit |
| `app/inspections/page.tsx` | Server Action | `inspections` | Book inspection |
| `app/blog/page.tsx` | None (fallback) | ~~`blogs`~~ | Blogs list (HARDCODED) |
| `app/blog/[slug]/page.tsx` | Direct (anon) | `blogs`, `categories` | Single post |
| `admin/dashboard/page.tsx` | Direct (legacy) | `cars`, `blogs` | Stats count |
| `admin/cars/page.tsx` | Direct (legacy) | `cars` | List + search |
| `admin/cars/new/page.tsx` | Direct (legacy) | `cars` | Create/edit |
| `admin/blogs/page.tsx` | Direct (legacy) | `blogs`, `categories` | List + search |
| `admin/blogs/new/page.tsx` | Direct (legacy) | `blogs`, `categories` | Create/edit |
| `admin/inquiries/page.tsx` | Direct (client) | `inquiries` | Full CRUD |
| `admin/inspections/page.tsx` | Direct (legacy) | `inspections` | List + status |
| `admin/seo/page.tsx` | Direct (legacy) | `seo_settings` | SEO CRUD (BROKEN) |
| `hooks/useRealtimeNotifications.ts` | Direct (client) | `cars`, `inquiries`, `inspections` | Realtime |
| `lib/storage.ts` | Direct (anon) | Storage: `car-images` | Image upload |

### Supabase Clients Used

There are **3 different Supabase clients** being used inconsistently:

1. **`createClient()` from `lib/supabase/client.ts`** — Browser client (SSR compatible)
   - Used by: `inquiries/page.tsx`, `useRealtimeNotifications.ts`

2. **`supabase` from `lib/supabase.ts`** — Legacy direct client (no type safety)
   - Used by: `dashboard`, `cars`, `blogs`, `inspections` admin pages

3. **`createServerClient()` / `createServiceRoleClient()` from `lib/supabase/server.ts`** — Type-safe server clients
   - Used by: Server Actions in `server-actions.ts`, `admin-actions.ts`, `actions.ts`

---

## 12. SEO IMPLEMENTATION

### Static SEO (Working ✅)
**Root Layout** (`app/layout.tsx`):
```typescript
metadata: {
  title: "Car Fever — Premium Car Marketplace",
  description: "...",
  keywords: ["car marketplace", "buy cars", ...],
  appleWebApp: { capable: true, title: "Car Fever" },
  formatDetection: { telephone: true, email: true }
}
viewport: {
  themeColor: "#0055FE",
  width: "device-width"
}
```

**Blog Post Page** (`app/blog/[slug]/page.tsx`):
```typescript
// Dynamic metadata per post
generateMetadata() → {
  title: post.meta_title || `${post.title} | Car Fever Blog`,
  description: post.meta_description || post.excerpt,
  openGraph: {
    title, description, type: 'article',
    publishedTime, images: [featured_image]
  }
}
```

**Blog Listing** (`app/blog/page.tsx`):
```typescript
metadata: {
  title: "Car Fever Blog - Latest Automotive News & Reviews",
  description: "..."
}
```

**PWA Manifest** (`app/manifest.ts`):
- Web app manifest for progressive web app support

### Dynamic SEO (Admin Panel — Broken ⚠️)
- Admin SEO page `seo_settings` table use karta hai
- But table schema mismatch hai — `page_path`, `canonical_url`, `og_image`, `schema_markup` columns DB mein nahi hain
- Pages pe dynamic SEO inject karne ka mechanism nahi bana

### Missing SEO Features
- No sitemap.xml generation
- No robots.txt
- No structured data (JSON-LD) on car detail pages
- No canonical URLs on dynamic pages
- No OpenGraph on buy-car pages

---

## 13. REALTIME FEATURES

### Admin Realtime Notifications ✅ (Code complete, needs DB config)
**Hook:** `useRealtimeNotifications.ts`
**Trigger:** Admin layout load pe subscribe hota hai

**3 active channels:**
1. **Cars channel** — new pending listings + status changes
2. **Inquiries channel** — new inquiries
3. **Inspections channel** — new bookings + status changes

**Visual indicators:**
- Sidebar menu: red badge count on Cars + Inquiries items
- Header: bell icon red badge (total count)
- Toast notifications (sonner) with action buttons

**Requirements for Realtime to work:**
- Supabase project mein Realtime feature enabled hona chahiye
- Tables par Realtime enabled hona chahiye (`cars`, `inquiries`, `inspections`)
- Supabase Dashboard → Database → Replication → Tables

### "12 people viewing" Indicator ❌ (FAKE/STATIC)
- `/buy-car/[id]` page par yeh badge hardcoded hai
- Real presence tracking nahi hai
- Implement karna ho toh Supabase Presence API use karein

---

## 14. FEATURE STATUS (WORKING VS BROKEN)

### ✅ FULLY WORKING

| Feature | Location | Notes |
|---------|----------|-------|
| Homepage car display | `/` | DB se featured + recent cars |
| Browse & filter cars | `/buy-car` | Full filter, sort, pagination |
| Car detail view | `/buy-car/[id]` | DB se real car data |
| Car view counter | `/buy-car/[id]` | RPC + fallback |
| Contact Seller form | `/buy-car/[id]` | Supabase inquiries table |
| Make Offer form | `/buy-car/[id]` | Supabase inquiries table |
| Sell Car wizard | `/sell-car` | 4-step, DB insert, image upload |
| Inspection booking | `/inspections` | 4-step, DB insert |
| Admin login | `/admin/login` | localStorage based |
| Admin sidebar nav | All admin pages | Responsive, realtime badges |
| Cars CRUD (admin) | `/admin/cars` | Full approve/reject/delete |
| Cars list search | `/admin/cars` | Debounced search |
| Blogs CRUD (admin) | `/admin/blogs` | Full publish/delete |
| Blog create/edit | `/admin/blogs/new` | Auto-slug, SEO fields |
| Inquiries management | `/admin/inquiries` | Full read/delete/filter |
| Inspections management | `/admin/inspections` | Status update, delete |
| Realtime notifications (code) | Admin layout | Code ready, needs DB setup |
| Admin dashboard stats (partial) | `/admin/dashboard` | Cars + blogs count real |
| Blog post detail | `/blog/[slug]` | Fallback + DB slugs |
| Static blog listing | `/blog` | Fallback data shows |
| Wishlist (mock only) | `/wishlist` | Works for static 12 cars only |
| Scroll to top | Global | Works |

---

### ⚠️ PARTIALLY WORKING

| Feature | Location | Issue |
|---------|----------|-------|
| Blog listing page | `/blog` | Hardcoded fallback — DB blogs nahi dikhte |
| Blog single post | `/blog/[slug]` | Real DB posts work by slug, but fallback preferred |
| Admin dashboard | `/admin/dashboard` | Users/views counts fake, activity fake |
| Admin SEO page | `/admin/seo` | UI works, DB save fails (schema mismatch) |
| Realtime notifications | Admin | Code ready, Supabase Realtime on by DB config needed |

---

### ❌ NOT WORKING / BROKEN

| Feature | Location | Issue |
|---------|----------|-------|
| Wishlist with DB cars | `/wishlist` | Uses old static data, UUID mismatch |
| Admin Users page | `/admin/users` | Static hardcoded data, no DB |
| Admin Analytics | `/admin/analytics` | All static/mock data |
| Admin Settings save | `/admin/settings` | Mock save, no DB write |
| Admin image upload | `/admin/cars/new`, `/admin/blogs/new` | Returns dummy URL |
| SEO dynamic injection | All pages | No mechanism to apply DB SEO to pages |
| Admin real authentication | All admin | localStorage only, no Supabase Auth |
| "12 people viewing" | `/buy-car/[id]` | Hardcoded fake number |
| Blog views count | Admin blogs table | `views_count` column not in blogs schema |
| Blog categories query | Admin blogs | `categories(name)` join may fail |
| Price calculation | `actions.ts` | `* 1000000` wrong (should be `* 100000`) |
| Car detail wishlist button | `/buy-car/[id]` | Heart button in gallery (top-right) nahi toggle hota properly |
| Load More button | `/blog` | No functionality, static |
| Blog comments | `/blog/[slug]` | Always shows "disabled" |
| Inspection Download Report | `/buy-car/[id]` | Button nahi karta kuch |
| 360° View button | `/buy-car/[id]` | Cosmetic only, no functionality |

---

## 15. KNOWN ISSUES & BUGS

### 🔴 CRITICAL BUGS

**BUG-001: Wishlist UUID vs Number mismatch**
- Location: `lib/wishlist.ts`, `app/wishlist/page.tsx`
- Problem: Wishlist IDs `number[]` (1,2,3...) hain, lekin DB car IDs UUIDs hain
- Result: DB se aane wali cars kabhi wishlist page par show nahi hongi
- Fix: Wishlist ko UUID strings use karne ke liye update karo, DB se cars fetch karo

**BUG-002: Duplicate submitCarListing with wrong price**
- Location: `lib/actions.ts` line ~ 37
- Problem: `actions.ts` mein price `* 1000000` multiply hota hai (10x wrong)
- `server-actions.ts` mein sahi `* 100000` hai
- Sell car page `server-actions.ts` use karta hai toh yeh critical nahi, but confusing

**BUG-003: Admin image upload is MOCK**
- Location: `lib/admin-actions.ts` → `uploadImage()`
- Problem: Returns `dummyimage.com` URL — no real upload
- Result: Admin se add ki gayi cars/blogs mein fake image URLs honge

**BUG-004: SEO settings table schema mismatch**
- Location: `app/admin/seo/page.tsx`, `lib/admin-actions.ts` → `updateSEOSettings()`
- Problem: Code `page_path`, `canonical_url`, `og_image`, `schema_markup` columns query karta hai jo DB mein exist nahi karte
- Result: SEO settings save/load nahi honge, queries silent fail ya error throw karengi

**BUG-005: Admin authentication insecure**
- Location: `app/admin/login/page.tsx`, `app/admin/layout.tsx`
- Problem: Hardcoded credentials `admin@carfever.com / admin123`, sirf localStorage check
- Result: Anyone localStorage mein `cf_admin_user` set karke admin access le sakta hai
- Fix: Supabase Auth implement karo with proper session management

### 🟡 MEDIUM ISSUES

**ISSUE-001: Three different Supabase clients**
- `lib/supabase.ts` (legacy, untyped) + `lib/supabase/client.ts` + `lib/supabase/server.ts`
- Admin pages mostly legacy client use karte hain
- Consolidate to typed clients

**ISSUE-002: Duplicate server actions**
- `lib/actions.ts` aur `lib/server-actions.ts` mein same functions
- Confusion creates karta hai konsa use karna chahiye

**ISSUE-003: Blog page hardcoded data**
- `/blog` page sirf 2 fallback posts show karta hai
- DB mein published blogs nahi dikhengi
- `getBlogData()` function Supabase call skip karta hai

**ISSUE-004: Car detail page uses Client Component unnecessarily**
- `/buy-car/[id]/page.tsx` Client Component hai
- Could be Server Component for better SEO/performance
- Dynamic `params` ko server mein handle karna better hoga

**ISSUE-005: `blogs` table `views_count` column**
- Admin blogs list `views_count` column select karta hai
- `types.ts` mein `DbBlog` type mein yeh column nahi
- Query runtime error de sakti hai ya undefined return kar sakti hai

### 🟢 MINOR ISSUES

- `next.config.ts` mein sirf `images.unsplash.com` allowed — Supabase storage domain add karna hoga
- No error boundaries on any page
- Blog newsletter form no backend
- `360° View` button cosmetic only
- `Download Full Report` button cosmetic only
- "12 people viewing" hardcoded
- Analytics page `Export` button does nothing

---

## 16. DATA FLOW DIAGRAMS

### Car Listing Flow (Public → DB → Admin)

```
USER: /sell-car
  │
  ├─ Step 1-2: Form data (make, model, year, price, etc.)
  ├─ Step 3: Image files (uploaded)
  │
  └─ Submit → submitCarListing() [Server Action]
              │
              ├─ Images → Supabase Storage: car-images bucket
              ├─ Car data → cars table (status: 'pending')
              └─ revalidatePath('/admin/cars')
                          │
                          └─ REALTIME → useRealtimeNotifications
                                        │
                                        └─ Admin bell badge + Toast
                                                   │
                                             ADMIN: /admin/cars
                                                   │
                                             Approve/Reject
                                                   │
                                    → updateCar(id, {status: 'approved'})
                                                   │
                                          PUBLIC: /buy-car (visible)
```

### Inquiry Flow (Car Detail → DB → Admin)

```
USER: /buy-car/[id]
  │
  ├─ Contact Seller modal → form submit
  └─ Make Offer modal → form submit
              │
              └─ submitInquiry() [Server Action]
                          │
                          └─ inquiries table insert (status: 'pending')
                                     │
                                     └─ REALTIME → Admin toast "New Inquiry"
                                                          │
                                                  ADMIN: /admin/inquiries
                                                          │
                                                  Mark Read / Delete
```

### Inspection Flow

```
USER: /inspections
  │
  ├─ Step 1: Vehicle + Address
  ├─ Step 2: Plan selection (Basic/Standard/Premium)
  └─ Step 3: Date + Time + Contact
              │
              └─ submitInspectionBooking() [Server Action]
                          │
                          └─ inspections table insert (status: 'pending')
                                     │
                                     └─ REALTIME → Admin toast "New Inspection"
                                                          │
                                                  ADMIN: /admin/inspections
                                                          │
                                                  Mark Scheduled / Complete / Cancel
```

### Admin Authentication Flow (CURRENT — Insecure)

```
/admin/login
  │
  ├─ Email: admin@carfever.com
  └─ Password: admin123
              │
              └─ Match? → localStorage.setItem('cf_admin_user', {...})
                                   │
                              /admin/dashboard
              │
              └─ No match? → Error message

Any admin page:
  │
  └─ layout.tsx checks localStorage.getItem('cf_admin_user')
              │
              ├─ Exists? → render admin page
              └─ Null? → redirect to /admin/login
```

---

## 17. PRICE FORMAT

Pakistan market ke liye price format:
- **Storage in DB:** Full PKR amount (e.g., `4550000` = 45.5 Lacs)
- **Input in forms:** Lacs (e.g., `45.5`)
- **Conversion:** `lacs * 100000 = PKR`
- **Display:** `PKR 45.5 Lacs`
- **Formula used in server-actions.ts:** `parseFloat(price) * 100000`
- **⚠️ actions.ts mein WRONG:** `parseFloat(price) * 1000000`

---

## 18. NEXT STEPS / TODO LIST

### Priority 1 — Critical Fixes
- [ ] Fix wishlist to use UUIDs + fetch from DB
- [ ] Fix admin image upload (real Supabase Storage)
- [ ] Fix SEO settings DB schema (add missing columns)
- [ ] Replace fake admin auth with Supabase Auth
- [ ] Delete duplicate `lib/actions.ts` (keep `server-actions.ts`)

### Priority 2 — Important Features
- [ ] Blog page: fetch real published blogs from DB
- [ ] Enable Supabase Realtime on all 3 tables
- [ ] Admin Users page: connect to `users` DB table
- [ ] Admin Analytics: connect to real data (or integrate analytics service)
- [ ] Add `next.config.ts` image domain for Supabase Storage URL

### Priority 3 — Nice to Have
- [ ] Add sitemap.xml (`app/sitemap.ts`)
- [ ] Add robots.txt (`app/robots.ts`)
- [ ] JSON-LD structured data on car detail pages
- [ ] Real "X people viewing" with Supabase Presence
- [ ] Blog views count increment on post visit
- [ ] Newsletter backend integration
- [ ] Car detail page: convert to Server Component

---

## 19. QUICK REFERENCE

### Important URLs
| Page | URL |
|------|-----|
| Homepage | `/` |
| Buy Car | `/buy-car` |
| Car Detail | `/buy-car/{uuid}` |
| Sell Car | `/sell-car` |
| Inspections | `/inspections` |
| Wishlist | `/wishlist` |
| Blog | `/blog` |
| Blog Post | `/blog/{slug}` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |
| Admin Cars | `/admin/cars` |
| Admin Blogs | `/admin/blogs` |
| Admin Inquiries | `/admin/inquiries` |
| Admin Inspections | `/admin/inspections` |
| Admin Users | `/admin/users` |
| Admin SEO | `/admin/seo` |
| Admin Analytics | `/admin/analytics` |
| Admin Settings | `/admin/settings` |

### Dev Commands
```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Production server
```

### Supabase Storage Buckets Needed
- `car-images` — car listing photos

### Admin Login (Demo)
- Email: `admin@carfever.com`
- Password: `admin123`

---

*Document end — CarFever Project Documentation v1.0*
*Generated: July 2026*
