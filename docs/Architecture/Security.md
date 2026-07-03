# FOS Security Model

## Roller

FOS har fyra behörighetsnivåer:

1. Visitor
2. User
3. Admin
4. Superadmin

## Admin

Admin får hantera drift, support, godkännanden, moderation, rapporter och användarstöd.

Admin får inte ändra FOS-inställningar, systeminställningar, provisioner, betalningslogik, säkerhetsregler eller Engine-konfiguration.

## Superadmin

Superadmin är systemägaren och får ändra FOS, systemregler, betalningslogik, provisioner, säkerhet och Engine-konfiguration.

## Audit Log

Alla viktiga ändringar ska loggas.

Varje Admin och Superadmin måste ha egen identitet i Audit Log:

- actorUserId
- actorDisplayName
- actorEmail
- actorRole

Audit Log ska vara append-only. Ingen användare, Admin eller Superadmin ska kunna radera audit-historik.

## System Actor

När FOS själv gör något används actorType = system.
