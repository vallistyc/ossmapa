insert into storage.buckets (id, name, public)
values ('leaders', 'leaders', true)
on conflict (id) do update set public = true;

drop policy if exists "Admins can upload leader images" on storage.objects;
drop policy if exists "Admins can update leader images" on storage.objects;
drop policy if exists "Admins can delete leader images" on storage.objects;

create policy "Admins can upload leader images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'leaders' and public.is_admin());

create policy "Admins can update leader images"
  on storage.objects for update to authenticated
  using (bucket_id = 'leaders' and public.is_admin())
  with check (bucket_id = 'leaders' and public.is_admin());

create policy "Admins can delete leader images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'leaders' and public.is_admin());
