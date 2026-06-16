-- City Jam — run in Supabase SQL Editor (Dashboard → SQL → New query)

-- Match queue
create table if not exists public.match_queue (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  mode text not null check (mode in ('blind-echo', 'echo-roulette')),
  frequency numeric,
  status text not null default 'waiting' check (status in ('waiting', 'matched', 'cancelled')),
  session_id uuid,
  is_initiator boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists match_queue_waiting_idx
  on public.match_queue (mode, status, created_at);

-- Map presence (neighborhood-level, rounded coords)
create table if not exists public.map_presence (
  user_id text primary key,
  lng numeric not null,
  lat numeric not null,
  updated_at timestamptz not null default now()
);

-- Session decisions (transmit / fade)
create table if not exists public.session_decisions (
  session_id uuid not null,
  user_id text not null,
  decision text not null check (decision in ('transmit', 'fade')),
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

alter table public.match_queue enable row level security;
alter table public.map_presence enable row level security;
alter table public.session_decisions enable row level security;

-- Open policies for MVP (tighten before production)
create policy "match_queue_all" on public.match_queue for all using (true) with check (true);
create policy "map_presence_all" on public.map_presence for all using (true) with check (true);
create policy "session_decisions_all" on public.session_decisions for all using (true) with check (true);

-- Atomic match pairing
create or replace function public.try_match(
  p_user_id text,
  p_mode text,
  p_frequency numeric default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  partner public.match_queue%rowtype;
  new_session_id uuid;
  my_row_id uuid;
begin
  delete from public.match_queue
  where user_id = p_user_id and status = 'waiting';

  select * into partner
  from public.match_queue
  where status = 'waiting'
    and mode = p_mode
    and user_id <> p_user_id
    and (
      p_mode = 'blind-echo'
      or (p_mode = 'echo-roulette' and frequency = p_frequency)
    )
  order by created_at asc
  limit 1
  for update skip locked;

  if found then
    new_session_id := gen_random_uuid();

    update public.match_queue
    set status = 'matched', session_id = new_session_id, is_initiator = true
    where id = partner.id;

    insert into public.match_queue (user_id, mode, frequency, status, session_id, is_initiator)
    values (p_user_id, p_mode, p_frequency, 'matched', new_session_id, false)
    returning id into my_row_id;

    return jsonb_build_object(
      'status', 'matched',
      'session_id', new_session_id,
      'is_initiator', false,
      'partner_id', partner.user_id
    );
  else
    insert into public.match_queue (user_id, mode, frequency, status)
    values (p_user_id, p_mode, p_frequency, 'waiting')
    returning id into my_row_id;

    return jsonb_build_object('status', 'waiting', 'queue_id', my_row_id);
  end if;
end;
$$;

grant execute on function public.try_match(text, text, numeric) to anon, authenticated;
