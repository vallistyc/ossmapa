alter table public.leaders
  add column if not exists class_name text,
  add column if not exists motto text;

update public.leaders
set class_name = coalesce(nullif(class_name, ''), 'Belum diisi'),
    motto = coalesce(motto, '');

alter table public.leaders
  alter column class_name set not null,
  alter column motto set not null;

alter table public.leaders
  drop column if exists nis,
  drop column if exists whatsapp;
