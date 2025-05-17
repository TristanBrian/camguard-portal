-- Create orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  userId uuid not null,
  items jsonb not null,
  total numeric not null,
  status text check (status in ('pending', 'approved', 'delivered')) not null default 'pending',
  date timestamp with time zone not null default now()
);

-- Create admin_notifications table
create table if not exists admin_notifications (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  order_id uuid references orders(id) on delete set null,
  read boolean not null default false,
  timestamp timestamp with time zone not null default now()
);

-- Create index on orders.userId for faster queries
create index if not exists idx_orders_userId on orders(userId);

-- Create index on admin_notifications.order_id for faster lookups
create index if not exists idx_admin_notifications_order_id on admin_notifications(order_id);
