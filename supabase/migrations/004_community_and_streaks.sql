-- City Jam v4: community feed, jam streaks, project stages

alter table public.music_projects
  add column if not exists stage text not null default 'ideas'
    check (stage in ('ideas', 'writing', 'recording', 'mixing', 'release'));

create table if not exists public.jam_streaks (
  user_id text primary key,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_jam_date date,
  total_jams int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  display_name text default '',
  kind text not null default 'post'
    check (kind in ('post', 'jam', 'project', 'need', 'milestone')),
  title text default '',
  body text not null,
  ref_id text default '',
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_idx on public.community_posts (created_at desc);

alter table public.jam_streaks enable row level security;
alter table public.community_posts enable row level security;

do $$ begin
  create policy "jam_streaks_all" on public.jam_streaks for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "community_posts_all" on public.community_posts for all using (true) with check (true);
exception when duplicate_object then null; end $$;

alter publication supabase_realtime add table public.community_posts;
