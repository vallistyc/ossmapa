alter table public.programs
  add column if not exists status text not null default 'Belum dimulai';

alter table public.programs
  drop constraint if exists programs_status_check;

alter table public.programs
  add constraint programs_status_check
  check (status in ('Belum dimulai', 'Sedang berlangsung', 'Selesai', 'Ditunda', 'Dibatalkan'));
