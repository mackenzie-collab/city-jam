-- Expand demo seed to 16 audio posts + 16 profiles (idempotent)

insert into public.audio_posts (id, user_id, title, caption, genre, audio_url, cover_url, play_count, like_count)
values
  (
    'a0000005-0000-4000-8000-000000000005'::uuid,
    'demo-user-5',
    'Crate Digger',
    'Dusty samples flipped on an SP-404.',
    'HIP-HOP',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    '/images/06_hiphop_producer.png',
    198,
    32
  ),
  (
    'a0000006-0000-4000-8000-000000000006'::uuid,
    'demo-user-6',
    'Porch Light',
    'Acoustic demo written on a back porch in Asheville.',
    'FOLK',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    '/images/08_folk_songwriter.png',
    54,
    19
  ),
  (
    'a0000007-0000-4000-8000-000000000007'::uuid,
    'demo-user-7',
    'Glass Cathedral',
    'Operatic vocal run-through, dry room.',
    'CLASSICAL',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    '/images/10_opera_singer.png',
    41,
    11
  ),
  (
    'a0000008-0000-4000-8000-000000000008'::uuid,
    'demo-user-8',
    'Duende Rising',
    'Flamenco guitar with hand percussion.',
    'WORLD',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    '/images/11_flamenco_guitarist.png',
    73,
    22
  ),
  (
    'a0000009-0000-4000-8000-000000000009'::uuid,
    'demo-user-9',
    'Brass Commute',
    'Horn section jam recorded on a subway platform.',
    'JAZZ',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    '/images/12_brass_ensemble.png',
    112,
    28
  ),
  (
    'a0000010-0000-4000-8000-000000000010'::uuid,
    'demo-user-10',
    '2AM Loops',
    'Bedroom producer session — no plan, just vibes.',
    'ELECTRONIC',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    '/images/13_bedroom_producer.png',
    301,
    47
  ),
  (
    'a0000011-0000-4000-8000-000000000011'::uuid,
    'demo-user-11',
    'Tabla Pulse',
    'Polyrhythmic tabla patterns over a drone.',
    'WORLD',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    '/images/14_tabla_player.png',
    88,
    16
  ),
  (
    'a0000012-0000-4000-8000-000000000012'::uuid,
    'demo-user-12',
    'Distortion Prayer',
    'Bass-heavy rock demo, live room mic.',
    'ROCK',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    '/images/15_rock_bassist.png',
    167,
    35
  ),
  (
    'a0000013-0000-4000-8000-000000000013'::uuid,
    'demo-user-13',
    'Mass in D Minor',
    'Choir rehearsal take — unfinished, raw.',
    'CLASSICAL',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    '/images/16_choir_conductor.png',
    29,
    8
  ),
  (
    'a0000014-0000-4000-8000-000000000014'::uuid,
    'demo-user-14',
    'Patch Bay Dreams',
    'Modular synth jam — no computer, all analog.',
    'ELECTRONIC',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    '/images/17_modular_synth.png',
    214,
    39
  ),
  (
    'a0000015-0000-4000-8000-000000000015'::uuid,
    'demo-user-15',
    'Quartet No. 7',
    'String quartet movement — first read-through.',
    'CLASSICAL',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    '/images/18_string_quartet.png',
    45,
    12
  ),
  (
    'a0000016-0000-4000-8000-000000000016'::uuid,
    'demo-user-16',
    'Frequency Shift',
    'Global jam session — musicians across three cities.',
    'ELECTRONIC',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    '/images/musician_jamming_global_v2.png',
    389,
    62
  )
on conflict (id) do nothing;

insert into public.user_profiles (user_id, display_name, username, genre, city, bio, manifesto_quote, role, cover_image_url)
values
  ('demo-user-4', 'Aria Volkov', 'ariavolkov', 'CLASSICAL', 'Vienna', 'Violinist. Rehearsal hall regular.', 'Precision is rebellion.', 'STRINGS', '/images/04_classical_violinist.png'),
  ('demo-user-5', 'Low End Theory', 'lowendtheory', 'HIP-HOP', 'Detroit', 'Sample digger. MPC purist.', 'Dust is data.', 'PRODUCER', '/images/06_hiphop_producer.png'),
  ('demo-user-6', 'Meadow Lark', 'meadowlark', 'FOLK', 'Asheville', 'Songwriter. Porch sessions only.', 'Quiet rooms, loud truths.', 'VOCALS', '/images/08_folk_songwriter.png'),
  ('demo-user-7', 'Soprano Null', 'soprano_null', 'CLASSICAL', 'Milan', 'Opera singer. Dry room recordings.', 'Voice without vanity.', 'VOCALS', '/images/10_opera_singer.png'),
  ('demo-user-8', 'Carmen Reyes', 'carmenreyes', 'WORLD', 'Seville', 'Flamenco guitarist. Duende chaser.', 'Fire in the fingers.', 'GUITAR', '/images/11_flamenco_guitarist.png'),
  ('demo-user-9', 'Section Eight', 'sectioneight', 'JAZZ', 'Chicago', 'Brass section. Subway platform jams.', 'Horns up, ego down.', 'BRASS', '/images/12_brass_ensemble.png'),
  ('demo-user-10', 'Sleepwalker', 'sleepwalker', 'ELECTRONIC', 'Tokyo', 'Bedroom producer. 2AM sessions.', 'Loops until dawn.', 'PRODUCER', '/images/13_bedroom_producer.png'),
  ('demo-user-11', 'Dev Sharma', 'devsharma', 'WORLD', 'Mumbai', 'Tabla player. Polyrhythm obsessive.', 'Every beat has a name.', 'PERCUSSION', '/images/14_tabla_player.png'),
  ('demo-user-12', 'Static Saint', 'staticsaint', 'ROCK', 'Portland', 'Bassist. Distortion as prayer.', 'Volume is honesty.', 'BASS', '/images/15_rock_bassist.png'),
  ('demo-user-13', 'The Collective', 'thecollective', 'CLASSICAL', 'London', 'Choir conductor. Unfinished is fine.', 'Many voices, one signal.', 'VOCALS', '/images/16_choir_conductor.png'),
  ('demo-user-14', 'Volt Crawler', 'voltcrawler', 'ELECTRONIC', 'Amsterdam', 'Modular synth. No computer.', 'Patch until it screams.', 'PRODUCER', '/images/17_modular_synth.png'),
  ('demo-user-15', 'East River Strings', 'eastriverstrings', 'CLASSICAL', 'New York', 'String quartet. First read-throughs only.', 'Four bows, one breath.', 'STRINGS', '/images/18_string_quartet.png'),
  ('demo-user-16', 'Global Jam', 'globaljam', 'ELECTRONIC', 'Remote', 'Cross-city sessions. Musicians worldwide.', 'Distance is just latency.', 'PRODUCER', '/images/musician_jamming_global_v2.png')
on conflict (user_id) do update set
  display_name = excluded.display_name,
  username = coalesce(public.user_profiles.username, excluded.username),
  genre = excluded.genre,
  city = excluded.city,
  bio = excluded.bio,
  manifesto_quote = excluded.manifesto_quote,
  role = excluded.role,
  cover_image_url = coalesce(nullif(public.user_profiles.cover_image_url, ''), excluded.cover_image_url);
