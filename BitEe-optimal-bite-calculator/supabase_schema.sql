-- =========================================================================
-- BitEe: Optimal Bite Calculator - Supabase Database Schema
-- =========================================================================
-- Run this in your Supabase Project's SQL Editor (https://app.supabase.com)

-- 1. Create the sandwiches table
create table if not exists public.sandwiches (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  creator_name text default 'Anonymous Sandwich Engineer',
  efficiency numeric not null,
  bite_angle numeric not null,
  total_thickness numeric not null,
  flavor_lift numeric not null,
  layers jsonb not null,
  upvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create index for fast sorting & querying
create index if not exists idx_sandwiches_created_at on public.sandwiches (created_at desc);
create index if not exists idx_sandwiches_efficiency on public.sandwiches (efficiency desc);

-- 3. Enable Row Level Security (RLS)
alter table public.sandwiches enable row level security;

-- 4. Create Policies: Allow public read, insert, and upvoting
create policy "Allow public read access"
  on public.sandwiches
  for select
  using (true);

create policy "Allow public insert"
  on public.sandwiches
  for insert
  with check (true);

create policy "Allow public upvote updates"
  on public.sandwiches
  for update
  using (true)
  with check (true);

-- 5. Optional Seed Data: Initial Hall of Fame Airframes
insert into public.sandwiches (name, creator_name, efficiency, bite_angle, total_thickness, flavor_lift, upvotes, layers)
values
(
  'Triple Decker Aerofoil Sub',
  'AeroChef_99',
  96,
  15,
  48,
  131,
  42,
  '[
    {"id": "d1", "name": "Brioche Bun Top", "category": "Bread", "thickness": 12, "icon": "🍞"},
    {"id": "d2", "name": "Prime Angus Patty", "category": "Protein", "thickness": 15, "icon": "🥩"},
    {"id": "d3", "name": "Smoked Bacon (2x)", "category": "Protein", "thickness": 4, "icon": "🥓"},
    {"id": "d4", "name": "Sharp Cheddar", "category": "Cheese", "thickness": 5, "icon": "🧀"},
    {"id": "d5", "name": "Crisp Butter Lettuce", "category": "Vegetable", "thickness": 5, "icon": "🥬"},
    {"id": "d6", "name": "Special Burger Sauce", "category": "Sauce", "thickness": 2, "icon": "🥫"},
    {"id": "d7", "name": "Brioche Bun Heel", "category": "Bread", "thickness": 10, "icon": "🍞"}
  ]'::jsonb
),
(
  'The Quantum Sourdough',
  'Dr_Sandwich_PhD',
  91,
  15,
  52,
  124,
  28,
  '[
    {"id": "q1", "name": "Sourdough Slice", "category": "Bread", "thickness": 14, "icon": "🍞"},
    {"id": "q2", "name": "Fresh Avocado", "category": "Vegetable", "thickness": 7, "icon": "🥑"},
    {"id": "q3", "name": "Crispy Fried Chicken", "category": "Protein", "thickness": 16, "icon": "🍗"},
    {"id": "q4", "name": "Swiss Emmental", "category": "Cheese", "thickness": 4, "icon": "🧀"},
    {"id": "q5", "name": "Spicy Sriracha Mayo", "category": "Sauce", "thickness": 3, "icon": "🥫"},
    {"id": "q6", "name": "Sourdough Slice", "category": "Bread", "thickness": 8, "icon": "🍞"}
  ]'::jsonb
)
on conflict do nothing;
