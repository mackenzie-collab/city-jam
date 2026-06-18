-- Realtime for match queue and session decisions (fixes waiter never seeing match)
do $$
begin
  alter publication supabase_realtime add table public.match_queue;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.session_decisions;
exception when duplicate_object then null;
end $$;

-- Faster echo-roulette queue lookup by frequency
create index if not exists match_queue_echo_freq_idx
  on public.match_queue (mode, frequency, created_at)
  where status = 'waiting';
