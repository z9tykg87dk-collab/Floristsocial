# FloristSocial

FloristSocial is being built as a real florist marketplace and social commerce
platform, not a demo. The V1 focus is a stable transaction flow first:
authentication, florist onboarding, product publishing, checkout and payout
visibility.

## Stack

- Next.js App Router
- Supabase for database, auth and storage
- Stripe + Stripe Connect for checkout and payouts
- Vercel for hosting

## Current foundation

- Base route structure for auth, directory, marketplace, dashboard, admin and
  feed
- Shared app configuration for V1 phases and roles
- Environment variable template for Supabase, Stripe and deployment
- Supabase auth client setup, session middleware and magic-link callback route
- Initial Supabase schema for profiles, florist profiles, products, orders and payouts
- Florist onboarding flow that creates or updates the public shop profile
- Directory route that reads florist profile data from Supabase
- Dashboard product creation and marketplace product listing from Supabase
- Stripe Connect onboarding button and payout-status card in the dashboard
- Direct checkout flow that creates orders and redirects to Stripe Checkout
- Stripe webhook for completed checkout sessions and Connect account status
- Customer order history and florist order/payout views
- Referral order flow with seller florist split logic
- Admin overview for profiles, florists, orders and payout records
- Order details page and florist status updates
- Webhook event idempotency and admin payout status actions
- Product details pages and customer-facing order timeline
- Setup and health checks for deployment readiness
- Landing page aligned to the product plan instead of the default scaffold

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in the required values from Supabase, Stripe and Vercel.

4. Start the app:

```bash
npm run dev
```

## Suggested setup order

1. Create the GitHub repository and push the code.
2. Create the Vercel project and link the repository.
3. Create the Supabase project.
4. Add all environment variables in `.env.local` and in Vercel.
5. Implement Supabase Auth and the profile schema.
6. Add Stripe checkout and Stripe Connect onboarding.
7. Apply the SQL migration in Supabase SQL Editor or with the Supabase CLI.

## Auth foundation included

- [middleware.ts](/Users/nick/Documents/FloristSocial/floristsocial/middleware.ts)
  refreshes the Supabase session on requests
- [app/auth/sign-in/page.tsx](/Users/nick/Documents/FloristSocial/floristsocial/app/auth/sign-in/page.tsx)
  contains the first sign-in screen
- [app/auth/callback/route.ts](/Users/nick/Documents/FloristSocial/floristsocial/app/auth/callback/route.ts)
  exchanges the auth code for a session
- [lib/supabase/server.ts](/Users/nick/Documents/FloristSocial/floristsocial/lib/supabase/server.ts)
  and [lib/supabase/client.ts](/Users/nick/Documents/FloristSocial/floristsocial/lib/supabase/client.ts)
  are the shared Supabase entry points

## Database foundation included

- [supabase/migrations/0001_initial_schema.sql](/Users/nick/Documents/FloristSocial/floristsocial/supabase/migrations/0001_initial_schema.sql)
  defines the initial enums, tables, triggers, indexes and RLS policies
- [lib/database.types.ts](/Users/nick/Documents/FloristSocial/floristsocial/lib/database.types.ts)
  provides typed Supabase access from the app code

## Onboarding foundation included

- [app/onboarding/florist/page.tsx](/Users/nick/Documents/FloristSocial/floristsocial/app/onboarding/florist/page.tsx)
  is the first florist setup route
- [app/onboarding/florist/actions.ts](/Users/nick/Documents/FloristSocial/floristsocial/app/onboarding/florist/actions.ts)
  updates `profiles` and `florist_profiles`
- [components/onboarding/florist-onboarding-form.tsx](/Users/nick/Documents/FloristSocial/floristsocial/components/onboarding/florist-onboarding-form.tsx)
  provides the first editable florist profile form

## Required environment variables

See [.env.example](/Users/nick/Documents/FloristSocial/floristsocial/.env.example).

## Launch checklist

See [docs/launch-checklist.md](/Users/nick/Documents/FloristSocial/floristsocial/docs/launch-checklist.md).

## Immediate next build target

Build Phase 1 foundation:

- Supabase client setup
- Authentication flows
- User roles
- Florist profile schema
- Directory data model
- Product and order schema
