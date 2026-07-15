# Step 1 — Database & Environment Setup

Follow these steps **in order** before moving to Step 2.

---

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a project (or use existing).
2. Wait for the database to finish provisioning.

---

## 2. Run SQL Migrations

Open **Supabase Dashboard → SQL Editor** and run migrations in this order:

### Migration 1 (if not already run)
File: `supabase/migrations/002_admin_tables.sql`

Creates: `categories`, `blogs`, `seo_settings`

### Migration 2 (required)
File: `supabase/migrations/003_core_tables.sql`

Creates: `users`, `cars`, `inquiries`, `inspections`  
Also sets up: RLS policies, indexes, `car-images` storage bucket, Realtime

Click **Run** after pasting each file. Confirm no errors.

---

## 3. Configure Environment Variables

```bash
# From project root (PowerShell)
Copy-Item env.local.template .env.local
```

Edit `.env.local` with your real values from  
**Supabase Dashboard → Project Settings → API**:

| Variable | Where to find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` `secret` key |

Restart dev server after saving:

```bash
npm run dev
```

---

## 4. Verify Setup

In Supabase **Table Editor**, confirm these tables exist:

- [ ] `users`
- [ ] `cars`
- [ ] `inquiries`
- [ ] `inspections`
- [ ] `categories`
- [ ] `blogs`
- [ ] `seo_settings`

In **Storage**, confirm bucket exists:

- [ ] `car-images` (public)

---

## 5. Server Client Usage (for developers)

| File | Purpose |
|------|---------|
| `src/lib/supabase/server.ts` | Server Actions & Server Components |
| `src/lib/supabase/types.ts` | TypeScript types for all tables |
| `src/lib/supabase.ts` | Browser/client components (anon key) |

**Server Actions** should use:

```ts
import { createServiceRoleClient } from '@/lib/supabase/server';
```

**Public server reads** (approved cars only, respects RLS):

```ts
import { createServerClient } from '@/lib/supabase/server';
```

---

## RLS Summary

| Table | Public (anon) can |
|-------|-------------------|
| `cars` | SELECT approved only; INSERT with `status = pending` |
| `inquiries` | INSERT only |
| `inspections` | INSERT only |
| `users` | SELECT active profiles only |

Admin operations in Steps 2–3 use **service role** via Server Actions (bypasses RLS).

---

## Next Step

When migrations are run and `.env.local` is configured, say:

**"Start Step 2"**
