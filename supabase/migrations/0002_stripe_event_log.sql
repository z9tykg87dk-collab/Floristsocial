create table if not exists public.stripe_webhook_events (
  id text primary key,
  type text not null,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists stripe_webhook_events_type_idx
  on public.stripe_webhook_events (type);

alter table public.stripe_webhook_events enable row level security;
