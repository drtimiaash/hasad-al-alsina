-- =====================================================
-- Supabase SQL Migration for حصاد الألسنة (Safe Version)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- 1. Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default '',
  email text,
  created_at timestamptz default now()
);

-- 2. Accounting Entries
create table if not exists accounting_entries (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  sins jsonb not null default '{}',
  note text default '',
  score integer default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- 3. Challenge Completions
create table if not exists challenge_completions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  challenge_ids jsonb not null default '[]',
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- 4. Daily Challenge Acceptances
create table if not exists daily_challenge_acceptances (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- =====================================================
-- Row Level Security (RLS) — Idempotent Setup
-- =====================================================

-- Enable RLS (safe to run multiple times)
alter table profiles enable row level security;
alter table accounting_entries enable row level security;
alter table challenge_completions enable row level security;
alter table daily_challenge_acceptances enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;

drop policy if exists "Users can view own accounting" on accounting_entries;
drop policy if exists "Users can insert own accounting" on accounting_entries;
drop policy if exists "Users can update own accounting" on accounting_entries;
drop policy if exists "Users can delete own accounting" on accounting_entries;

drop policy if exists "Users can view own challenges" on challenge_completions;
drop policy if exists "Users can insert own challenges" on challenge_completions;
drop policy if exists "Users can update own challenges" on challenge_completions;
drop policy if exists "Users can delete own challenges" on challenge_completions;

drop policy if exists "Users can view own acceptances" on daily_challenge_acceptances;
drop policy if exists "Users can insert own acceptances" on daily_challenge_acceptances;
drop policy if exists "Users can update own acceptances" on daily_challenge_acceptances;
drop policy if exists "Users can delete own acceptances" on daily_challenge_acceptances;

-- Re-create policies

-- Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Accounting Entries
create policy "Users can view own accounting" on accounting_entries for select using (auth.uid() = user_id);
create policy "Users can insert own accounting" on accounting_entries for insert with check (auth.uid() = user_id);
create policy "Users can update own accounting" on accounting_entries for update using (auth.uid() = user_id);
create policy "Users can delete own accounting" on accounting_entries for delete using (auth.uid() = user_id);

-- Challenge Completions
create policy "Users can view own challenges" on challenge_completions for select using (auth.uid() = user_id);
create policy "Users can insert own challenges" on challenge_completions for insert with check (auth.uid() = user_id);
create policy "Users can update own challenges" on challenge_completions for update using (auth.uid() = user_id);
create policy "Users can delete own challenges" on challenge_completions for delete using (auth.uid() = user_id);

-- Daily Challenge Acceptances
create policy "Users can view own acceptances" on daily_challenge_acceptances for select using (auth.uid() = user_id);
create policy "Users can insert own acceptances" on daily_challenge_acceptances for insert with check (auth.uid() = user_id);
create policy "Users can update own acceptances" on daily_challenge_acceptances for update using (auth.uid() = user_id);
create policy "Users can delete own acceptances" on daily_challenge_acceptances for delete using (auth.uid() = user_id);
