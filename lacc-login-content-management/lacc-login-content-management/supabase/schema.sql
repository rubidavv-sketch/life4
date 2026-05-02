-- Run this in Supabase SQL Editor

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  category text not null default 'Science',
  tags text[] not null default '{}',
  linkedin_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_slug_idx on public.articles(slug);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_articles_updated_at on public.articles;

create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.admins enable row level security;
alter table public.articles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid()
  );
$$;

drop policy if exists "Admins can read own row" on public.admins;
create policy "Admins can read own row"
on public.admins
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all articles" on public.articles;
create policy "Admins can read all articles"
on public.articles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert articles" on public.articles;
create policy "Admins can insert articles"
on public.articles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update articles" on public.articles;
create policy "Admins can update articles"
on public.articles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete articles" on public.articles;
create policy "Admins can delete articles"
on public.articles
for delete
to authenticated
using (public.is_admin());

-- After creating your user in Supabase Auth, run:
-- insert into public.admins (user_id) values ('PASTE-YOUR-AUTH-USER-UUID-HERE');
