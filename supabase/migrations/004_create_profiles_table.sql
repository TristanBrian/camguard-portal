-- Migration to create profiles table for user profile details
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  phone text,
  address text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
