insert into storage.buckets (id, name, public)
values ('spark-media', 'spark-media', false), ('profile-media', 'profile-media', false)
on conflict (id) do nothing;

create policy "authenticated users upload spark media"
on storage.objects for insert
to authenticated
with check (bucket_id in ('spark-media', 'profile-media'));

create policy "authenticated users read media"
on storage.objects for select
to authenticated
using (bucket_id in ('spark-media', 'profile-media'));
