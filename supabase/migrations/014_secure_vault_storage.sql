-- Lock down private vault metadata and storage object writes.
-- Public bucket URLs may still be used for playback/rendering, but clients can
-- no longer enumerate, overwrite, or delete another user's object records.

alter table public.vault_items enable row level security;

drop policy if exists "vault_items_all" on public.vault_items;
drop policy if exists "vault_items_select_own" on public.vault_items;
drop policy if exists "vault_items_insert_own" on public.vault_items;
drop policy if exists "vault_items_update_own" on public.vault_items;
drop policy if exists "vault_items_delete_own" on public.vault_items;

create policy "vault_items_select_own"
  on public.vault_items
  for select
  to authenticated
  using (auth.uid()::text = user_id);

create policy "vault_items_insert_own"
  on public.vault_items
  for insert
  to authenticated
  with check (auth.uid()::text = user_id);

create policy "vault_items_update_own"
  on public.vault_items
  for update
  to authenticated
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "vault_items_delete_own"
  on public.vault_items
  for delete
  to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists "vault_public_read" on storage.objects;
drop policy if exists "vault_anon_upload" on storage.objects;
drop policy if exists "vault_anon_update" on storage.objects;
drop policy if exists "vault_anon_delete" on storage.objects;
drop policy if exists "vault_read_own_path" on storage.objects;
drop policy if exists "vault_insert_own_path" on storage.objects;
drop policy if exists "vault_update_own_path" on storage.objects;
drop policy if exists "vault_delete_own_path" on storage.objects;

create policy "vault_read_own_path"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vault_insert_own_path"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vault_update_own_path"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vault_delete_own_path"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "covers_public_read" on storage.objects;
drop policy if exists "covers_public_insert" on storage.objects;
drop policy if exists "covers_public_update" on storage.objects;
drop policy if exists "covers_public_delete" on storage.objects;
drop policy if exists "covers_read_own_path" on storage.objects;
drop policy if exists "covers_insert_own_path" on storage.objects;
drop policy if exists "covers_update_own_path" on storage.objects;
drop policy if exists "covers_delete_own_path" on storage.objects;

create policy "covers_read_own_path"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "covers_insert_own_path"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "covers_update_own_path"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "covers_delete_own_path"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
