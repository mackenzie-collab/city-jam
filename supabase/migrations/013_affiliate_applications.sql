-- Affiliate / waitlist applications from public landing page
create table if not exists public.affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  handle text,
  track text not null check (track in ('individual', 'band')),
  heard_from text not null,
  source text not null default 'affiliate-landing',
  submitted_at timestamptz not null default now()
);

create index if not exists affiliate_applications_email_idx on public.affiliate_applications (email);
create index if not exists affiliate_applications_submitted_at_idx on public.affiliate_applications (submitted_at desc);

alter table public.affiliate_applications enable row level security;

drop policy if exists "Allow anonymous affiliate waitlist inserts" on public.affiliate_applications;
create policy "Allow anonymous affiliate waitlist inserts"
  on public.affiliate_applications
  for insert
  to anon, authenticated
  with check (true);

-- No public reads — view submissions in Supabase dashboard or service role only
