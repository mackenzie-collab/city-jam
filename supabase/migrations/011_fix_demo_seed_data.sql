-- Fix Night Operator mis-seeded folk track and backfill demo profile cover art

update public.audio_posts
set
  user_id = 'demo-user-4',
  title = 'Violin Breakdown',
  caption = 'Solo étude recorded in one take, no edits.',
  genre = 'CLASSICAL',
  cover_url = '/images/04_classical_violinist.png'
where id = 'a0000004-0000-4000-8000-000000000004'::uuid
  and user_id = 'demo-user-1'
  and genre = 'FOLK';

update public.user_profiles
set cover_image_url = v.cover_image_url
from (values
  ('demo-user-1', '/images/09_electronic_dj.png'),
  ('demo-user-2', '/images/07_jazz_pianist.png'),
  ('demo-user-3', '/images/05_beatboxer.png'),
  ('demo-user-4', '/images/04_classical_violinist.png'),
  ('demo-user-5', '/images/06_hiphop_producer.png'),
  ('demo-user-6', '/images/08_folk_songwriter.png')
) as v(user_id, cover_image_url)
where public.user_profiles.user_id = v.user_id
  and (public.user_profiles.cover_image_url is null or public.user_profiles.cover_image_url = '');
