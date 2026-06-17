alter table if exists profiles
  add column if not exists interests text[] default '{}',
  add column if not exists onboarding_completed boolean default false;

create table if not exists follows (
  follower_id text not null,
  following_id text not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

create index if not exists follows_follower_id_idx on follows (follower_id);
create index if not exists follows_following_id_idx on follows (following_id);
