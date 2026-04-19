create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'florist',
  'private_customer',
  'business_customer',
  'admin'
);

create type public.order_source as enum (
  'direct',
  'referral'
);

create type public.order_status as enum (
  'draft',
  'pending_payment',
  'paid',
  'accepted',
  'in_production',
  'out_for_delivery',
  'completed',
  'cancelled',
  'refunded'
);

create type public.payout_status as enum (
  'pending',
  'scheduled',
  'paid',
  'failed',
  'reversed'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  full_name text,
  phone text,
  company_name text,
  avatar_url text,
  city text,
  country_code text default 'SE',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.florist_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  slug text not null unique,
  shop_name text not null,
  bio text,
  email text,
  phone text,
  website_url text,
  instagram_handle text,
  street_address text,
  postal_code text,
  city text not null,
  country_code text not null default 'SE',
  delivery_radius_km integer,
  fulfills_orders boolean not null default true,
  accepts_referrals boolean not null default true,
  stripe_account_id text,
  stripe_onboarding_complete boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint florist_profiles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  florist_profile_id uuid not null references public.florist_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  price_amount integer not null check (price_amount > 0),
  currency text not null default 'sek',
  image_url text,
  category text,
  occasion text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (florist_profile_id, slug)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_profile_id uuid references public.profiles(id) on delete set null,
  seller_florist_profile_id uuid references public.florist_profiles(id) on delete set null,
  executor_florist_profile_id uuid not null references public.florist_profiles(id) on delete restrict,
  source public.order_source not null default 'direct',
  status public.order_status not null default 'draft',
  stripe_payment_intent_id text unique,
  stripe_checkout_session_id text unique,
  currency text not null default 'sek',
  subtotal_amount integer not null check (subtotal_amount >= 0),
  delivery_fee_amount integer not null default 0 check (delivery_fee_amount >= 0),
  stripe_fee_amount integer not null default 0 check (stripe_fee_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  executor_amount integer not null default 0 check (executor_amount >= 0),
  seller_amount integer not null default 0 check (seller_amount >= 0),
  platform_amount integer not null default 0 check (platform_amount >= 0),
  recipient_name text not null,
  recipient_phone text,
  card_message text,
  delivery_address text,
  delivery_postal_code text,
  delivery_city text,
  delivery_date date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint referral_requires_seller check (
    (source = 'direct' and seller_florist_profile_id is null) or
    (source = 'referral' and seller_florist_profile_id is not null)
  ),
  constraint order_amount_consistency check (
    total_amount = subtotal_amount + delivery_fee_amount
  )
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  quantity integer not null check (quantity > 0),
  unit_price_amount integer not null check (unit_price_amount >= 0),
  line_total_amount integer not null check (line_total_amount >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  constraint line_total_matches check (
    line_total_amount = quantity * unit_price_amount
  )
);

create table if not exists public.payout_records (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  recipient_profile_id uuid references public.profiles(id) on delete set null,
  recipient_florist_profile_id uuid references public.florist_profiles(id) on delete set null,
  recipient_role public.app_role not null,
  stripe_transfer_id text unique,
  amount integer not null check (amount >= 0),
  currency text not null default 'sek',
  status public.payout_status not null default 'pending',
  available_on timestamptz,
  paid_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_handle_updated_at on public.profiles;
create trigger profiles_handle_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

drop trigger if exists florist_profiles_handle_updated_at on public.florist_profiles;
create trigger florist_profiles_handle_updated_at
before update on public.florist_profiles
for each row execute function public.handle_updated_at();

drop trigger if exists products_handle_updated_at on public.products;
create trigger products_handle_updated_at
before update on public.products
for each row execute function public.handle_updated_at();

drop trigger if exists orders_handle_updated_at on public.orders;
create trigger orders_handle_updated_at
before update on public.orders
for each row execute function public.handle_updated_at();

drop trigger if exists payout_records_handle_updated_at on public.payout_records;
create trigger payout_records_handle_updated_at
before update on public.payout_records
for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'private_customer'),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;

  return new;
exception
  when invalid_text_representation then
    insert into public.profiles (id, role, full_name)
    values (new.id, 'private_customer', new.raw_user_meta_data ->> 'full_name')
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create index if not exists florist_profiles_city_idx
  on public.florist_profiles (city);

create index if not exists florist_profiles_profile_id_idx
  on public.florist_profiles (profile_id);

create index if not exists products_florist_profile_id_idx
  on public.products (florist_profile_id);

create index if not exists products_active_idx
  on public.products (is_active);

create index if not exists orders_customer_profile_id_idx
  on public.orders (customer_profile_id);

create index if not exists orders_executor_florist_profile_id_idx
  on public.orders (executor_florist_profile_id);

create index if not exists orders_seller_florist_profile_id_idx
  on public.orders (seller_florist_profile_id);

create index if not exists orders_status_idx
  on public.orders (status);

create index if not exists payout_records_order_id_idx
  on public.payout_records (order_id);

alter table public.profiles enable row level security;
alter table public.florist_profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payout_records enable row level security;

create policy "profiles_select_own_or_public_florist"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or role = 'florist'
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "florist_profiles_select_public"
on public.florist_profiles
for select
to anon, authenticated
using (true);

create policy "florist_profiles_insert_own"
on public.florist_profiles
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.id = profile_id
      and profiles.role = 'florist'
  )
);

create policy "florist_profiles_update_own"
on public.florist_profiles
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "products_select_public"
on public.products
for select
to anon, authenticated
using (is_active = true);

create policy "products_manage_own"
on public.products
for all
to authenticated
using (
  exists (
    select 1
    from public.florist_profiles
    where florist_profiles.id = products.florist_profile_id
      and florist_profiles.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.florist_profiles
    where florist_profiles.id = products.florist_profile_id
      and florist_profiles.profile_id = auth.uid()
  )
);

create policy "orders_select_related"
on public.orders
for select
to authenticated
using (
  customer_profile_id = auth.uid()
  or exists (
    select 1
    from public.florist_profiles
    where florist_profiles.id in (
      orders.executor_florist_profile_id,
      orders.seller_florist_profile_id
    )
      and florist_profiles.profile_id = auth.uid()
  )
);

create policy "orders_insert_customer"
on public.orders
for insert
to authenticated
with check (
  customer_profile_id = auth.uid()
);

create policy "orders_update_related"
on public.orders
for update
to authenticated
using (
  customer_profile_id = auth.uid()
  or exists (
    select 1
    from public.florist_profiles
    where florist_profiles.id in (
      orders.executor_florist_profile_id,
      orders.seller_florist_profile_id
    )
      and florist_profiles.profile_id = auth.uid()
  )
)
with check (
  customer_profile_id = auth.uid()
  or exists (
    select 1
    from public.florist_profiles
    where florist_profiles.id in (
      orders.executor_florist_profile_id,
      orders.seller_florist_profile_id
    )
      and florist_profiles.profile_id = auth.uid()
  )
);

create policy "order_items_select_related"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (
        orders.customer_profile_id = auth.uid()
        or exists (
          select 1
          from public.florist_profiles
          where florist_profiles.id in (
            orders.executor_florist_profile_id,
            orders.seller_florist_profile_id
          )
            and florist_profiles.profile_id = auth.uid()
        )
      )
  )
);

create policy "order_items_insert_related"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.customer_profile_id = auth.uid()
  )
);

create policy "payout_records_select_related"
on public.payout_records
for select
to authenticated
using (
  recipient_profile_id = auth.uid()
  or exists (
    select 1
    from public.florist_profiles
    where florist_profiles.id = payout_records.recipient_florist_profile_id
      and florist_profiles.profile_id = auth.uid()
  )
);
