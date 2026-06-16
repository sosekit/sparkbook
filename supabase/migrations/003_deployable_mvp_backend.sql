create extension if not exists postgis;
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'guide_session_status') then
    create type guide_session_status as enum ('not_started', 'active', 'completed', 'exited');
  end if;
  if not exists (select 1 from pg_type where typname = 'guide_stop_status') then
    create type guide_stop_status as enum ('upcoming', 'current', 'completed');
  end if;
exception
  when duplicate_object then null;
end $$;

alter table profiles add column if not exists bio text;
alter table profiles add column if not exists avatar_initials text;
alter table profiles add column if not exists avatar_color text default '#2E5BAD';
alter table profiles add column if not exists profile_photo_url text;

alter table spark_categories add column if not exists label text;
alter table spark_categories add column if not exists hashtag text;
update spark_categories set label = coalesce(label, name), hashtag = coalesce(hashtag, lower(regexp_replace(coalesce(name, icon_key), '\s+', '', 'g')));

insert into spark_categories (name, icon_key, color, label, hashtag)
values
  ('Custom', 'custom', '#2E5BAD', 'Custom', 'custom'),
  ('Food', 'food', '#2E5BAD', 'Food', 'food'),
  ('Coffee', 'coffee', '#7BA3E0', 'Coffee', 'coffee'),
  ('Study', 'study', '#4E6585', 'Study', 'study'),
  ('Outdoors', 'outdoors', '#4C7D93', 'Outdoors', 'outdoors'),
  ('Art', 'art', '#2E5BAD', 'Art', 'art'),
  ('Landmark', 'landmark', '#4E6585', 'Landmark', 'landmark')
on conflict do nothing;

alter table sparks add column if not exists caption text;
alter table sparks add column if not exists reflection_note text;
alter table sparks add column if not exists audience visibility_type not null default 'public';
alter table sparks add column if not exists want_to_revisit boolean not null default false;
alter table sparks add column if not exists is_bookmarked boolean not null default false;
alter table sparks add column if not exists revisit_count int not null default 0;
alter table sparks add column if not exists last_visited_at timestamptz;
alter table sparks add column if not exists revisit_note text;

alter table spark_media add column if not exists local_uri text;

alter table spark_lists add column if not exists audience visibility_type not null default 'public';
alter table spark_lists add column if not exists thumbnail_url text;
alter table spark_lists add column if not exists thumbnail_icon_key text;

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('spark', 'list')),
  target_id uuid not null,
  user_id uuid references profiles(id) on delete set null,
  user_name text,
  user_initials text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table if not exists guide_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  list_id uuid references spark_lists(id) on delete cascade,
  current_index integer not null default 0,
  status guide_session_status not null default 'active',
  started_at timestamptz default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists guide_session_stops (
  id uuid primary key default gen_random_uuid(),
  guide_session_id uuid references guide_sessions(id) on delete cascade,
  spark_id uuid references sparks(id) on delete cascade,
  stop_order integer not null,
  status guide_stop_status not null default 'upcoming',
  arrived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists revisit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  spark_id uuid references sparks(id) on delete cascade,
  note text,
  visited_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists sparks_geog_idx on sparks using gist (geog);
create index if not exists sparks_category_id_idx on sparks (category_id);
create index if not exists sparks_created_by_idx on sparks (created_by);
create index if not exists sparks_status_idx on sparks (status);
create index if not exists spark_list_items_list_order_idx on spark_list_items (list_id, sort_order);
create index if not exists bookmarks_user_id_idx on bookmarks (user_id);
create index if not exists comments_target_idx on comments (target_type, target_id);
create index if not exists guide_sessions_user_list_idx on guide_sessions (user_id, list_id);
create index if not exists revisit_events_user_spark_idx on revisit_events (user_id, spark_id);

alter table comments enable row level security;
alter table guide_sessions enable row level security;
alter table guide_session_stops enable row level security;
alter table revisit_events enable row level security;

drop policy if exists "read active comments" on comments;
create policy "read active comments" on comments for select using (deleted_at is null);
drop policy if exists "create own comments" on comments;
create policy "create own comments" on comments for insert with check (true);
drop policy if exists "soft delete own comments" on comments;
create policy "soft delete own comments" on comments for update using (true);

drop policy if exists "manage own guide sessions" on guide_sessions;
create policy "manage own guide sessions" on guide_sessions for all using (user_id in (select id from profiles where user_id = auth.uid())) with check (user_id in (select id from profiles where user_id = auth.uid()));
drop policy if exists "manage own guide stops" on guide_session_stops;
create policy "manage own guide stops" on guide_session_stops for all using (guide_session_id in (select id from guide_sessions where user_id in (select id from profiles where user_id = auth.uid())));
drop policy if exists "manage own revisit events" on revisit_events;
create policy "manage own revisit events" on revisit_events for all using (user_id in (select id from profiles where user_id = auth.uid())) with check (user_id in (select id from profiles where user_id = auth.uid()));

create or replace function get_nearby_sparks(lat double precision, lng double precision, radius_meters integer default 3000)
returns table (
  id uuid,
  title text,
  description text,
  address_label text,
  latitude double precision,
  longitude double precision,
  category_id uuid,
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

create or replace function search_sparks(query text)
returns setof sparks
language sql
stable
as $$
  select *
  from sparks
  where status = 'active'
    and (
      title ilike '%' || query || '%'
      or coalesce(description, '') ilike '%' || query || '%'
      or coalesce(address_label, '') ilike '%' || query || '%'
    )
  order by created_at desc
  limit 40;
$$;

create or replace function add_spark_to_list(p_list_id uuid, p_spark_id uuid)
returns spark_list_items
language plpgsql
security definer
as $$
declare
  next_order integer;
  inserted spark_list_items;
begin
  select coalesce(max(sort_order), -1) + 1 into next_order from spark_list_items where list_id = p_list_id;
  insert into spark_list_items (list_id, spark_id, sort_order)
  values (p_list_id, p_spark_id, next_order)
  on conflict (list_id, spark_id) do update set sort_order = excluded.sort_order
  returning * into inserted;
  return inserted;
end;
$$;

create or replace function toggle_bookmark(p_user_id uuid, p_spark_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  exists_bookmark boolean;
begin
  select exists(select 1 from bookmarks where user_id = p_user_id and spark_id = p_spark_id) into exists_bookmark;
  if exists_bookmark then
    delete from bookmarks where user_id = p_user_id and spark_id = p_spark_id;
    update sparks set is_bookmarked = false, want_to_revisit = false where id = p_spark_id;
    return false;
  end if;
  insert into bookmarks (user_id, spark_id) values (p_user_id, p_spark_id) on conflict do nothing;
  update sparks set is_bookmarked = true, want_to_revisit = true where id = p_spark_id;
  return true;
end;
$$;

create or replace function start_guide_session(p_user_id uuid, p_list_id uuid)
returns guide_sessions
language plpgsql
security definer
as $$
declare
  session guide_sessions;
begin
  insert into guide_sessions (user_id, list_id, current_index, status, started_at, updated_at)
  values (p_user_id, p_list_id, 0, 'active', now(), now())
  returning * into session;

  insert into guide_session_stops (guide_session_id, spark_id, stop_order, status)
  select session.id, item.spark_id, item.sort_order,
    case when item.sort_order = 0 then 'current'::guide_stop_status else 'upcoming'::guide_stop_status end
  from spark_list_items item
  where item.list_id = p_list_id
  order by item.sort_order;

  return session;
end;
$$;
