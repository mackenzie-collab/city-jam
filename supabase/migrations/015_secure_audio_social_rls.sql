-- Tighten Scene audio-social writes while preserving public read access.

-- The previous *_all policies allowed anon/authenticated clients to update or
-- delete any row. Replace them with read-all/write-own policies and column
-- grants so protected ranking/count fields cannot be client-supplied.

drop policy if exists "audio_posts_all" on public.audio_posts;
drop policy if exists "audio_posts_read_all" on public.audio_posts;
drop policy if exists "audio_posts_insert_own" on public.audio_posts;
drop policy if exists "audio_posts_delete_own" on public.audio_posts;
drop policy if exists "audio_posts_increment_play_count" on public.audio_posts;

revoke all on public.audio_posts from anon, authenticated;
grant select on public.audio_posts to anon, authenticated;
grant insert (user_id, title, caption, genre, audio_url, cover_url)
  on public.audio_posts to authenticated;
grant delete on public.audio_posts to authenticated;

create policy "audio_posts_read_all"
  on public.audio_posts for select
  to anon, authenticated
  using (true);

create policy "audio_posts_insert_own"
  on public.audio_posts for insert
  to authenticated
  with check (auth.uid()::text = user_id);

create policy "audio_posts_delete_own"
  on public.audio_posts for delete
  to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists "audio_comments_all" on public.audio_comments;
drop policy if exists "audio_comments_read_all" on public.audio_comments;
drop policy if exists "audio_comments_insert_own" on public.audio_comments;
drop policy if exists "audio_comments_delete_own" on public.audio_comments;

revoke all on public.audio_comments from anon, authenticated;
grant select on public.audio_comments to anon, authenticated;
grant insert (post_id, user_id, display_name, body)
  on public.audio_comments to authenticated;
grant delete on public.audio_comments to authenticated;

create policy "audio_comments_read_all"
  on public.audio_comments for select
  to anon, authenticated
  using (true);

create policy "audio_comments_insert_own"
  on public.audio_comments for insert
  to authenticated
  with check (auth.uid()::text = user_id);

create policy "audio_comments_delete_own"
  on public.audio_comments for delete
  to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists "audio_reactions_all" on public.audio_reactions;
drop policy if exists "audio_reactions_read_all" on public.audio_reactions;
drop policy if exists "audio_reactions_insert_own" on public.audio_reactions;
drop policy if exists "audio_reactions_delete_own" on public.audio_reactions;

revoke all on public.audio_reactions from anon, authenticated;
grant select on public.audio_reactions to anon, authenticated;
grant insert (post_id, user_id) on public.audio_reactions to authenticated;
grant delete on public.audio_reactions to authenticated;

create policy "audio_reactions_read_all"
  on public.audio_reactions for select
  to anon, authenticated
  using (true);

create policy "audio_reactions_insert_own"
  on public.audio_reactions for insert
  to authenticated
  with check (auth.uid()::text = user_id);

create policy "audio_reactions_delete_own"
  on public.audio_reactions for delete
  to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists "follows_all" on public.follows;
drop policy if exists "follows_read_all" on public.follows;
drop policy if exists "follows_insert_own" on public.follows;
drop policy if exists "follows_delete_own" on public.follows;

revoke all on public.follows from anon, authenticated;
grant select on public.follows to anon, authenticated;
grant insert (follower_id, following_id) on public.follows to authenticated;
grant delete on public.follows to authenticated;

create policy "follows_read_all"
  on public.follows for select
  to anon, authenticated
  using (true);

create policy "follows_insert_own"
  on public.follows for insert
  to authenticated
  with check (auth.uid()::text = follower_id);

create policy "follows_delete_own"
  on public.follows for delete
  to authenticated
  using (auth.uid()::text = follower_id);

create or replace function public.increment_audio_post_play_count(p_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.audio_posts
  set play_count = play_count + 1
  where id = p_post_id;
end;
$$;

revoke all on function public.increment_audio_post_play_count(uuid) from public;
grant execute on function public.increment_audio_post_play_count(uuid) to anon, authenticated;

create or replace function public.sync_audio_post_like_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.audio_posts
    set like_count = like_count + 1
    where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.audio_posts
    set like_count = greatest(like_count - 1, 0)
    where id = old.post_id;
    return old;
  end if;

  return null;
end;
$$;

revoke all on function public.sync_audio_post_like_count() from public;

drop trigger if exists audio_reactions_sync_like_count on public.audio_reactions;
create trigger audio_reactions_sync_like_count
  after insert or delete on public.audio_reactions
  for each row execute function public.sync_audio_post_like_count();

create or replace function public.sync_audio_post_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.audio_posts
    set comment_count = comment_count + 1
    where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.audio_posts
    set comment_count = greatest(comment_count - 1, 0)
    where id = old.post_id;
    return old;
  end if;

  return null;
end;
$$;

revoke all on function public.sync_audio_post_comment_count() from public;

drop trigger if exists audio_comments_sync_comment_count on public.audio_comments;
create trigger audio_comments_sync_comment_count
  after insert or delete on public.audio_comments
  for each row execute function public.sync_audio_post_comment_count();
