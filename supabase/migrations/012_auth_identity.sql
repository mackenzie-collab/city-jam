-- Unified identity: account roles, profile auto-create, tighter RLS baseline

do $$ begin
  create type public.account_role as enum ('member', 'producer', 'artist', 'moderator', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.account_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_role public.account_role not null default 'member',
  mfa_required boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.account_memberships enable row level security;

create policy "account_memberships_read_own"
  on public.account_memberships for select
  using (auth.uid() = user_id);

create policy "account_memberships_admin_all"
  on public.account_memberships for all
  using (
    exists (
      select 1 from public.account_memberships am
      where am.user_id = auth.uid() and am.account_role = 'admin'
    )
  );

-- Auto-create musician profile + member role on signup
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  dn text;
begin
  dn := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1),
    'Musician'
  );

  insert into public.user_profiles (user_id, display_name, role, genre, city, bio, avatar_url)
  values (new.id::text, dn, 'OTHER', '', '', '', '')
  on conflict (user_id) do update
    set display_name = case
      when public.user_profiles.display_name in ('', 'Musician', 'Guest Musician')
      then excluded.display_name
      else public.user_profiles.display_name
    end;

  insert into public.account_memberships (user_id, account_role, mfa_required)
  values (new.id, 'member', false)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- user_profiles: users can read all, write own (text user_id matches auth.uid())
drop policy if exists "user_profiles_all" on public.user_profiles;
create policy "user_profiles_read_all"
  on public.user_profiles for select using (true);
create policy "user_profiles_write_own"
  on public.user_profiles for insert with check (auth.uid()::text = user_id);
create policy "user_profiles_update_own"
  on public.user_profiles for update using (auth.uid()::text = user_id);

grant select on public.account_memberships to authenticated;
grant insert, update on public.account_memberships to authenticated;
