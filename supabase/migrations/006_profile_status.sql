-- Profile status for discovery and community feed

alter table public.user_profiles
  add column if not exists status_text varchar(280) default '',
  add column if not exists status_artist text default '',
  add column if not exists status_mood text default '' check (
    status_mood = '' or status_mood in ('listening', 'writing', 'recording', 'open-to-collab')
  ),
  add column if not exists status_updated_at timestamptz;

create index if not exists user_profiles_status_mood_idx
  on public.user_profiles (status_mood)
  where status_mood <> '';

create index if not exists user_profiles_city_idx
  on public.user_profiles (city)
  where city <> '';
