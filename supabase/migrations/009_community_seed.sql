-- Seed demo scene posts so /community isn't empty on first visit.
-- Idempotent: only inserts when fewer than 5 posts exist.

insert into public.community_posts (user_id, display_name, kind, title, body, created_at)
select v.user_id, v.display_name, v.kind, v.title, v.body, v.created_at
from (
  values
    ('scene-seed-01', 'Maya Keys', 'post', '', 'Just finished a rough mix on my neo-soul track. Looking for a horn player in Brooklyn.', now() - interval '2 hours'),
    ('scene-seed-02', 'DJ Orbit', 'jam', '3-week Jam Streak', 'Stayed active on City Jam. Blind Echo sessions every week — who wants to spin next?', now() - interval '5 hours'),
    ('scene-seed-03', 'Rio Vox', 'milestone', 'Status update', 'Writing lyrics tonight — open to collab on hooks and harmonies.', now() - interval '8 hours'),
    ('scene-seed-04', 'The Loft Crew', 'post', '', 'Hosting a listening room Friday 8pm EST. Dropping unreleased demos — pull up.', now() - interval '1 day'),
    ('scene-seed-05', 'Sable Drums', 'post', '', 'Need a bassist for a 4-track EP. Lo-fi indie, remote OK. DM via Project Match.', now() - interval '2 days'),
    ('scene-seed-06', 'Night Signal', 'project', 'New project: Midnight Transit', 'Started a new track on City Jam — dark synthwave with live guitar.', now() - interval '3 days')
) as v(user_id, display_name, kind, title, body, created_at)
where (select count(*) from public.community_posts) < 5;
