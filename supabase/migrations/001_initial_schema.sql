create extension if not exists postgis;
create extension if not exists pgcrypto;

create type visibility_type as enum ('private', 'friends', 'public');
create type content_status as enum ('active', 'deleted', 'hidden');
create type media_type as enum ('photo', 'video');
create type avatar_type as enum ('initials', 'photo');
create type list_type as enum ('collected', 'suggested');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_type avatar_type not null default 'initials',
  avatar_initials text not null,
  avatar_color text not null default '#2E5BAD',
  profile_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spark_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_key text not null,
  color text not null,
  created_at timestamptz not null default now()
);

create table sparks (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  address_label text,
  latitude double precision not null,
  longitude double precision not null,
  geog geography(point, 4326) generated always as (st_setsrid(st_makepoint(longitude, latitude), 4326)::geography) stored,
  category_id uuid references spark_categories(id),
  visibility visibility_type not null default 'friends',
  status content_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table spark_media (
  id uuid primary key default gen_random_uuid(),
  spark_id uuid not null references sparks(id) on delete cascade,
  media_type media_type not null,
  url text not null,
  thumbnail_url text,
  muted_by_default boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table spark_tags (
  id uuid primary key default gen_random_uuid(),
  spark_id uuid not null references sparks(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now()
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  spark_id uuid not null references sparks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, spark_id)
);

create table spark_lists (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  list_type list_type not null default 'collected',
  visibility visibility_type not null default 'friends',
  status content_status not null default 'active',
  cover_spark_id uuid references sparks(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table spark_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references spark_lists(id) on delete cascade,
  spark_id uuid not null references sparks(id) on delete cascade,
  sort_order int not null default 0,
  note text,
  created_at timestamptz not null default now(),
  unique(list_id, spark_id)
);

create table guide_routes (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references spark_lists(id) on delete cascade,
  created_by uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  route_mode text not null default 'walk',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table guide_route_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references guide_routes(id) on delete cascade,
  spark_id uuid not null references sparks(id) on delete cascade,
  stop_order int not null,
  instruction text,
  created_at timestamptz not null default now()
);

create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(follower_id, following_id)
);

create table spark_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  suggested_spark_id uuid references sparks(id),
  reason text,
  created_at timestamptz not null default now()
);

create table deleted_content_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  content_type text not null,
  content_id uuid not null,
  replacement_spark_id uuid references sparks(id),
  message text,
  created_at timestamptz not null default now()
);

create index sparks_geog_idx on sparks using gist (geog);
create index sparks_created_by_idx on sparks (created_by);
create index sparks_visibility_idx on sparks (visibility);
create index sparks_category_id_idx on sparks (category_id);
create index sparks_deleted_at_idx on sparks (deleted_at);
create index sparks_title_search_idx on sparks using gin (to_tsvector('english', title || ' ' || coalesce(description, '')));
create index bookmarks_user_id_idx on bookmarks (user_id);
create index spark_list_items_list_id_idx on spark_list_items (list_id);
create index spark_tags_tag_idx on spark_tags (tag);

alter table profiles enable row level security;
alter table sparks enable row level security;
alter table spark_media enable row level security;
alter table spark_tags enable row level security;
alter table bookmarks enable row level security;
alter table spark_lists enable row level security;
alter table spark_list_items enable row level security;
alter table guide_routes enable row level security;
alter table guide_route_stops enable row level security;
alter table follows enable row level security;
alter table spark_suggestions enable row level security;
alter table deleted_content_events enable row level security;

create policy "public profiles are readable" on profiles for select using (true);
create policy "users update own profile" on profiles for update using (auth.uid() = user_id);
create policy "users insert own profile" on profiles for insert with check (auth.uid() = user_id);

create policy "read visible active sparks" on sparks for select using (
  status = 'active' and (visibility = 'public' or created_by in (select id from profiles where user_id = auth.uid()))
);
create policy "create own sparks" on sparks for insert with check (created_by in (select id from profiles where user_id = auth.uid()));
create policy "update own sparks" on sparks for update using (created_by in (select id from profiles where user_id = auth.uid()));

create policy "read spark media for readable sparks" on spark_media for select using (true);
create policy "read tags" on spark_tags for select using (true);
create policy "manage own bookmarks" on bookmarks for all using (user_id in (select id from profiles where user_id = auth.uid()));
create policy "read visible lists" on spark_lists for select using (status = 'active' and visibility = 'public');
create policy "manage own lists" on spark_lists for all using (created_by in (select id from profiles where user_id = auth.uid()));
