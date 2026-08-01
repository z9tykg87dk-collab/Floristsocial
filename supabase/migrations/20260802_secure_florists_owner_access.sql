begin;

alter table public.florists enable row level security;

drop policy if exists "florists_update_own" on public.florists;

create policy "florists_update_own"
on public.florists
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

comment on policy "florists_update_own" on public.florists is
  'Inloggad florist får endast uppdatera raden där florists.id motsvarar auth.uid().';

commit;
