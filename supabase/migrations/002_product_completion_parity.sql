alter table sparks add column if not exists caption text;
alter table sparks add column if not exists reflection_note text;
alter table sparks add column if not exists audience visibility_type not null default 'public';
alter table sparks add column if not exists want_to_revisit boolean not null default false;
alter table sparks add column if not exists is_bookmarked boolean not null default false;
alter table sparks add column if not exists revisit_count int not null default 0;
alter table sparks add column if not exists last_visited_at timestamptz;
alter table sparks add column if not exists revisit_note text;

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

create table if not exists revisit_events (
  id uuid primary key default gen_random_uuid(),
  spark_id uuid not null references sparks(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  note text,
  visited_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists comments_target_idx on comments (target_type, target_id);
create index if not exists comments_deleted_at_idx on comments (deleted_at);
create index if not exists revisit_events_spark_id_idx on revisit_events (spark_id);

alter table comments enable row level security;
alter table revisit_events enable row level security;

create policy "read active comments" on comments for select using (deleted_at is null);
create policy "create own comments" on comments for insert with check (true);
create policy "soft delete own comments" on comments for update using (true);

create policy "read own readable revisit events" on revisit_events for select using (true);
create policy "create revisit events" on revisit_events for insert with check (true);
