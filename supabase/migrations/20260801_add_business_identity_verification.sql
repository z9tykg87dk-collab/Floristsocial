begin;

alter table public.florists
  add column if not exists legal_form text,
  add column if not exists vat_registered boolean,
  add column if not exists f_tax_registered boolean,
  add column if not exists employer_registered boolean,

  add column if not exists business_identity_status text
    default 'UNVERIFIED',

  add column if not exists business_identity_score numeric(5,2),

  add column if not exists business_identity_provider text,

  add column if not exists business_identity_checked_at timestamptz,

  add column if not exists business_identity_confirmed_at timestamptz,

  add column if not exists business_identity_confirmed_by uuid,

  add column if not exists business_identity_candidates jsonb
    not null default '[]'::jsonb,

  add column if not exists business_identity_evidence jsonb
    not null default '[]'::jsonb,

  add column if not exists business_identity_contradictions jsonb
    not null default '[]'::jsonb,

  add column if not exists business_registry_snapshot jsonb
    not null default '{}'::jsonb,

  add column if not exists domain_email_verified boolean
    not null default false,

  add column if not exists domain_email_verified_at timestamptz,

  add column if not exists registrant_declaration_accepted boolean
    not null default false,

  add column if not exists registrant_declaration_accepted_at timestamptz,

  add column if not exists stripe_verification_status text
    not null default 'NOT_STARTED',

  add column if not exists stripe_verification_checked_at timestamptz;

update public.florists
set business_identity_status = 'UNVERIFIED'
where business_identity_status is null;

update public.florists
set stripe_verification_status = 'NOT_STARTED'
where stripe_verification_status is null;

alter table public.florists
  drop constraint if exists florists_business_identity_status_check;

alter table public.florists
  add constraint florists_business_identity_status_check
  check (
    business_identity_status in (
      'UNVERIFIED',
      'SUGGESTED',
      'USER_CONFIRMED',
      'SOURCE_VERIFIED',
      'ADMIN_REVIEW_REQUIRED',
      'ADMIN_VERIFIED',
      'REJECTED'
    )
  );

alter table public.florists
  drop constraint if exists florists_business_identity_score_check;

alter table public.florists
  add constraint florists_business_identity_score_check
  check (
    business_identity_score is null
    or (
      business_identity_score >= 0
      and business_identity_score <= 100
    )
  );

alter table public.florists
  drop constraint if exists florists_stripe_verification_status_check;

alter table public.florists
  add constraint florists_stripe_verification_status_check
  check (
    stripe_verification_status in (
      'NOT_STARTED',
      'PENDING',
      'RESTRICTED',
      'REQUIREMENTS_DUE',
      'VERIFIED',
      'DISABLED'
    )
  );

create index if not exists florists_business_identity_status_idx
  on public.florists (business_identity_status);

create index if not exists florists_organization_number_idx
  on public.florists (organization_number);

create index if not exists florists_business_identity_provider_idx
  on public.florists (business_identity_provider);

comment on column public.florists.legal_form is
  'Juridisk företagsform, exempelvis AB, EF, HB eller KB.';

comment on column public.florists.business_identity_status is
  'FloristSocials status för sambandet mellan butik och juridisk person.';

comment on column public.florists.business_identity_score is
  'Beräknad sannolikhet 0–100. AI-resultatet är ett förslag och inte en slutlig verifiering.';

comment on column public.florists.business_identity_candidates is
  'Normaliserade kandidater från register och publika källor.';

comment on column public.florists.business_identity_evidence is
  'Spårbara bevis som namn, adress, domän, telefon och organisationsnummer.';

comment on column public.florists.business_identity_contradictions is
  'Upptäckta motsägelser mellan butik och juridiskt företag.';

comment on column public.florists.business_registry_snapshot is
  'Ögonblicksbild från företagsregister med källa och kontrolltid.';

comment on column public.florists.domain_email_verified is
  'Anger om registreraren har verifierat en e-postadress på butikens domän.';

comment on column public.florists.registrant_declaration_accepted is
  'Anger om registreraren har försäkrat att företagsuppgifterna är korrekta.';

commit;
