# FOS State

## Syfte

FOS State är den gemensamma sanningen för vad som händer i FloristSocial Operating System.

Den håller reda på:

- aktuell status
- aktuellt steg
- nästa steg
- föregående steg
- ägare
- tidslinje

## Princip

Engines ska inte själva gissa vad som händer.

De ska läsa och uppdatera FOS State via tydliga services.

## Exempel

Order skapad

↓

FOS State:
status = planned
currentStep = order_received
nextStep = production_planned

## Timeline

Alla viktiga förändringar ska kunna registreras som FOS Timeline Items.
