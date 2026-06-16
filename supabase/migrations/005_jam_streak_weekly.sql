-- City Jam v5: weekly Jam Streak fields and badge tracking

alter table public.jam_streaks
  add column if not exists current_week_streak int not null default 0,
  add column if not exists longest_week_streak int not null default 0,
  add column if not exists last_active_week text,
  add column if not exists weekly_activities jsonb not null default '{}'::jsonb,
  add column if not exists earned_badges jsonb not null default '[]'::jsonb;

create index if not exists jam_streaks_week_idx
  on public.jam_streaks (current_week_streak desc);
