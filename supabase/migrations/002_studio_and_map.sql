-- City Jam Studio — music project management + map presence v2

-- Enhance map presence
alter table public.map_presence
  add column if not exists city_slug text,
  add column if not exists alias text;

create index if not exists map_presence_city_idx on public.map_presence (city_slug);

-- Music projects (hub for vault + collab)
create table if not exists public.music_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  title text not null,
  description text default '',
  genre text default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project match needs
create table if not exists public.project_needs (
  id uuid primary key default gen_random_uuid(),
  author_id text not null,
  project_id uuid references public.music_projects(id) on delete set null,
  title text not null,
  role text not null,
  genre text not null default '',
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists project_needs_role_idx on public.project_needs (role, status);

-- Audio vault
create table if not exists public.vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  project_id uuid references public.music_projects(id) on delete set null,
  title text not null,
  kind text not null default 'demo' check (kind in ('demo', 'stem', 'recording', 'mix')),
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists vault_items_user_idx on public.vault_items (user_id);

-- Collab workspaces
create table if not exists public.collab_workspaces (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.music_projects(id) on delete cascade,
  owner_id text not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.collab_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.collab_workspaces(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Private circles
create table if not exists public.circles (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null,
  description text default '',
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.circle_members (
  circle_id uuid not null references public.circles(id) on delete cascade,
  user_id text not null,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

-- Listening rooms
create table if not exists public.listening_rooms (
  id uuid primary key default gen_random_uuid(),
  creator_id text not null,
  title text not null,
  artist text default '',
  album text default '',
  created_at timestamptz not null default now()
);

-- RLS
alter table public.music_projects enable row level security;
alter table public.project_needs enable row level security;
alter table public.vault_items enable row level security;
alter table public.collab_workspaces enable row level security;
alter table public.collab_tasks enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.listening_rooms enable row level security;

-- MVP open policies
do $$ begin
  create policy "music_projects_all" on public.music_projects for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "project_needs_all" on public.project_needs for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "vault_items_all" on public.vault_items for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "collab_workspaces_all" on public.collab_workspaces for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "collab_tasks_all" on public.collab_tasks for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "circles_all" on public.circles for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "circle_members_all" on public.circle_members for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "listening_rooms_all" on public.listening_rooms for all using (true) with check (true);
exception when duplicate_object then null; end $$;

-- Realtime
alter publication supabase_realtime add table public.music_projects;
alter publication supabase_realtime add table public.project_needs;
alter publication supabase_realtime add table public.vault_items;
alter publication supabase_realtime add table public.collab_workspaces;
alter publication supabase_realtime add table public.collab_tasks;
alter publication supabase_realtime add table public.circles;
alter publication supabase_realtime add table public.listening_rooms;

-- Seed demo project need (idempotent)
insert into public.project_needs (author_id, title, role, genre, status)
select 'system', 'Rock vocalist in need', 'VOCALIST', 'ROCK', 'open'
where not exists (
  select 1 from public.project_needs where title = 'Rock vocalist in need'
);

-- City online counts view
create or replace view public.city_online_counts as
select
  city_slug,
  count(*)::int as online_count
from public.map_presence
where city_slug is not null
  and updated_at > now() - interval '15 minutes'
group by city_slug;

grant select on public.city_online_counts to anon, authenticated;
