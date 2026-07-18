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

--------------------------------------------------------------------------------------
Vision & Filosofi

FloristSocial – Vision & Filosofi
Vi tror på floristbranschen
Florister skapar glädje, tröst, kärlek och minnen.
Bakom varje bukett finns en människa med kunskap, kreativitet och ett stort engagemang.
Vi tror att dessa människor förtjänar bättre digitala verktyg.
FloristSocial är skapat för att hjälpa floristbranschen att utvecklas – inte bara digitalt, utan även ekonomiskt och långsiktigt.
Varför FloristSocial finns
Vi ser en bransch där många företag möter samma utmaningar:
Florister har svårt att uppnå långsiktig lönsamhet.
Administration tar onödigt mycket tid.
Många olika system måste användas samtidigt.
Viktiga beslut fattas utan tillräckligt beslutsunderlag.
Integrationer mellan system är ofta komplicerade.
Små företag har sällan möjlighet att investera i avancerade affärssystem.
Digitalisering blir ibland en belastning istället för en hjälp.
Vi tror att detta går att förändra.
Vår vision
Vi vill skapa en plattform där tekniken arbetar för människan.
Floristen ska kunna fokusera på:
kreativitet,
kundrelationer,
kvalitet,
hantverk,
och företagets utveckling.
Systemet ska ta hand om resten.
Våra grundprinciper
Varje del av FloristSocial ska bidra till:
högre kvalitet,
bättre lönsamhet,
mindre administration,
tryggare beslut,
hållbar tillväxt,
bättre kundupplevelser,
enklare arbetsdagar,
effektivare samarbete,
och långsiktig utveckling.
Teknik med ett syfte
Vi utvecklar inte funktioner bara för att tekniken gör det möjligt.
Varje ny funktion ska skapa ett verkligt värde.
Den ska hjälpa användaren att arbeta smartare, fatta bättre beslut eller utveckla sitt företag.
Teknik ska vara ett verktyg – aldrig ett hinder.
En plattform som växer tillsammans med företaget
FloristSocial ska kunna användas av:
den lilla lokala blomsterbutiken,
den etablerade kedjan,
eventföretag,
leveranspartners,
och framtida aktörer inom blomsterbranschen.
Plattformen ska växa tillsammans med företaget, inte tvinga företaget att anpassa sig efter systemet.
Samarbete framför inlåsning
Vi tror på öppna samarbeten.
FloristSocial ska kunna samverka med andra affärssystem, ekonomisystem, kassasystem och framtida digitala tjänster.
Företag ska själva kunna välja de lösningar som passar dem bäst.
AI som stöd
Artificiell intelligens ska hjälpa människor.
Den ska:
analysera,
föreslå,
varna,
planera,
och ge bättre beslutsunderlag.
Det slutliga beslutet ska alltid vara människans.
Långsiktighet
Vi bygger inte för nästa kvartal.
Vi bygger för många år framåt.
Varje beslut ska bidra till en stabil, hållbar och framtidssäker plattform.
Vår filosofi
Vi tror att teknik ska skapa möjligheter.
När administration minskar får kreativiteten mer utrymme.
När besluten blir tryggare blir företagen starkare.
När företagen blir starkare får människor möjlighet att fortsätta skapa glädje genom sitt hantverk.
Det är därför FloristSocial finns.
Vårt löfte
Vi vill vara mer än en digital plattform.
Vi vill vara en långsiktig partner för floristbranschen.
Vi vill bidra till att fler företag utvecklas, fler människor lyckas och fler kunder får uppleva glädjen som blommor kan skapa.
FloristSocials motto
"Vi bygger inte teknik för teknikens skull. Vi bygger teknik som hjälper floristbranschen att blomstra."
Jag tycker också att vi ska ha ett internt motto, som inte publiceras och bara finns i NFOS:
"Det som syns är FloristSocial. Det som gör skillnaden är FloristOS."
Det sammanfattar exakt den strategi vi har pratat om. Användarna kommer att uppleva en enkel, kraftfull och hjälpsam plattform. Konkurrenter kan kopiera det de ser på ytan, men den verkliga styrkan – arkitekturen, motorerna, beslutsstödet och samspelet mellan dem – finns i NFOS, som förblir FloristSocials interna kärna och långsiktiga konkurrensfördel. 🌸
