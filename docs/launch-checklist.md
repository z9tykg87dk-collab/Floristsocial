# FloristSocial Launch Checklist

## 1. Supabase

1. Create the Supabase project.
2. Open SQL Editor and run:
   - [0001_initial_schema.sql](/Users/nick/Documents/FloristSocial/floristsocial/supabase/migrations/0001_initial_schema.sql)
   - [0002_stripe_event_log.sql](/Users/nick/Documents/FloristSocial/floristsocial/supabase/migrations/0002_stripe_event_log.sql)
3. In `Authentication -> URL Configuration`, set:
   - Site URL: your Vercel production URL
   - Redirect URLs: `http://localhost:3000/auth/callback` and your production `/auth/callback`
4. In `Project Settings -> API`, copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Promote your own user to `admin` in the `profiles` table after first sign-in.

## 2. Stripe

1. Stay in Stripe test mode first.
2. Copy these keys from `Developers -> API keys`:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Create a webhook endpoint pointing to:
   - Local: `http://localhost:3000/api/stripe/webhook`
   - Production: `https://your-domain/api/stripe/webhook`
4. Subscribe at minimum to:
   - `checkout.session.completed`
   - `account.updated`
5. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## 3. Vercel

1. Import the GitHub repository into Vercel.
2. Add all variables from [.env.example](/Users/nick/Documents/FloristSocial/floristsocial/.env.example) to:
   - Development
   - Preview
   - Production
3. Set `NEXT_PUBLIC_APP_URL` to the exact deployment URL for each environment.
4. Redeploy after adding or changing any environment variable.

## 4. Local `.env.local`

1. Copy the example:
```bash
cp .env.example .env.local
```
2. Fill every required value before testing checkout or webhooks.

## 5. End-to-end test order

1. Open [/setup](/Users/nick/Documents/FloristSocial/floristsocial/app/setup/page.tsx) or `/api/health`.
2. Sign in.
3. Complete florist onboarding.
4. Start Stripe Connect onboarding for the florist.
5. Create one product.
6. Place one direct order.
7. Place one referral order through a seller florist link.
8. Confirm:
   - order status becomes `paid`
   - `payout_records` are created
   - referral orders split into executor, seller and platform rows
   - admin view shows the new orders and payouts

## 6. Pre-launch checks

1. `npm run lint`
2. `/setup` shows no `error`
3. Stripe webhook deliveries succeed
4. Supabase auth callback works on production domain
5. Admin account can open `/admin`
