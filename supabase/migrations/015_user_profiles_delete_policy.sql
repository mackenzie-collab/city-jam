-- Restore account deletion for authenticated users after tightening user_profiles RLS.
grant delete on public.user_profiles to authenticated;

drop policy if exists "user_profiles_delete_own" on public.user_profiles;
create policy "user_profiles_delete_own"
  on public.user_profiles for delete
  using (auth.uid()::text = user_id);
