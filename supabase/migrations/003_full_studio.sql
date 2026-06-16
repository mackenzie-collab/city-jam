-- City Jam v3: profiles, file metadata, applications, reactions, circle posts

-- Vault file metadata
alter table public.vault_items
  add column if not exists file_url text,
  add column if not exists file_size bigint default 0,
  add column if not exists mime_type text default '';

-- Musician profiles (keyed by client user id)
create table if not exists public.user_profiles (
  user_id text primary key,
  display_name text not null default '',
  role text default 'OTHER',
  genre text default '',
  city text default '',
  bio text default '',
  avatar_url text default '',
  updated_at timestamptz not null default now()
);

-- Project need applications
create table if not exists public.project_applications (
  id uuid primary key default gen_random_uuid(),
  need_id uuid not null references public.project_needs(id) on delete cascade,
  applicant_id text not null,
  message text default '',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (need_id, applicant_id)
);

create index if not exists project_applications_need_idx on public.project_applications (need_id);

-- Listening room reactions
create table if not exists public.listening_room_reactions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.listening_rooms(id) on delete cascade,
  user_id text not null,
  display_name text default '',
  timestamp_sec int not null default 0,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists listening_reactions_room_idx on public.listening_room_reactions (room_id, created_at);

-- Circle posts
create table if not exists public.circle_posts (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  author_id text not null,
  display_name text default '',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists circle_posts_circle_idx on public.circle_posts (circle_id, created_at desc);

-- RLS
alter table public.user_profiles enable row level security;
alter table public.project_applications enable row level security;
alter table public.listening_room_reactions enable row level security;
alter table public.circle_posts enable row level security;

do $$ begin
  create policy "user_profiles_all" on public.user_profiles for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "project_applications_all" on public.project_applications for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "listening_reactions_all" on public.listening_room_reactions for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "circle_posts_all" on public.circle_posts for all using (true) with check (true);
exception when duplicate_object then null; end $$;

-- Realtime
alter publication supabase_realtime add table public.project_applications;
alter publication supabase_realtime add table public.listening_room_reactions;
alter publication supabase_realtime add table public.circle_posts;

-- Storage bucket for vault audio
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vault',
  'vault',
  true,
  52428800,
  array['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4', 'audio/x-wav', 'audio/flac']
)
on conflict (id) do nothing;

do $$ begin
  create policy "vault_public_read" on storage.objects for select using (bucket_id = 'vault');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "vault_anon_upload" on storage.objects for insert with check (bucket_id = 'vault');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "vault_anon_update" on storage.objects for update using (bucket_id = 'vault');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "vault_anon_delete" on storage.objects for delete using (bucket_id = 'vault');
exception when duplicate_object then null; end $$;
