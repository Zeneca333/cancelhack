create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  domain text not null,
  logo_url text,
  category text not null check (category in ('streaming', 'software', 'fitness', 'music', 'gaming', 'news', 'cloud', 'other')),
  normal_price text not null,
  retention_offer text not null,
  estimated_savings decimal not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  cancel_steps jsonb not null,
  tips text,
  source_notes text not null,
  last_verified timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_category on services(category);
