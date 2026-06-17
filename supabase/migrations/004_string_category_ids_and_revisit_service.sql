create extension if not exists postgis;
create extension if not exists pgcrypto;

alter table sparks drop constraint if exists sparks_category_id_fkey;

alter table spark_categories alter column id drop default;
alter table spark_categories alter column id type text using coalesce(icon_key, id::text);
alter table sparks alter column category_id type text using category_id::text;

insert into spark_categories (id, name, icon_key, color, label, hashtag)
values
  ('food', 'Food', 'food', '#2E5BAD', 'Food', 'food'),
  ('coffee', 'Coffee', 'coffee', '#7BA3E0', 'Coffee', 'coffee'),
  ('dessert', 'Dessert', 'dessert', '#4E6585', 'Dessert', 'dessert'),
  ('study', 'Study', 'study', '#4E6585', 'Study', 'study'),
  ('outdoors', 'Outdoors', 'outdoors', '#7BA3E0', 'Outdoors', 'outdoors'),
  ('shopping', 'Shopping', 'shopping', '#2E5BAD', 'Shopping', 'shopping'),
  ('nightlife', 'Nightlife', 'nightlife', '#0F1A2E', 'Nightlife', 'nightlife'),
  ('art', 'Arts', 'art', '#7BA3E0', 'Arts', 'art'),
  ('hidden', 'Hidden gem', 'hidden', '#2E5BAD', 'Hidden gem', 'hidden'),
  ('landmark', 'Landmark', 'landmark', '#7BA3E0', 'Landmark', 'landmark'),
  ('custom', 'Custom', 'custom', '#4E6585', 'Custom', 'custom')
on conflict (id) do update set
  name = excluded.name,
  icon_key = excluded.icon_key,
  color = excluded.color,
  label = excluded.label,
  hashtag = excluded.hashtag;

update sparks
set category_id = 'custom'
where category_id is null
   or category_id not in (select id from spark_categories);

alter table sparks
  add constraint sparks_category_id_fkey
  foreign key (category_id)
  references spark_categories(id);

create index if not exists sparks_category_id_idx on sparks (category_id);

create or replace function get_nearby_sparks(lat double precision, lng double precision, radius_meters integer default 3000)
returns table (
  id uuid,
  title text,
  description text,
  address_label text,
  latitude double precision,
  longitude double precision,
  category_id text,
  distance_meters double precision
)
language sql
stable
as $$
  select s.id, s.title, s.description, s.address_label, s.latitude, s.longitude, s.category_id,
    st_distance(s.geog, st_setsrid(st_makepoint(lng, lat), 4326)::geography) as distance_meters
  from sparks s
  where s.status = 'active'
    and st_dwithin(s.geog, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_meters)
  order by distance_meters asc;
$$;
