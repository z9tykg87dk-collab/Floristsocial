# STATUS

Datum: 2026-04-26

## ✅ Senast klart
- Customer role fungerar
- /shop skyddas via global auth
- Products-tabell skapad i Supabase
- Products RLS-policy fungerar
- /shop visar aktiva produkter
- Testprodukter rensade från dubletter

## 🔜 Nästa steg
- koppla riktiga produkter från WordPress/WooCommerce
- skapa produktsida /shop/[id]
- lägga till köp-/beställ-knapp
- börja order flow

## ✅ Senast klart
- Global auth/middleware fungerar
- /admin skyddas globalt:
  - admin → /admin
  - florist → /dashboard
- /login redirectar inloggad användare:
  - florist → /dashboard
  - admin → /admin
- /dashboard kräver inloggning
- role = florist testad och fungerar
- role = admin testad och fungerar

## 🔜 Nästa steg
- customer auth
- customer dashboard/shop
- logout-knapp
- backup

## ✅ Klart
- Supabase auth fungerar (email + password)
- Session fungerar (server + client)
- /api/me fungerar och returnerar role
- florist kopplad till auth user (id matchar)
- role finns i DB (florists.role)
- redirect efter login fungerar
- dashboard skyddad (endast inloggad)
- dashboard visar session korrekt
- admin-sida återställd från backup
- admin-sida kopplad till nya role-systemet
- /admin skyddad:
  - admin → får access
  - florist → blockeras
- createSupabaseServerClient används korrekt i admin auth
- dev-server stabil med webpack

## 🔜 Nästa steg
- Global auth (proxy/middleware)
- redirect från /login om redan inloggad
- skydda fler routes centralt
- customer flow
- refactor dashboard (ta bort gammal bundle-logik)

## 🚧 Noteringar
- Turbopack kraschade → använder:
  npm run dev -- --webpack
- Stripe env saknas (OK just nu)
- admin använder fortfarande florist_profiles (kan fixas senare)

## Testat
- /login ✔️
- /api/me ✔️
- /dashboard ✔️
- /admin (admin role) ✔️
- /admin (florist role) ✔️

## Senaste fungerande state
- Inloggad som: faktura@makalosablommor.se
- Role: florist / admin (testad båda)
- Dashboard: fungerar
- Admin: fungerar + skyddad
