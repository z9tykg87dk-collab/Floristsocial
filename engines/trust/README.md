# Trust Engine

## Syfte

Trust Engine ansvarar för verifierade köpupplevelser, omdömen och FloristSocials betygssystem.

FloristSocial använder inte öppna recensioner från personer utan verifierad beställning. Alla omdömen ska vara kopplade till en genomförd order.

---

## Grundprincip

Endast verifierade köp kan skapa omdömen.

Order → Levererad → Ratingförfrågan → Kundomdöme → Trust Score

---

## Rating UI

Trust Engine använder FloristSocials egen blomma från logotypen som betygssymbol, inte stjärnor eller hjärtan.

Kategorier:

- Kvalitet 1–5
- Form & design 1–5
- Färg 1–5
- Leverans 1–5

Kunden kan också svara på:

- Skulle du beställa från denna florist igen?

---

## Workflow

När en order markeras som levererad triggas:

DELIVERY_COMPLETED

Workflow Engine skickar vidare till Trust Engine och Notification Engine.

Trust Engine planerar en ratingförfrågan 1–2 dagar efter leverans.

---

## Påverkar

Trust Engine levererar data till:

- Floristprofil
- Match Engine
- Analytics Engine
- Intelligence Engine
- Admin
- FOS Trust Score
