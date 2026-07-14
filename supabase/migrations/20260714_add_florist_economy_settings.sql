-- FloristSocial: ekonomiska grundinställningar för floristens företagspass

alter table public.florists
  add column if not exists economy_settings jsonb not null default '{}'::jsonb;

comment on column public.florists.economy_settings is
  'Ekonomiska grundinställningar: provisionsmodell, kostnadshantering, bokföring, moms och utbetalningar.';
