insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Admins can upload blog images" on storage.objects;
drop policy if exists "Admins can update blog images" on storage.objects;
drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can upload blog images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images' and public.is_admin());
create policy "Admins can update blog images"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());
create policy "Admins can delete blog images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());
