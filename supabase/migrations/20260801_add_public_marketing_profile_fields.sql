begin;

alter table public.florists
  add column if not exists specialties jsonb
    not null default '[]'::jsonb,

  add column if not exists quality_badges jsonb
    not null default '[]'::jsonb,

  add column if not exists sustainability_options jsonb
    not null default '[]'::jsonb,

  add column if not exists sustainability_text text;

comment on column public.florists.specialties is
  'Publika specialiteter som floristen själv väljer och kan redigera.';

comment on column public.florists.quality_badges is
  'Publika kvalitetsmärken och styrkor angivna av floristen.';

comment on column public.florists.sustainability_options is
  'Publika hållbarhetsåtgärder som floristen har valt.';

comment on column public.florists.sustainability_text is
  'Floristens publika beskrivning av sitt hållbarhetsarbete.';

commit;
