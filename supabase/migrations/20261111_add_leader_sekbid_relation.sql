alter table public.leaders
  add column if not exists sekbid_id bigint references public.sekbids(id) on delete restrict;
