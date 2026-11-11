drop policy if exists "Public can submit program proposals" on public.programs;
create policy "Public can submit program proposals"
  on public.programs for insert to anon
  with check (published = false);
