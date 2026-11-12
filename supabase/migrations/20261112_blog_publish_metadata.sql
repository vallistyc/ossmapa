alter table public.blog_posts
  alter column published_at drop not null,
  alter column published_at drop default;
