# Order → Production → Delivery Workflow

## Syfte

Detta dokument beskriver första kompletta FOS-flödet från order till leverans.

## Flöde

1. Order mottagen
2. Production Planning räknar ut produktionsdag
3. Production Engine skapar produktionsjobb
4. Production Engine skapar checklista
5. Calendar Engine skapar aktiviteter
6. Workspace visar Nästa steg
7. Budhämtning planeras vid behov
8. Kundleverans genomförs
9. Trust Rating planeras 1–2 dagar efter leverans

## Viktiga regler

- Leverans senast 13:00 ska produceras dagen innan.
- Leverans utanför stadsgränsen ska produceras dagen innan.
- Leverans utanför stadsgränsen ska ha budhämtning tidig morgon.
- Produktionens starttid ska styras av floristens arbetsstart, ofta 10:00.
- Produktionstid och packningstid beräknas av Production Engine.

## Ansvar

- Order Engine: orderflödet
- Production Engine: produktion, packning och checklista
- Calendar Engine: tidpunkter och aktiviteter
- Workflow Engine: orkestrering
- Workspace Engine: visar arbetet för användaren
- Trust Engine: uppföljning efter leverans
