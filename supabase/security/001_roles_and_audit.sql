-- FloristSocial security foundation

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  role text not null check (
    role in (
      'florist',
      'private_customer',
      'business_customer',
      'courier',
      'event_company',
      'supplier',
      'admin',
      'superadmin'
    )
  ),
  display_name text,
  company_name text,
  organization_number text,
  registration_number text,
  email text,
  is_active boolean default true,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_role text,
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

alter table public.user_profiles enable row level security;
alter table public.audit_logs enable row level security;

-- User can read own profile
drop policy if exists "user_profiles_read_own" on public.user_profiles;
create policy "user_profiles_read_own"
on public.user_profiles
for select
using (auth.uid() = user_id);

-- Admin and superadmin can read all profiles
drop policy if exists "user_profiles_admin_read_all" on public.user_profiles;
create policy "user_profiles_admin_read_all"
on public.user_profiles
for select
using (
  exists (
    select 1 from public.user_profiles p
    where p.user_id = auth.uid()
    and p.role in ('admin', 'superadmin')
  )
);

-- User can update own non-sensitive profile row.
-- Sensitive fields must be protected by API/server logic and admin workflows.
drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
on public.user_profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Only admins can read audit logs
drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read"
on public.audit_logs
for select
using (
  exists (
    select 1 from public.user_profiles p
    where p.user_id = auth.uid()
    and p.role in ('admin', 'superadmin')
  )
);
