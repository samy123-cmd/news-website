
-- Create newsletter subscribers table
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' check (status in ('active', 'unsubscribed'))
);

-- Enable RLS
alter table newsletter_subscribers enable row level security;

-- Allow public insert (for signups)
create policy "Allow public insert to newsletter"
  on newsletter_subscribers for insert
  with check (true);

-- Only admins can view (mock policy for now)
create policy "Allow admin view"
  on newsletter_subscribers for select
  using (false); 
