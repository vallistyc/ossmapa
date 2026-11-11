alter table public.blog_posts
  add column if not exists slug text,
  add column if not exists excerpt text not null default '',
  add column if not exists content_html text not null default '',
  add column if not exists author_name text not null default 'OSSMAPA';

update public.blog_posts
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

with duplicates as (
  select id, slug, row_number() over (partition by slug order by id) as duplicate_number
  from public.blog_posts
)
update public.blog_posts
set slug = duplicates.slug || '-' || duplicates.duplicate_number
from duplicates
where public.blog_posts.id = duplicates.id
  and duplicates.duplicate_number > 1;

alter table public.blog_posts
  alter column slug set not null;

create unique index if not exists blog_posts_slug_key on public.blog_posts(slug);
