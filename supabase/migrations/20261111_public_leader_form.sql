drop policy if exists "Public can submit leader data" on public.leaders;
create policy "Public can submit leader data"
  on public.leaders for insert to anon
  with check (published = false);

insert into storage.buckets (id, name, public)
values ('leader-submissions', 'leader-submissions', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can upload leader submissions" on storage.objects;
create policy "Public can upload leader submissions"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'leader-submissions'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  );
