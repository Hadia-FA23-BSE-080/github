# EasyInstall FINTECH — Project Progress Report
> **Last Updated:** June 25, 2026  
> **Target Audience:** AI Developer / Assistant  

---

## 1. PROJECT OVERVIEW
**EasyInstall FINTECH** is a consumer financing and installment e-commerce web application tailored for the Pakistani market. The platform allows users (customers) to browse premium gadgets (smartphones, laptops, and appliances), calculate installment options (EMI), apply for installment financing, and manage repayments.

The application supports three distinct user roles:
1. **Customer**: Browses catalog, uses EMI calculator, applies for installment plans (submitting KYC data/guarantor info/documents), tracks application status, and simulates payments.
2. **Guarantor**: Log in to view details of applicants naming them as guarantors, and approve or reject guarantee applications.
3. **Admin**: Manages applications, reviews KYC documents, updates catalog products, updates promotional announcements, monitors audit logs, manages CNIC/phone blacklists, and replies to support chat requests.

---

## 2. TECHNICAL ARCHITECTURE

### Frontend Stack
* **Framework**: React 19.x (Vite-based build tool)
* **Language**: TypeScript (~6.0)
* **Styling**: Tailwind CSS (3.4.x) + ShadCN UI components (Radix UI)
* **Routing**: React Router DOM (6.x)
* **Forms & Validation**: React Hook Form (7.x) + Zod (4.x)
* **State Management**: React Context (`AuthContext.tsx` for auth & role state)
* **Visualizations**: Recharts (3.x) for admin analytics
* **Animations**: Framer Motion (11.x)
* **File Exports**: jsPDF + jspdf-autotable (PDF reports) & XLSX (Excel spreadsheets)

### Backend & Data Access Layer
* **Primary Database**: Supabase (PostgreSQL) with Row-Level Security (RLS) enabled on all tables.
* **Storage**: Supabase Storage Buckets for KYC document file uploads (applicant/guarantor CNICs, utility bills, etc.).
* **Realtime**: Supabase Realtime Channels for chat/support messenger.
* **Mock DB Fallback (Offline Mode)**: Consolidating logic inside `src/lib/supabaseClient.ts`, the app automatically falls back to a simulated `localStorage`-based database if Supabase endpoints are unavailable.

---

## 3. WHAT IS COMPLETE ✅

### Core Platform Pages
* **Landing Page (`src/pages/Landing.tsx`)**:
  * Hero banner with metrics (approval rates, processing times).
  * Live promotions/announcements pulled from the database.
  * Interactive EMI Calculator (duration sliders, markup calculation, monthly installment view).
  * Searchable and filterable product catalog (brand, category).
  * Contact inquiry form submitting to the database.
* **Auth Page (`src/pages/Auth.tsx`)**:
  * Unified signup, login, password recovery, and email verification.
  * Role selection during registration (Customer, Guarantor, Admin).
  * Security checks preventing registration of duplicate phones or blacklisted CNICs.
* **Apply for Installment (`src/pages/ApplyInstallment.tsx`)**:
  * 4-step wizard: plan details ➔ personal/employment data ➔ guarantor data ➔ KYC document upload.
* **Customer Dashboard (`src/pages/CustomerDashboard.tsx`)**:
  * Multi-status progress tracker (`pending` ➔ `guarantor_pending` ➔ `approved`/`rejected` ➔ `active` ➔ `completed`).
  * Repayment schedule viewer.
  * simulated payment modal (credit card / bank transfer simulation).
* **Guarantor Dashboard (`src/pages/GuarantorDashboard.tsx`)**:
  * Dashboard displaying loan applications waiting for guarantor consent.
  * Detailed applicant profile view and buttons to approve or reject the guarantee.
* **Admin Dashboard (`src/pages/AdminDashboard.tsx`)**:
  * Charts & stats dashboard for active loans, defaults, cash flow.
  * KYC document review panel (approve/reject/request-revision).
  * Catalog editor (create, edit, delete products).
  * Announcement manager (banners/zero markup promotional banners).
  * Blacklist manager (manage blocked CNICs/phone numbers).
  * Audit logs timeline.
  * Live Chat support panel.
* **Support Messenger (`src/pages/Messages.tsx`)**:
  * Real-time text communications using Supabase Realtime subscriptions.

### UI & Styling Modernization
* ShadCN UI component templates fully configured and in place.
* Dark / Light mode toggling in `src/components/Navbar.tsx` using `src/lib/hooks/use-theme.tsx`.
* Desktop and mobile responsive layouts.
* Sonner toast notifications integrated to replace generic browser alerts.

---

## 4. WHAT IS NOT COMPLETE / NEEDS ATTENTION ⚠️

### Structural Refactoring & Optimization
* **Empty Page Directories**: The folders `src/pages/admin/`, `src/pages/customer/`, `src/pages/guarantor/`, and `src/pages/public/` are empty. The application logic currently lives entirely within single page files (`src/pages/AdminDashboard.tsx` is ~60KB, `src/pages/ApplyInstallment.tsx` is ~30KB). These large components should be refactored and split into sub-components inside these directories.
* **Empty Lib Directories**: `src/lib/supabase/` and `src/lib/utils/` folders are empty.
* **Consolidated Data Layer**: All SQL queries and simulated fallback logic are written together inside `src/lib/supabaseClient.ts` (17KB). This should be modularized, moving distinct features (such as products, auth, applications) into separate service files under `src/lib/supabase/`.

### Deployment & Configuration Setup
* **Manual Supabase Migrations**: The file `supabase_schema.sql` contains the complete database layout, RLS policies, custom trigger functions, and automated calculation routines. However, this must be executed manually in the Supabase SQL editor. No automated migrations setup (like Prisma or Supabase CLI migration flow) has been configured.
* **Supabase Services Configuration**:
  * **Storage Buckets**: The buckets `kyc-documents` and `profile-pictures` must be created manually in the Supabase Dashboard.
  * **Email Auth**: SMTP configuration or email verification must be manually enabled in Supabase settings.
  * **Realtime**: Realtime broadcast must be explicitly toggled on for the `messages` table in the Supabase dashboard.
* **Offline Syncing Gap**: If a user creates data while in Offline mode (localStorage), there is currently no automatic sync/reconciliation routine to upload these local changes back to the Supabase Postgres instance once connection is restored.

---

## 5. DATABASE SCHEMA

### ENUM Definitions
* **`user_role`**: `('admin', 'customer', 'guarantor')`
* **`application_status`**: `('pending', 'approved', 'rejected', 'additional_documents')`
* **`payment_status`**: `('pending', 'paid', 'partially_paid', 'late', 'overdue')`

### Database Tables (PostgreSQL)
1. **`profiles`**: Linked to `auth.users`. Holds user roles, verified phone, CNIC numbers, and KYC document URLs.
2. **`products`**: Holds product details, categories, stock levels, and cash vs installment prices.
3. **`installment_applications`**: The central loan transaction table. Contains loan tenure, down payment, total payable, and the JSON-serialized repayment schedule.
4. **`guarantors`**: Linked to an application. Holds guarantor income, CNIC, and contact info.
5. **`payments`**: Tracks payment amounts, due dates, paid dates, and receipt attachments.
6. **`messages`**: Real-time communications log between customer and support.
7. **`inquiries`**: Landing page contact form data.
8. **`announcements`**: Live banners and promotional messages.
9. **`audit_logs`**: Tracks admin updates and security events.
10. **`blacklist`**: CNICs and phone numbers barred from applying.
11. **`documents`**: Document attachments mapping to user profiles.

---

## 6. PROJECT DIRECTORY TREE

```
installment-app/
├── dist/                          # Production build output
├── public/                        # Static assets (favicons, manifest)
├── src/
│   ├── assets/                    # Project graphics
│   ├── components/
│   │   ├── Navbar.tsx             # Theme toggler, responsive role-based menu
│   │   ├── Footer.tsx             # Shared page footer
│   │   ├── ui.tsx                 # Standard fallback UI components
│   │   ├── forms/                 # (Reserved for refactoring)
│   │   ├── layout/                # (Reserved for refactoring)
│   │   ├── shared/                # (Reserved for refactoring)
│   │   └── ui/                    # ShadCN UI components (accordion, button, card, etc.)
│   ├── contexts/
│   │   └── AuthContext.tsx        # React Context providing session and role management
│   ├── lib/
│   │   ├── hooks/
│   │   │   └── use-theme.tsx      # Dark/Light theme toggler hook
│   │   ├── supabase/              # (Reserved for refactoring database queries)
│   │   ├── utils/                 # (Reserved for refactoring helper functions)
│   │   ├── supabase.ts            # Raw Supabase JS Client initialization
│   │   ├── supabaseClient.ts      # Query layer combined with Offline LocalStorage Fallback
│   │   └── utils.ts               # Tailwinds-merge helper classNames utility
│   ├── pages/
│   │   ├── admin/                 # (Empty - Reserved for Admin sub-pages)
│   │   ├── customer/              # (Empty - Reserved for Customer sub-pages)
│   │   ├── guarantor/             # (Empty - Reserved for Guarantor sub-pages)
│   │   ├── public/                # (Empty - Reserved for Public sub-pages)
│   │   ├── AdminDashboard.tsx     # Admin panel (Metrics, KYC review, Catalog, Chat)
│   │   ├── ApplyInstallment.tsx   # Installment application step wizard
│   │   ├── Auth.tsx               # Signup / Signin form
│   │   ├── CustomerDashboard.tsx  # Customer portal (track loan, make payments)
│   │   ├── GuarantorDashboard.tsx # Guarantor consent dashboard
│   │   ├── Landing.tsx            # Main marketplace, EMI slider, FAQ, contact inquiry
│   │   └── Messages.tsx           # Real-time customer service messenger
│   ├── types/
│   │   └── index.ts               # All global TypeScript interface declarations
│   ├── App.tsx                    # Root routing setup and product collection page
│   ├── App.css                    # App-level styling customizations
│   ├── index.css                  # Tailwinds tokens and main fonts setup
│   └── main.tsx                   # React startup script
├── .env                           # Local environment credentials (not in git)
├── .env.example                   # Template env configuration
├── .gitignore
├── .oxlintrc.json                 # Linter configuration rules
├── index.html                     # SPA HTML template
├── package.json                   # List of scripts and NPM dependencies
├── postcss.config.cjs
├── shadcn.json                    # Configuration for ShadCN setup
├── supabase_schema.sql            # Main database layout and postgres hooks script
├── tailwind.config.cjs            # Custom styles overrides config
├── tsconfig.json                  # TypeScript root config
├── tsconfig.app.json              # TypeScript compilation specifications
├── tsconfig.node.json             # TypeScript node environment settings
├── vercel.json                    # Vercel SPA route rewrite rules
└── vite.config.ts                 # Dev server and builder preferences
```

---

## 7. RECOMMENDATIONS FOR THE NEXT DEVELOPMENT CYCLE

1. **Refactor AdminDashboard.tsx**: Move sub-panels (e.g., `BlacklistManager`, `CatalogEditor`, `ApplicationReviewer`, `AuditTimeline`) out of `AdminDashboard.tsx` and place them inside the `src/pages/admin/` subdirectory.
2. **Modularize the Data Access Layer**: Extract queries from `src/lib/supabaseClient.ts` into specific service modules (e.g., `src/lib/supabase/products.ts`, `src/lib/supabase/applications.ts`) and create reusable custom Hooks (e.g., `useProducts`, `useApplications`) in `src/lib/hooks/`.
3. **Reconcile Offline Storage**: Develop a background sync engine that pushes any locally created requests or transactions (`localStorage`) to the remote Supabase database once the network status changes back to online.
4. **Automate SQL Schema Migrations**: Set up a deployment script or use Supabase CLI to coordinate database migrations instead of executing them manually.
