-- Migration to create or recreate the orders table with correct schema

drop table if exists orders cascade;

create table orders (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid not null,
  items jsonb not null,
  total numeric not null,
  status text check (status in ('pending', 'approved', 'delivered')) not null default 'pending',
  date timestamp with time zone not null default now()
);

create index idx_orders_userId on orders("userId");
