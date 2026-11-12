alter table public.achievements
  add column if not exists nis text,
  add column if not exists whatsapp text,
  add column if not exists type text,
  add column if not exists result text,
  add column if not exists proof_url text;

insert into storage.buckets (id, name, public)
values ('achievement-submissions', 'achievement-submissions', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can upload achievement submissions" on storage.objects;
create policy "Public can upload achievement submissions"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'achievement-submissions'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'pdf')
  );
