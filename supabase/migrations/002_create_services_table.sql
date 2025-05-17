-- Migration to create services table
create extension if not exists "pgcrypto";

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  features text[] not null default '{}',
  price numeric not null,
  icon text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
