create extension if not exists "pgcrypto";

create table if not exists public.exhibitions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  venue text not null,
  starts_at date not null,
  ends_at date not null,
  viewing_hours text not null default '10:00 - 18:00',
  visitor_notice text not null default '작품 앞에서 잠시 머물며 천천히 감상해주세요.',
  hero_image_url text not null,
  introduction text not null,
  curator_note text not null,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section_id uuid references public.sections(id) on delete set null,
  artist_name text not null,
  year integer not null,
  medium text,
  dimensions text,
  location text,
  image_url text not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artwork_translations (
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  locale text not null,
  title text not null,
  summary text,
  body text not null,
  artist_note text,
  primary key (artwork_id, locale),
  constraint artwork_translations_locale_check check (locale in ('ko'))
);

create index if not exists artworks_public_order_idx
  on public.artworks (is_published, display_order, slug);

create index if not exists exhibitions_public_created_idx
  on public.exhibitions (is_published, created_at);

create index if not exists sections_display_order_idx
  on public.sections (display_order, title);

alter table public.exhibitions enable row level security;
alter table public.sections enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_translations enable row level security;

create policy "Published exhibitions are readable by everyone"
  on public.exhibitions
  for select
  using (is_published or auth.role() = 'authenticated');

create policy "Authenticated users can insert exhibitions"
  on public.exhibitions
  for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Authenticated users can update exhibitions"
  on public.exhibitions
  for update
  to authenticated
  using (true)
  with check (auth.uid() = updated_by);

create policy "Sections are readable by everyone"
  on public.sections
  for select
  using (true);

create policy "Authenticated users can manage sections"
  on public.sections
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Published artworks are readable by everyone"
  on public.artworks
  for select
  using (is_published or auth.role() = 'authenticated');

create policy "Translations follow artwork visibility"
  on public.artwork_translations
  for select
  using (
    exists (
      select 1
      from public.artworks
      where artworks.id = artwork_translations.artwork_id
        and (artworks.is_published or auth.role() = 'authenticated')
    )
  );

create policy "Authenticated users can insert artworks"
  on public.artworks
  for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Authenticated users can update artworks"
  on public.artworks
  for update
  to authenticated
  using (true)
  with check (auth.uid() = updated_by);

create policy "Authenticated users can manage translations"
  on public.artwork_translations
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('artwork-images', 'artwork-images', true)
on conflict (id) do nothing;

create policy "Artwork images are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'artwork-images');

create policy "Authenticated users can upload artwork images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'artwork-images');

create policy "Authenticated users can update artwork images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'artwork-images')
  with check (bucket_id = 'artwork-images');
