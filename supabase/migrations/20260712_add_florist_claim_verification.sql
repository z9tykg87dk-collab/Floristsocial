-- FloristSocial: claim- och verifieringsmodell

alter table public.florists
  add column if not exists external_place_id text,
  add column if not exists claim_status text not null default 'CLAIM_PENDING',
  add column if not exists verification_level text not null default 'NONE';

-- Endast tillåtna claim-statusar.
alter table public.florists
  drop constraint if exists florists_claim_status_check;

alter table public.florists
  add constraint florists_claim_status_check
  check (
    claim_status in (
      'GOOGLE_DISCOVERED',
      'CLAIM_PENDING',
      'APPROVED_DISPLAY',
      'REJECTED',
      'SUSPENDED'
    )
  );

-- Endast tillåtna verifieringsnivåer.
alter table public.florists
  drop constraint if exists florists_verification_level_check;

alter table public.florists
  add constraint florists_verification_level_check
  check (
    verification_level in (
      'NONE',
      'BASIC',
      'BUSINESS',
      'FULL'
    )
  );

-- Samma externa Google-plats får bara kopplas till en floristpost.
create unique index if not exists florists_external_place_id_unique
  on public.florists (external_place_id)
  where external_place_id is not null
    and external_place_id <> '';

create index if not exists florists_claim_status_index
  on public.florists (claim_status);

create index if not exists florists_verification_level_index
  on public.florists (verification_level);

comment on column public.florists.external_place_id is
  'Permanent ID från extern kartleverantör, exempelvis Google Place ID.';

comment on column public.florists.claim_status is
  'Styr butikens status i FloristSocials claim- och kartsystem.';

comment on column public.florists.verification_level is
  'FloristSocials verifieringsnivå: NONE, BASIC, BUSINESS eller FULL.';
