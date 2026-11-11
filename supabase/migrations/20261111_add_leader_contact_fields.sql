alter table public.leaders
  add column if not exists nis text;

update public.leaders
set nis = 'PENDING-' || id
where nis is null or nis = '';

alter table public.leaders
  alter column nis set not null;

alter table public.leaders
  add column if not exists whatsapp text,
  add column if not exists instagram text;
