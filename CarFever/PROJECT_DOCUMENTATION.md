# 🚗 Car Fever — Complete Project Documentation

> **Project Name:** Car Fever  
> **Type:** Premium Car Marketplace (Web Application)  
> **Status:** Frontend Complete (No Backend)  
> **Last Updated:** July 10, 2026  
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

Car Fever is a **premium, dark-themed luxury car marketplace** built for the Pakistani market. It allows users to browse, buy, and sell cars, and book vehicle inspections. The platform features a modern glassmorphism-inspired dark UI with neon red and electric blue accent colors.

### Core User Flows:
- **Browse & Buy Cars:** View featured listings → Click for full details → Contact seller / Make offer
- **Sell a Car:** Multi-step form wizard (Vehicle Details → Pricing → Photo Upload → Success)
- **Book Inspection:** Multi-step booking (Vehicle Info → Plan Selection → Schedule → Confirmation)
- **Authentication:** Signup with name/email/password → Login → Profile avatar in navbar → Logout

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
│   │   ├── layout.tsx              # Root layout (Inter font, dark theme, metadata)
│   │   ├── page.tsx                # Homepage (assembles all landing sections)
│   │   ├── globals.css             # Design system, custom properties, utilities
│   │   ├── favicon.ico
│   │   ├── buy-car/
│   │   │   ├── page.tsx            # Car listing grid + filter sidebar
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Individual car detail page (Client Component)
│   │   ├── sell-car/
│   │   │   └── page.tsx            # Multi-step sell form wizard (Client Component)
│   │   └── inspections/
│   │       └── page.tsx            # Inspection landing + booking wizard (Client Component)
│   ├── components/
│   │   ├── navbar.tsx              # Global navbar with search, wishlist, notifications, auth modals
│   │   ├── hero-section.tsx        # Homepage hero with CTA
│   │   ├── featured-cars.tsx       # Featured car cards grid
│   │   ├── browse-brands.tsx       # Browse by brand section (Toyota, Honda, etc.)
│   │   ├── why-choose-us.tsx       # Why Choose Us section with stats
│   │   ├── cta-section.tsx         # Call-to-action section
│   │   ├── footer.tsx              # Site footer with links
│   │   └── ui/                     # Shadcn UI primitives
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       └── sheet.tsx
│   └── lib/
│       └── utils.ts                # cn() utility function
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts (if exists)
```

---

## 4. Pages & Routes

### 4.1 Homepage (`/`)
**File:** `src/app/page.tsx` (Server Component)

Assembles these sections in order:
1. `<Navbar />`
2. `<HeroSection />` — Full-width hero with gradient background, headline, and search CTA
3. `<FeaturedCars />` — Grid of 6 featured car cards
4. `<BrowseByBrand />` — Brand logos (Toyota, Honda, Suzuki, KIA, Hyundai, etc.)
5. `<WhyChooseUs />` — Stats and feature cards
6. `<CTASection />` — Sell your car CTA
7. `<Footer />`

### 4.2 Buy Car Page (`/buy-car`)
**File:** `src/app/buy-car/page.tsx`

- **Left sidebar:** Filter options (Brand, Price Range, Year, Fuel Type)
- **Main area:** Grid of car listing cards
- Each card links to `/buy-car/[id]`

### 4.3 Car Detail Page (`/buy-car/[id]`)
**File:** `src/app/buy-car/[id]/page.tsx` (Client Component)

Features:
- **Image Gallery:** Main image + thumbnail strip with click-to-switch
- **360° View badge** (UI only)
- **Heart/Share buttons** on image
- **Specs grid:** Year, Mileage, Fuel, Engine, Transmission
- **Contact Seller / Make an Offer** CTAs
- **Tabbed content:** Description | Features & Options | Inspection Report
- **Similar Cars** horizontal scroll section
- **Breadcrumb navigation** (Home → Buy Car → Car Name)

**Car data:** Hardcoded array of 6 cars with detailed info (id, title, price, year, mileage, fuel, location, engine, transmission, images array).

### 4.4 Sell Car Page (`/sell-car`)
**File:** `src/app/sell-car/page.tsx` (Client Component)

**4-Step Form Wizard:**

| Step | Title | Fields |
|------|-------|--------|
| 1 | Vehicle Details | Make (dropdown), Model, Year (dropdown), Mileage, Transmission, Fuel Type, Color |
| 2 | Pricing & Description | Price (PKR), Condition (dropdown), City, Description (textarea) |
| 3 | Photo Upload | Drag-and-drop zone, device file picker (`<input type="file">`), image previews with remove button |
| 4 | Success | Green checkmark, listing summary, random listing ID |

**Key technical details:**
- Uses `useRef` for hidden file input
- `handleDragOver` / `handleDrop` for drag-and-drop
- `handleFileChange` creates `URL.createObjectURL()` for local image preview
- Images stored as blob URLs in `uploadedImages` state array
- Progress bar shows steps 1-2-3 with active highlighting

### 4.5 Inspections Page (`/inspections`)
**File:** `src/app/inspections/page.tsx` (Client Component)

**Two states:**

**Landing State (default):**
- Shield icon with blue glow
- 6 inspection service cards (Engine, Paint, Suspension, Electrical, OBD, Road Test)
- "Book an Inspection" CTA button

**Booking Wizard (after clicking CTA):**

| Step | Title | Fields |
|------|-------|--------|
| 1 | Vehicle & Location | Make (dropdown), Model, Year (dropdown), Registration Number, Address (textarea) |
| 2 | Plan Selection | 3 clickable plan cards: Basic (PKR 3,500), Standard (PKR 5,500), Premium (PKR 8,500) |
| 3 | Schedule | Date picker (min=today), Time Slot (dropdown), Full Name, Phone Number |
| 4 | Success | Booking confirmed with ID, plan, date/time, location summary |

---

## 5. Components

### 5.1 Navbar (`src/components/navbar.tsx`)
**Type:** Client Component  
**Size:** ~650 lines  
**This is the most complex component in the app.**

#### Features implemented:

**🔍 Search Bar:**
- Toggle button in navbar
- Slides down from header with auto-focus
- Type query → click arrow → redirects to `/buy-car?search=...`
- Close with X button

**❤️ Wishlist Panel:**
- Dropdown panel (right-aligned)
- Pre-loaded with 2 demo cars (Toyota Corolla, Honda Civic)
- Each car shows: thumbnail, title, price, location
- Actions per car: View Details (→) and Delete (🗑)
- Badge count on heart icon
- Empty state when all removed
- "Browse More Cars" link

**🔔 Notifications Panel:**
- Dropdown panel (right-aligned)
- 4 demo notifications (2 unread, 2 read)
- Blue dot indicator for unread
- Click notification → marks as read
- "Mark all read" (✓✓) button
- "Clear all notifications" button
- Red badge dot on bell when unread exist

**🔐 Authentication System (Login/Signup):**

This is a **fully functional localStorage-based auth system**.

**Signup Flow:**
1. User clicks "Signup" → Modal opens with fields: Full Name, Email, Password
2. **Validation rules:**
   - Name: Required (non-empty)
   - Email: Required + valid format regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
   - Password: Required + minimum 6 characters
3. **Duplicate check:** If email already exists in `cf_users` localStorage array → shows error
4. On success: Creates user object `{name, email, password}`, pushes to `cf_users` array in localStorage, sets `cf_current_user` in localStorage
5. Shows success screen with green checkmark + personalized welcome message
6. Auto-closes modal after 1.8 seconds

**Login Flow:**
1. User clicks "Login" → Modal opens with fields: Email, Password
2. Same validation rules for email/password
3. Looks up user in `cf_users` localStorage array by matching email + password
4. If no match → shows error: "Incorrect email or password. Please try again."
5. On success: Sets `cf_current_user` in localStorage
6. Shows personalized "Welcome back, [Name]!" success screen

**Logged-in State:**
- Login/Signup buttons **replaced** by user avatar bubble (gradient circle with first letter of name)
- Click avatar → Profile dropdown shows: Full name, email, Log Out button
- Mobile menu also shows user info + Log Out instead of Login/Signup
- On page reload: `useEffect` reads `cf_current_user` from localStorage to restore session

**Logout:**
- Removes `cf_current_user` from localStorage
- Reverts navbar to showing Login/Signup buttons

**Error Display:**
- Inline red error messages below each field with `AlertCircle` icon
- Input borders turn red on error
- General error banner (red background) for login failures
- Errors clear when user types

**localStorage Keys:**
- `cf_users` — JSON array of all registered users: `[{name, email, password}, ...]`
- `cf_current_user` — JSON object of currently logged-in user: `{name, email, password}`

**TypeScript Interface:**
```typescript
interface StoredUser {
  name: string;
  email: string;
  password: string;
}
```

#### Navigation Links:
```typescript
const navLinks = [
  { label: "Buy Car", href: "/buy-car" },
  { label: "Sell Car", href: "/sell-car" },
  { label: "Inspections", href: "/inspections" },
];
```

#### Panel Management:
- Only ONE panel/modal can be open at a time
- `closeAll()` function closes search, wishlist, notifications, and profile menu
- Invisible backdrop div captures clicks to close open panels
- `toggleX()` functions call `closeAll()` first, then toggle their own state

### 5.2 Featured Cars (`src/components/featured-cars.tsx`)
- Renders 6 car cards in responsive grid
- Each card has: image with hover zoom, badge (Featured/Certified/Hot Deal), wishlist heart button, price overlay, specs (year/mileage/fuel), location, "View Details" link
- Links to `/buy-car/[id]`

### 5.3 Other Components
- **hero-section.tsx** — Full-width landing hero with background, headline, CTA buttons
- **browse-brands.tsx** — Brand selection grid (Toyota, Honda, Suzuki, KIA, Hyundai)
- **why-choose-us.tsx** — Feature cards + statistics section
- **cta-section.tsx** — "Sell Your Car" conversion section
- **footer.tsx** — Multi-column footer with links, social icons, copyright

---

## 6. Feature Details

### 6.1 Car Data
All car data is **hardcoded** in component files. There is NO database or API.

**Featured Cars data** lives in `src/components/featured-cars.tsx` (6 cars)  
**Detail page data** lives in `src/app/buy-car/[id]/page.tsx` (6 cars with extended fields)

Cars have these fields:
```typescript
interface CarListing {
  id: number;
  title: string;       // e.g. "Toyota Corolla GLi"
  price: string;       // e.g. "PKR 45.5 Lacs"
  year: number;        // e.g. 2023
  mileage: string;     // e.g. "12,000 km"
  fuel: string;        // e.g. "Petrol"
  location: string;    // e.g. "Lahore"
  image: string;       // Unsplash URL
  badge?: string;      // "Featured" | "Certified" | "Hot Deal"
  rating?: number;     // e.g. 4.8
}
```

Detail page adds: `engine`, `transmission`, `images[]`

### 6.2 Image Upload (Sell Car)
- Uses `<input type="file" accept="image/*" multiple>` hidden behind a styled div
- Click on drop zone → triggers file input via `useRef`
- Drag-and-drop: `onDragOver` prevents default, `onDrop` reads `e.dataTransfer.files`
- `handleFileChange` loops through selected files, creates `URL.createObjectURL()` for each
- Previews rendered as thumbnail strip with hover-to-show delete button
- Images are ONLY in browser memory (blob URLs), NOT uploaded anywhere

### 6.3 Filter Sidebar (Buy Car)
- UI is present but **stateless** — filters do NOT actually filter the car list
- Shows: Make dropdown, Min/Max price sliders, Year range, Fuel type checkboxes

---

## 7. Design System

### Color Palette:
| Token | Value | Usage |
|-------|-------|-------|
| `bg-background` / `bg-[#09090b]` | zinc-950 | Page backgrounds |
| `bg-card` | zinc-900 | Card backgrounds |
| `text-neon-red` | Custom red | Primary accent, CTAs, badges |
| `text-electric-blue` | Custom blue | Secondary accent, links, inspections |
| `text-white` | #ffffff | Headings, active text |
| `text-zinc-300` | Light gray | Body text |
| `text-zinc-400` | Mid gray | Secondary text |
| `text-zinc-500` | Dark gray | Muted text, placeholders |

### Custom CSS Classes (defined in globals.css):
- `glass-heavy` — Glassmorphism navbar effect
- `glow-red` / `glow-red-subtle` — Red box-shadow glow effects
- `glow-blue` / `glow-blue-subtle` — Blue box-shadow glow effects

### Typography:
- Font: **Inter** (Google Fonts, loaded via next/font)
- Variable: `--font-sans`

### Design Patterns:
- **Glassmorphism:** Semi-transparent backgrounds with `backdrop-blur`
- **Dark theme only:** No light mode
- **Rounded corners:** `rounded-2xl` or `rounded-3xl` for cards/panels
- **Borders:** `border-white/10` or `border-white/[0.06]` for subtle dividers
- **Hover effects:** Scale transforms, color transitions, border highlight
- **Animations:** `animate-in`, `fade-in`, `slide-in-from-top`, `zoom-in-95`
- `suppressHydrationWarning` used on `<html>` tag and some components to prevent browser extension conflicts

---

## 8. Development History

### Session 1: Project Setup & Homepage
- Created Next.js 16 project with TypeScript + Tailwind CSS v4
- Set up custom design system in `globals.css` (colors, glassmorphism, glow effects)
- Built all homepage components: Navbar, Hero, Featured Cars, Browse Brands, Why Choose Us, CTA, Footer
- Installed and configured Shadcn UI components (Button, Badge, Card, Sheet, etc.)

### Session 2: Pages & Routing
- Created `/buy-car` page with car listing grid + filter sidebar
- Created `/buy-car/[id]` dynamic route for car detail pages with image gallery, specs, tabs
- Created `/sell-car` page (initially static)
- Created `/inspections` page (initially static)
- Fixed navigation links across all pages
- Fixed various TypeScript compilation errors

### Session 3: Interactivity & Functionality (Current Session)
- **Sell Car Form:** Converted static page to multi-step interactive form wizard with real file upload from device
- **Inspections Booking:** Converted static page to multi-step booking wizard with plan selection and scheduling
- **Navbar Functionalization:**
  - Search bar with slide-down animation
  - Wishlist panel with demo data, remove functionality
  - Notifications panel with read/unread states, mark all read, clear all
  - **Full Login/Signup auth system** with localStorage persistence, form validation, error messages, user avatar display, profile dropdown, and logout
- Fixed all TypeScript errors throughout the project
- Fixed duplicate code issues in navbar

### Issues Resolved:
1. Car detail page not showing correct car data → Fixed dynamic route `[id]` matching
2. "Learn More" buttons not working → Added proper `Link` routing
3. All car cards redirecting to Buy Car page → Fixed individual car links
4. Sell Now form was static → Built interactive multi-step wizard
5. Image upload was mock → Replaced with real `<input type="file">` device picker
6. TypeScript `NavLink` interface missing → Added proper typing
7. Hydration errors from browser extensions → Added `suppressHydrationWarning`
8. Login/Signup buttons not functional → Built complete localStorage auth system
9. Duplicate navbar code causing TS errors → Cleaned up file

---

## 9. Known Limitations

> [!WARNING]
> These are critical gaps that need to be addressed before this can be considered production-ready.

### 9.1 No Backend / Database
- ALL data is hardcoded in TypeScript files
- No API routes, no server actions
- Auth uses localStorage only (passwords stored in plain text!)
- Form submissions (Sell Car, Inspections) are UI-only simulations
- Uploaded images exist only as browser blob URLs (lost on refresh)

### 9.2 Non-Functional UI Elements
- **Filter Sidebar** on `/buy-car` — dropdowns/sliders present but don't filter anything
- **Contact Seller / Make an Offer** buttons on car detail page — no action
- **Heart button on car cards** — no state management / not connected to wishlist
- **Share button** on car detail page — no share functionality
- **360° View button** — no 360 viewer
- **Download Full Report** on inspection tab — no file to download
- **Forgot Password** link — no flow implemented
- **Search redirects to `/buy-car?search=...`** — query param not read/used

### 9.3 Data Inconsistency
- Featured Cars component and Car Detail page each have their own separate car data arrays
- Wishlist in navbar has its own hardcoded demo data, not connected to the actual car listings
- No shared state management (no Context, no Zustand, no Redux)

### 9.4 Security
- Passwords stored in plain text in localStorage
- No encryption, no hashing
- No session tokens or JWT
- Anyone with browser DevTools can read all auth data

---

## 10. Recommended Next Steps

### Priority 1: Backend Integration
1. **Set up Supabase** (or similar) for:
   - User authentication (replace localStorage with proper auth)
   - PostgreSQL database for car listings
   - Storage bucket for car images
2. Create database schema:
   - `users` table
   - `cars` table (listings)
   - `inspections` table (bookings)
   - `wishlist` table (user ↔ car relation)

### Priority 2: Connect Frontend to Backend
1. Replace hardcoded car arrays with Supabase queries
2. Connect Sell Car form to create real database records
3. Connect image upload to Supabase Storage
4. Wire up Inspections booking to save to database
5. Implement real auth with Supabase Auth (email/password + OAuth)

### Priority 3: Missing Features
1. **Working Filters:** Connect filter sidebar to car listing query
2. **Working Search:** Read `?search=` query param and filter results
3. **Wishlist Sync:** Connect heart buttons on cards to shared wishlist state
4. **Contact Seller:** WhatsApp link or in-app messaging
5. **Responsive Testing:** Full mobile optimization pass
6. **SEO:** Add proper metadata to each page

### Priority 4: Production Readiness
1. Error boundaries and loading states
2. Image optimization with `next/image`
3. Form submission loading spinners
4. Toast notifications (success/error feedback)
5. Rate limiting on auth attempts
6. Input sanitization
7. Environment variables for API keys
8. Deployment to Vercel

---

## 11. Quick Reference: All State Variables

### Navbar State:
```typescript
// Navigation
openDropdown: string | null          // Which nav dropdown is open
mobileOpen: boolean                  // Mobile sheet menu

// Panels
searchOpen: boolean                  // Search bar visible
wishlistOpen: boolean                // Wishlist dropdown
notifOpen: boolean                   // Notifications dropdown
profileMenuOpen: boolean             // User profile dropdown
authModal: "login" | "signup" | null // Auth modal type

// Data
searchQuery: string                  // Search input value
currentUser: StoredUser | null       // Logged-in user (from localStorage)
authData: {name, email, password}    // Form input values
showPassword: boolean                // Password visibility toggle
authSuccess: boolean                 // Show success animation
authErrors: {name?, email?, password?, general?} // Validation errors
wishlist: array                      // Saved cars
notifications: array                 // Notification items
```

### Sell Car State:
```typescript
step: number (1-4)                   // Current wizard step
formData: {make, model, year, mileage, transmission, fuel, color, price, condition, city, description}
uploadedImages: string[]             // Blob URLs of uploaded images
```

### Inspections State:
```typescript
bookingStarted: boolean              // Show landing vs wizard
step: number (1-4)                   // Current wizard step
formData: {make, model, year, regNumber, address, plan, date, timeSlot, name, phone}
```

---

*This document was generated on July 10, 2026 to provide complete project context for AI-assisted development handoff.*
