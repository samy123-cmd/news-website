-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Articles Table
create table articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  content text,
  url text unique not null,
  source text,
  published_at timestamptz,
  image_url text,
  language text default 'en',
  category text,
  subcategory text,
  images text[],
  status text default 'published',
  created_at timestamptz default now()
);

-- Feeds Table
create table feeds (
  id uuid primary key default uuid_generate_v4(),
  url text unique not null,
  name text,
  category text,
  language text default 'en',
  active boolean default true,
  last_fetched_at timestamptz,
  created_at timestamptz default now()
);

-- User Preferences
create table user_preferences (
  user_id uuid primary key references auth.users(id),
  categories text[],
  languages text[],
  region text,
  created_at timestamptz default now()
);

-- RLS Policies
alter table articles enable row level security;
create policy "Public articles are viewable by everyone" on articles for select using (true);

alter table feeds enable row level security;
create policy "Public feeds are viewable by everyone" on feeds for select using (true);

alter table user_preferences enable row level security;
create policy "Users can view own preferences" on user_preferences for select using (auth.uid() = user_id);
create policy "Users can update own preferences" on user_preferences for update using (auth.uid() = user_id);
create policy "Users can insert own preferences" on user_preferences for insert with check (auth.uid() = user_id);
