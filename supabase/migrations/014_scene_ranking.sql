-- Scene feed ranking: Editor's Pick + popularity
-- Toggle picks manually in Supabase dashboard until admin UI exists.

alter table public.audio_posts
  add column if not exists is_editors_pick boolean not null default false,
  add column if not exists editors_pick_at timestamptz,
  add column if not exists editors_pick_rank int;

create index if not exists audio_posts_editors_pick_idx
  on public.audio_posts (editors_pick_rank nulls last, editors_pick_at desc nulls last)
  where is_editors_pick = true;

create index if not exists audio_posts_popularity_idx
  on public.audio_posts ((play_count + like_count) desc, created_at desc);

-- Seed editor's picks (idempotent)
update public.audio_posts
set
  is_editors_pick = true,
  editors_pick_at = coalesce(editors_pick_at, now()),
  editors_pick_rank = 1
where id = 'a0000003-0000-4000-8000-000000000003'::uuid;

update public.audio_posts
set
  is_editors_pick = true,
  editors_pick_at = coalesce(editors_pick_at, now()),
  editors_pick_rank = 2
where id = 'a0000016-0000-4000-8000-000000000016'::uuid;

update public.audio_posts
set
  is_editors_pick = true,
  editors_pick_at = coalesce(editors_pick_at, now()),
  editors_pick_rank = 3
where id = 'a0000001-0000-4000-8000-000000000001'::uuid;
