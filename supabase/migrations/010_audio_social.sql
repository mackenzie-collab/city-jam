-- City Jam: Audio Social Scene — profiles, posts, follows, comments, reactions, listening rooms

-- Extend user profiles
alter table public.user_profiles
  add column if not exists username text unique,
  add column if not exists manifesto_quote text default '',
  add column if not exists cover_image_url text default '',
  add column if not exists featured_track_id uuid;

create index if not exists user_profiles_username_idx on public.user_profiles (username)
  where username is not null and username <> '';

-- Audio posts
create table if not exists public.audio_posts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  caption text default '',
  genre text default '',
  audio_url text not null,
  cover_url text default '',
  play_count int not null default 0,
  like_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists audio_posts_created_idx on public.audio_posts (created_at desc);
create index if not exists audio_posts_user_idx on public.audio_posts (user_id);
create index if not exists audio_posts_genre_idx on public.audio_posts (genre) where genre <> '';

-- Follows
create table if not exists public.follows (
  follower_id text not null,
  following_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

create index if not exists follows_following_idx on public.follows (following_id);

-- Audio comments
create table if not exists public.audio_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.audio_posts(id) on delete cascade,
  user_id text not null,
  display_name text default '',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists audio_comments_post_idx on public.audio_comments (post_id, created_at);

-- Audio reactions (likes)
create table if not exists public.audio_reactions (
  post_id uuid not null references public.audio_posts(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Listening rooms: synced audio
alter table public.listening_rooms
  add column if not exists audio_url text default '',
  add column if not exists host_user_id text default '';

-- Covers storage bucket
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- RLS
alter table public.audio_posts enable row level security;
alter table public.follows enable row level security;
alter table public.audio_comments enable row level security;
alter table public.audio_reactions enable row level security;

do $$ begin
  create policy "audio_posts_all" on public.audio_posts for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "follows_all" on public.follows for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "audio_comments_all" on public.audio_comments for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "audio_reactions_all" on public.audio_reactions for all using (true) with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "covers_public_read" on storage.objects for select using (bucket_id = 'covers');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "covers_public_insert" on storage.objects for insert with check (bucket_id = 'covers');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "covers_public_update" on storage.objects for update using (bucket_id = 'covers');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "covers_public_delete" on storage.objects for delete using (bucket_id = 'covers');
exception when duplicate_object then null; end $$;

-- Realtime
alter publication supabase_realtime add table public.audio_posts;
alter publication supabase_realtime add table public.audio_comments;

-- Seed demo audio posts (idempotent)
insert into public.audio_posts (id, user_id, title, caption, genre, audio_url, cover_url, play_count, like_count)
select * from (values
  (
    'a0000001-0000-4000-8000-000000000001'::uuid,
    'demo-user-1',
    'Midnight Signal',
    'Late-night synth sketch from the vault.',
    'ELECTRONIC',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    '/images/09_electronic_dj.png',
    142,
    23
  ),
  (
    'a0000002-0000-4000-8000-000000000002'::uuid,
    'demo-user-2',
    'Basement Tape #4',
    'Raw jazz piano — unmixed, unapologetic.',
    'JAZZ',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    '/images/07_jazz_pianist.png',
    89,
    17
  ),
  (
    'a0000003-0000-4000-8000-000000000003'::uuid,
    'demo-user-3',
    'City Static',
    'Beatbox loop layered with field recordings.',
    'HIP-HOP',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    '/images/05_beatboxer.png',
    256,
    41
  ),
  (
    'a0000004-0000-4000-8000-000000000004'::uuid,
    'demo-user-4',
    'Violin Breakdown',
    'Solo étude recorded in one take, no edits.',
    'CLASSICAL',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    '/images/04_classical_violinist.png',
    67,
    12
  )
) as v(id, user_id, title, caption, genre, audio_url, cover_url, play_count, like_count)
where not exists (select 1 from public.audio_posts limit 1);

-- Seed demo profiles with usernames
insert into public.user_profiles (user_id, display_name, username, genre, city, bio, manifesto_quote, role)
select * from (values
  ('demo-user-1', 'Night Operator', 'nightoperator', 'ELECTRONIC', 'Berlin', 'Modular synth. No masters.', 'Sound is the only honest language.', 'PRODUCER'),
  ('demo-user-2', 'Keys & Smoke', 'keysandsmoke', 'JAZZ', 'New Orleans', 'Piano in dim rooms.', 'Every note is a confession.', 'KEYS'),
  ('demo-user-3', 'Beat Architect', 'beatarchitect', 'HIP-HOP', 'London', 'Beatboxer turned producer.', 'The city speaks in rhythm.', 'VOCALS')
) as v(user_id, display_name, username, genre, city, bio, manifesto_quote, role)
on conflict (user_id) do update set
  username = excluded.username,
  manifesto_quote = excluded.manifesto_quote
where public.user_profiles.username is null or public.user_profiles.username = '';
