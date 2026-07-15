# 🚗 Car Fever — Complete Project Documentation

> **Project Name:** Car Fever  
> **Type:** Premium Car Marketplace (Web Application)  
> **Status:** Full Stack (Frontend + Supabase Backend Integration)  
> **Last Updated:** July 12, 2026  
> **Location:** `c:\Users\Lenovo\Desktop\CarFever`

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Components](#5-components)
6. [Feature Details](#6-feature-details)
7. [Design System](#7-design-system)
8. [Development History](#8-development-history)
9. [Known Limitations](#9-known-limitations)
10. [Recommended Next Steps](#10-recommended-next-steps)

---

## 1. Project Overview

Car Fever is a **premium, modern car marketplace** built for the Pakistani market. It allows users to browse, buy, and sell cars, book vehicle inspections, and read automotive blogs. The platform features a clean light theme with blue primary accents, and a full-featured admin panel.

### Core User Flows:
- **Browse & Buy Cars:** View featured listings → Click for full details → Contact seller / Make offer
- **Sell a Car:** Multi-step form wizard (Vehicle Details → Pricing → Photo Upload → Success)
- **Book Inspection:** Multi-step booking (Vehicle Info → Plan Selection → Schedule → Confirmation)
- **Read Blog:** Browse blog posts by category/author/tag → Read individual articles
- **Admin Panel:** Manage listings, blogs, users, inspections, inquiries, and settings

---

## 2. Tech Stack & Dependencies

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.10 |
| Language | TypeScript | ^5 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | ^4 |
| Component Library | Shadcn UI | ^4.13.0 |
| Icons | Lucide React | ^1.24.0 |
| Animations | tw-animate-css | ^1.4.0 |
| Backend/DB | Supabase | ^2.110.2 |
| Charts | Recharts | ^3.9.2 |
| Notifications | Sonner | ^2.0.7 |
| CSS Utilities | clsx, tailwind-merge, class-variance-authority | Latest |

### package.json Scripts:
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Run the project:
```bash
cd c:\Users\Lenovo\Desktop\CarFever
npm run dev
```
The dev server runs at `http://localhost:3000`.

---

## 3. Project Structure

```
CarFever/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Inter font, light theme, metadata)
│   │   ├── page.tsx                # Homepage (assembles all landing sections)
│   │   ├── globals.css             # Design system, custom properties, utilities
│   │   ├── favicon.ico
│   │   ├── buy-car/
│   │   │   ├── page.tsx            # Car listing grid + filter sidebar
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Individual car detail page
│   │   ├── sell-car/
│   │   │   └── page.tsx            # Multi-step sell form wizard
│   │   ├── inspections/
│   │   │   └── page.tsx            # Inspection landing + booking wizard
│   │   ├── wishlist/
│   │   │   └── page.tsx            # Wishlist page
│   │   ├── blog/
│   │   │   ├── layout.tsx          # Blog layout with navbar/footer
│   │   │   ├── loading.tsx         # Blog loading skeleton
│   │   │   ├── page.tsx            # Blog homepage with featured/categories/recent
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx        # Individual blog post page
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Blog category archive
│   │   │   ├── author/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Author archive
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Tag archive
│   │   │   └── search/
│   │   │       └── page.tsx        # Blog search results
│   │   └── admin/
│   │       ├── layout.tsx          # Admin layout with sidebar
│   │       ├── page.tsx            # Admin index (redirect to dashboard)
│   │       ├── login/
│   │       │   └── page.tsx        # Admin login page
│   │       ├── dashboard/
│   │       │   └── page.tsx        # Admin dashboard (stats + charts)
│   │       ├── cars/
│   │       │   ├── page.tsx        # Cars list with filters
│   │       │   └── new/
│   │       │       └── page.tsx    # New car form
│   │       ├── blogs/
│   │       │   ├── page.tsx        # Blogs list
│   │       │   └── new/
│   │       │       └── page.tsx    # New blog form
│   │       ├── inspections/
│   │       │   └── page.tsx        # Inspections list
│   │       ├── inquiries/
│   │       │   └── page.tsx        # Inquiries list
│   │       ├── users/
│   │       │   └── page.tsx        # Users list
│   │       ├── analytics/
│   │       │   └── page.tsx        # Analytics page
│   │       ├── seo/
│   │       │   └── page.tsx        # SEO settings
│   │       └── settings/
│   │           └── page.tsx        # Site settings
│   ├── components/
│   │   ├── navbar.tsx              # Global navbar
│   │   ├── hero-section.tsx        # Homepage hero with CTA
│   │   ├── featured-cars.tsx       # Featured car cards grid
│   │   ├── browse-brands.tsx       # Browse by brand section
│   │   ├── why-choose-us.tsx       # Why Choose Us section
│   │   ├── cta-section.tsx         # Call-to-action section
│   │   ├── footer.tsx              # Site footer
│   │   ├── scroll-to-top.tsx       # Scroll to top button
│   │   ├── blog-card.tsx           # Blog post card
│   │   ├── blog-categories.tsx     # Blog categories widget
│   │   ├── blog-search.tsx         # Blog search component
│   │   ├── blog-newsletter.tsx     # Newsletter signup
│   │   ├── blog-share.tsx          # Social share buttons
│   │   ├── blog-toc.tsx            # Table of contents
│   │   └── ui/                     # Shadcn UI primitives
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   └── lib/
│       ├── supabase.ts             # Supabase client initialization
│       ├── storage.ts              # LocalStorage utilities + seed data
│       ├── blog-utils.ts           # Blog helper functions
│       ├── car-data.ts             # Car data
│       ├── wishlist.ts             # Wishlist utilities
│       └── utils.ts                # cn() utility function
├── public/
│   ├── car-fever-temp/             # Backup/temp files
│   └── [images/icons]
├── package.json
├── tsconfig.json
├── next.config.ts
└── PROJECT_DOCUMENTATION.md
```

---

## 4. Pages & Routes

### 4.1 Homepage (`/`)
**File:** `src/app/page.tsx` (Server Component)

Assembles these sections in order:
1. `<Navbar />`
2. `<HeroSection />` — Full-width hero with background, headline, CTA buttons
3. `<FeaturedCars />` — Grid of 6 featured car cards
4. `<BrowseByBrand />` — Brand selection grid
5. `<WhyChooseUs />` — Feature cards + statistics
6. `<CTASection />` — "Sell Your Car" conversion section
7. `<Footer />`
8. `<ScrollToTop />`

### 4.2 Buy Car Page (`/buy-car`)
**File:** `src/app/buy-car/page.tsx`

- **Left sidebar:** Filter options (Brand, Price Range, Year, Fuel Type)
- **Main area:** Grid of car listing cards
- Each card links to `/buy-car/[id]`

### 4.3 Car Detail Page (`/buy-car/[id]`)
**File:** `src/app/buy-car/[id]/page.tsx`

Features:
- **Image Gallery:** Main image + thumbnail strip with click-to-switch
- **360° View badge** (UI only)
- **Heart/Share buttons** on image
- **Specs grid:** Year, Mileage, Fuel, Engine, Transmission
- **Contact Seller / Make an Offer** CTAs
- **Tabbed content:** Description | Features & Options | Inspection Report
- **Similar Cars** horizontal scroll section
- **Breadcrumb navigation**

### 4.4 Sell Car Page (`/sell-car`)
**File:** `src/app/sell-car/page.tsx` (Client Component)

**4-Step Form Wizard:**

| Step | Title | Fields |
|------|-------|--------|
| 1 | Vehicle Details | Make (dropdown), Model, Year (dropdown), Mileage, Transmission, Fuel Type, Color |
| 2 | Pricing & Description | Price (PKR), Condition (dropdown), City, Description (textarea) |
| 3 | Photo Upload | Drag-and-drop zone, device file picker, image previews with remove button |
| 4 | Success | Green checkmark, listing summary, random listing ID |

### 4.5 Inspections Page (`/inspections`)
**File:** `src/app/inspections/page.tsx` (Client Component)

**Two states:**

**Landing State (default):**
- Shield icon with blue glow
- 6 inspection service cards
- "Book an Inspection" CTA button

**Booking Wizard:**

| Step | Title | Fields |
|------|-------|--------|
| 1 | Vehicle & Location | Make (dropdown), Model, Year (dropdown), Registration Number, Address (textarea) |
| 2 | Plan Selection | 3 clickable plan cards: Basic (PKR 3,500), Standard (PKR 5,500), Premium (PKR 8,500) |
| 3 | Schedule | Date picker (min=today), Time Slot (dropdown), Full Name, Phone Number |
| 4 | Success | Booking confirmed with ID, plan, date/time, location summary |

### 4.6 Blog Pages
**Root:** `/blog`

#### 4.6.1 Blog Homepage (`/blog`)
- Hero section with title/subtitle and search
- Featured article
- Categories grid
- Recent articles grid (with "Load More" button)
- Newsletter signup

**Optimizations:**
- `export const revalidate = 3600;` (revalidate hourly)
- Does NOT fetch unnecessary `content` field from Supabase
- Uses `Promise.all` for parallel data fetching

#### 4.6.2 Blog Post Page (`/blog/[slug]`)
- Breadcrumb navigation
- Featured image with `priority` loading
- Article metadata (author, date, read time)
- Social share buttons
- Article content (supports HTML)
- Table of contents (right sidebar on desktop)
- Tags
- Author box
- Related posts
- Newsletter signup

**Optimizations:**
- `generateStaticParams()` pre-renders all published posts at build time
- `export const revalidate = 3600;`

#### 4.6.3 Category Archive (`/blog/category/[slug]`)
- Category header with stats
- Article grid
- `generateStaticParams()` pre-renders all categories

#### 4.6.4 Author Archive (`/blog/author/[id]`)
- Author profile header (avatar, bio, social links, stats)
- Article grid
- `generateStaticParams()` pre-renders all authors

#### 4.6.5 Tag Archive (`/blog/tag/[slug]`)
- Tag header with article count
- Article grid
- `generateStaticParams()` pre-renders all tags

#### 4.6.6 Blog Search (`/blog/search`)
- Search results page

### 4.7 Admin Panel Pages
**Root:** `/admin` (redirects to `/admin/dashboard`)

#### 4.7.1 Admin Login (`/admin/login`)
- Email + password login form
- Default demo credentials pre-filled

#### 4.7.2 Admin Dashboard (`/admin/dashboard`)
- Statistics cards (total listings, total users, total revenue, pending inspections)
- Charts (sales over time, category distribution, top selling cars)

#### 4.7.3 Cars Management (`/admin/cars`)
- Data table of car listings
- Filtering (status, make, date range)
- Actions: Approve, Reject, Delete
- Link to `/admin/cars/new`

#### 4.7.4 New Car (`/admin/cars/new`)
- Form to add new car listing

#### 4.7.5 Blogs Management (`/admin/blogs`)
- Data table of blog posts
- Filtering (status, category, date range)
- Actions: Publish, Unpublish, Delete
- Link to `/admin/blogs/new`

#### 4.7.6 New Blog (`/admin/blogs/new`)
- Form to add new blog post
- Fields: Title, Slug, Excerpt, Content, Featured Image, Category, Tags, Meta Title, Meta Description, Focus Keyword

#### 4.7.7 Inspections Management (`/admin/inspections`)
- Data table of inspection bookings
- Filtering (status, date range)
- Actions: Schedule, Complete, Cancel

#### 4.7.8 Inquiries Management (`/admin/inquiries`)
- Data table of inquiries
- Filtering (read/unread, date range)
- Actions: Mark as Read, Delete

#### 4.7.9 Users Management (`/admin/users`)
- Data table of users
- Filtering (role, status)
- Actions: Edit, Delete

#### 4.7.10 Analytics (`/admin/analytics`)
- Detailed analytics (traffic, conversions, user behavior)

#### 4.7.11 SEO Settings (`/admin/seo`)
- Form to manage site-wide SEO settings

#### 4.7.12 Site Settings (`/admin/settings`)
- Form to manage general site settings

---

## 5. Components

### 5.1 Navbar (`src/components/navbar.tsx`)
- Navigation links: Buy Car, Sell Car, Inspections, Blog
- User profile/wishlist/notifications
- Mobile responsive sheet menu

### 5.2 Blog Components
- **blog-card.tsx** — Blog post card with featured image, category, title, excerpt, author, date, read time
- **blog-categories.tsx** — Category list widget
- **blog-search.tsx** — Search input for blog
- **blog-newsletter.tsx** — Newsletter signup form
- **blog-share.tsx** — Social media share buttons
- **blog-toc.tsx** — Table of contents for blog posts

### 5.3 Other Components
- **hero-section.tsx** — Full-width landing hero
- **featured-cars.tsx** — Featured car cards grid
- **browse-brands.tsx** — Brand selection grid
- **why-choose-us.tsx** — Feature cards + statistics
- **cta-section.tsx** — "Sell Your Car" conversion section
- **footer.tsx** — Multi-column footer
- **scroll-to-top.tsx** — Floating scroll to top button

---

## 6. Feature Details

### 6.1 Supabase Integration
**File:** `src/lib/supabase.ts`
- Creates Supabase client using environment variables
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key for admin actions (server-side only)

### 6.2 LocalStorage Utilities
**File:** `src/lib/storage.ts`
- **Car Listings:** `getCarListings()`, `saveCarListing()`, `updateCarListing()` with seed data
- **Inspection Bookings:** `getInspectionBookings()`, `saveInspectionBooking()`, `updateInspectionBooking()`
- **Inquiries:** `getInquiries()`, `saveInquiry()`, `updateInquiry()`, `deleteInquiry()`
- **Seed Data:** Pre-populates localStorage on first visit

### 6.3 Blog Utilities
**File:** `src/lib/blog-utils.ts`
- `calculateReadTime()` — Estimates read time based on 200 words/min
- `formatDate()` — Formats date using Intl.DateTimeFormat
- `formatRelativeDate()` — Shows relative time (e.g., "2 hours ago")
- `generateExcerpt()` — Creates plain text excerpt from HTML content
- `slugify()` — Converts text to URL-friendly slug

### 6.4 Supabase Database Schema

**`users` table:**
```sql
id (uuid, primary key)
name (text)
email (text, unique)
role (enum: user, admin, content_manager, inspection_manager)
avatar_url (text)
bio (text)
created_at (timestamp)
last_login (timestamp)
```

**`categories` table:**
```sql
id (uuid, primary key)
name (text)
slug (text, unique)
description (text)
created_at (timestamp)
```

**`blogs` table:**
```sql
id (uuid, primary key)
title (text)
slug (text, unique)
excerpt (text)
content (text)
featured_image (text)
author_id (uuid, foreign key to users)
category_id (uuid, foreign key to categories)
tags (jsonb array)
status (enum: draft, published, scheduled)
published_at (timestamp)
created_at (timestamp)
updated_at (timestamp)
views_count (int)
allow_comments (boolean)
meta_title (text)
meta_description (text)
focus_keyword (text)
```

**`cars` table:**
```sql
id (uuid, primary key)
title (text)
make (text)
model (text)
year (int)
mileage (int)
price (int)
status (enum: pending, approved, rejected, draft)
seller_id (uuid, foreign key to users)
images (jsonb array)
features (jsonb)
description (text)
created_at (timestamp)
updated_at (timestamp)
published_at (timestamp)
views_count (int)
is_featured (boolean)
slug (text, unique)
meta_title (text)
meta_description (text)
```

**`inspections` table:**
```sql
id (uuid, primary key)
car_id (uuid, foreign key to cars, optional)
user_id (uuid, foreign key to users)
plan (text)
plan_price (int)
date (date)
time_slot (text)
status (enum: pending, scheduled, completed, cancelled)
inspector_id (uuid, foreign key to users, optional)
report_url (text)
created_at (timestamp)
updated_at (timestamp)
```

**`inquiries` table:**
```sql
id (uuid, primary key)
name (text)
email (text)
phone (text)
subject (text)
message (text)
read (boolean)
created_at (timestamp)
```

---

## 7. Design System

### Color Palette:
| Token | Value | Usage |
|-------|-------|-------|
| `bg-[#F8F9FA]` | Light gray | Page backgrounds |
| `bg-white` | White | Card backgrounds |
| `text-[#0055FE]` | Blue | Primary accent, CTAs, links |
| `text-gray-900` | Dark gray | Headings |
| `text-gray-600` | Gray | Body text |

### Typography:
- Font: **Inter** (Google Fonts, loaded via next/font)
- Variable: `--font-sans`

### Design Patterns:
- **Light theme only**
- **Rounded corners:** `rounded-2xl` or `rounded-3xl` for cards
- **Shadows:** Subtle shadow effects for cards
- **Animations:** `animate-in`, `fade-in`, `slide-in-from-top`

---

## 8. Development History

### Session 1-3: Initial Development
- Project setup, homepage, core pages, navbar with auth

### Session 4: Blog & Admin Panel (Current)
- Created complete blog system with all pages (home, post, category, author, tag, search)
- Added blog components (card, categories, search, newsletter, share, TOC)
- Created admin panel with all management pages (dashboard, cars, blogs, inspections, inquiries, users, analytics, SEO, settings)
- Added Supabase integration
- Optimized blog pages with `generateStaticParams()` and reduced data fetching
- Updated design to light theme

---

## 9. Known Limitations

### 9.1 Backend Integration Status
- Supabase client is set up, but actual queries may need environment variables configured
- Some admin pages are UI-only (not fully connected to Supabase yet)

### 9.2 Non-Functional UI Elements
- **Filter Sidebar** on `/buy-car` — UI present but not fully functional
- **Contact Seller / Make an Offer** buttons — no action
- Some admin CRUD operations are UI-only

---

## 10. Recommended Next Steps

### Priority 1: Complete Supabase Integration
1. Add `.env.local` file with real Supabase credentials
2. Connect all admin pages to Supabase
3. Implement proper Supabase Auth for admin panel
4. Replace remaining localStorage usage with Supabase

### Priority 2: SEO & Performance
1. Verify all metadata is correct
2. Optimize images with `next/image`
3. Implement ISR/SSG properly for all pages

### Priority 3: Missing Features
1. User authentication on frontend
2. Real-time features
3. Image upload to Supabase Storage
4. Complete wishlist integration
5. Blog comments

---

*This document was last updated on July 12, 2026 to include the blog and admin panel features.*
