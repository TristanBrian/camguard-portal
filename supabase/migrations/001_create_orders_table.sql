-- Migration to create or recreate the orders table with correct schema

drop table if exists orders cascade;

create table orders (
  id uuid default gen_random_uuid() primary key,
  store_id uuid not null references stores(id) on delete cascade,
  user_id uuid references customers(id) on delete set null,
  order_number varchar(50) not null,
  status varchar(20) not null check (status in ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  payment_method varchar(50),
  payment_status varchar(20) not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_number_unique unique (store_id, order_number)
);

create index idx_orders_store_id on orders(store_id);
