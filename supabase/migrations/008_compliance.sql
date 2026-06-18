-- Compliance: UGC content reports + RLS notes for future auth migration

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id text not null,
  content_type text not null check (
    content_type in ('community_post', 'circle_post', 'room_reaction')
  ),
  content_id uuid not null,
  reason text not null default 'other' check (
    reason in ('spam', 'harassment', 'inappropriate', 'copyright', 'other')
  ),
  details text default '',
  status text not null default 'pending' check (
    status in ('pending', 'reviewed', 'dismissed', 'action_taken')
  ),
  created_at timestamptz not null default now()
);

create index if not exists content_reports_status_idx
  on public.content_reports (status, created_at desc);

create index if not exists content_reports_content_idx
  on public.content_reports (content_type, content_id);

alter table public.content_reports enable row level security;

-- Demo auth: allow inserts from anon client; reads reserved for dashboard / service role
do $$ begin
  create policy "content_reports_insert" on public.content_reports
    for insert with check (reporter_id <> '');
exception when duplicate_object then null; end $$;

comment on table public.content_reports is
  'User-submitted UGC reports. Review in Supabase dashboard until admin UI exists.';

-- ---------------------------------------------------------------------------
-- RLS tightening deferred until Supabase Auth replaces client-side user ids.
-- Existing MVP policies (e.g. user_profiles_all, map_presence_all) remain open
-- so anon-key demo auth keeps working. After auth migration:
--   1. Map user_id columns to auth.users.id
--   2. Replace *_all policies with auth.uid() = user_id checks
--   3. Restrict content_reports SELECT to service role only
-- ---------------------------------------------------------------------------
