# FOS Event Bus

## Syfte

FOS Event Bus är nervsystemet i FloristSocial Operating System.

Engines ska kunna publicera händelser utan att känna till vilka andra Engines som lyssnar.

## Princip

Engine → Event Bus → Subscribers

## Exempel

ORDER_CREATED publiceras av Order Engine.

Därefter kan följande lyssna:

- Workflow Engine
- Calendar Engine
- Production Engine
- Workspace Engine
- Trust Engine
- CRM Engine
- Intelligence Engine

## Viktigt

Event Bus ska minska direkta beroenden mellan Engines.

Det gör FOS lättare att bygga ut utan att gamla funktioner behöver ändras.
