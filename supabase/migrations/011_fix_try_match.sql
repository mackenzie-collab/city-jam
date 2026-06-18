-- Fix match pairing: tolerant frequency compare, idempotent re-queue

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
  freq numeric;
begin
  freq := case when p_frequency is null then null else round(p_frequency, 1) end;

  -- Clear any prior queue rows for this user so poll/subscribe stay consistent
  delete from public.match_queue where user_id = p_user_id;

  select * into partner
  from public.match_queue
  where status = 'waiting'
    and mode = p_mode
    and user_id <> p_user_id
    and (
      p_mode = 'blind-echo'
      or (
        p_mode = 'echo-roulette'
        and freq is not null
        and round(coalesce(frequency, 0), 1) = freq
      )
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
    values (p_user_id, p_mode, freq, 'matched', new_session_id, false)
    returning id into my_row_id;

    return jsonb_build_object(
      'status', 'matched',
      'session_id', new_session_id,
      'is_initiator', false,
      'partner_id', partner.user_id
    );
  else
    insert into public.match_queue (user_id, mode, frequency, status)
    values (p_user_id, p_mode, freq, 'waiting')
    returning id into my_row_id;

    return jsonb_build_object('status', 'waiting', 'queue_id', my_row_id);
  end if;
end;
$$;

grant execute on function public.try_match(text, text, numeric) to anon, authenticated;
