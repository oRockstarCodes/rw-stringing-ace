-- RW Stringing Ace CRM schema
-- Run in Supabase SQL Editor after creating a project.

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type public.staff_role as enum ('admin', 'stringer', 'viewer');
create type public.order_status as enum (
  'received',
  'in_progress',
  'ready',
  'picked_up',
  'cancelled'
);
create type public.inventory_category as enum ('string', 'grip', 'grommet', 'other');
create type public.inventory_unit as enum ('reel', 'set', 'each');
create type public.movement_reason as enum ('purchase', 'job_use', 'adjustment', 'return');
create type public.inquiry_status as enum ('new', 'contacted', 'converted', 'closed');

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.staff_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Customers
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  is_phoenix_team boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_name_idx on public.customers (name);
create index customers_email_idx on public.customers (email);

-- Inventory
create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  brand text,
  category public.inventory_category not null default 'string',
  unit public.inventory_unit not null default 'set',
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  reorder_level integer not null default 5 check (reorder_level >= 0),
  unit_cost_cents integer not null default 0 check (unit_cost_cents >= 0),
  sell_price_cents integer not null default 0 check (sell_price_cents >= 0),
  team_price_cents integer not null default 0 check (team_price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inventory_items_category_idx on public.inventory_items (category);
create index inventory_items_active_idx on public.inventory_items (active);

-- Orders / jobs
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete restrict,
  status public.order_status not null default 'received',
  racket_model text,
  inventory_item_id uuid references public.inventory_items (id) on delete set null,
  string_brand text,
  string_model text,
  tension_mains numeric(4, 1),
  tension_crosses numeric(4, 1),
  hybrid_notes text,
  include_grip boolean not null default false,
  include_grommet boolean not null default false,
  price_cents integer not null default 0 check (price_cents >= 0),
  is_team_price boolean not null default false,
  assigned_to uuid references public.profiles (id) on delete set null,
  due_at timestamptz,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on public.orders (status);
create index orders_customer_idx on public.orders (customer_id);
create index orders_due_at_idx on public.orders (due_at);
create index orders_assigned_to_idx on public.orders (assigned_to);

-- Inventory movements
create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items (id) on delete cascade,
  delta integer not null,
  reason public.movement_reason not null,
  order_id uuid references public.orders (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index inventory_movements_item_idx on public.inventory_movements (item_id);
create index inventory_movements_order_idx on public.inventory_movements (order_id);

-- Public contact inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  status public.inquiry_status not null default 'new',
  customer_id uuid references public.customers (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_status_idx on public.inquiries (status);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger customers_updated_at before update on public.customers
  for each row execute function public.set_updated_at();
create trigger inventory_items_updated_at before update on public.inventory_items
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger inquiries_updated_at before update on public.inquiries
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), ''),
    'viewer'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers (security definer to avoid RLS recursion)
create or replace function public.current_role()
returns public.staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.can_write_ops()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'stringer')
  );
$$;

-- Apply inventory movement and update quantity atomically
create or replace function public.apply_inventory_movement(
  p_item_id uuid,
  p_delta integer,
  p_reason public.movement_reason,
  p_order_id uuid default null,
  p_note text default null
)
returns public.inventory_movements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_qty integer;
  v_row public.inventory_movements;
begin
  if not public.can_write_ops() then
    raise exception 'Not authorized';
  end if;

  select quantity_on_hand into v_qty
  from public.inventory_items
  where id = p_item_id
  for update;

  if not found then
    raise exception 'Inventory item not found';
  end if;

  if v_qty + p_delta < 0 then
    raise exception 'Insufficient stock';
  end if;

  update public.inventory_items
  set quantity_on_hand = quantity_on_hand + p_delta
  where id = p_item_id;

  insert into public.inventory_movements (item_id, delta, reason, order_id, created_by, note)
  values (p_item_id, p_delta, p_reason, p_order_id, auth.uid(), p_note)
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function public.apply_inventory_movement(uuid, integer, public.movement_reason, uuid, text) to authenticated;
grant execute on function public.current_role() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.can_write_ops() to authenticated;

-- When order becomes ready/picked_up, consume 1 set of string if linked and not yet consumed
create or replace function public.consume_stock_on_order_complete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.inventory_item_id is null then
    return new;
  end if;

  if new.status in ('ready', 'picked_up')
     and old.status not in ('ready', 'picked_up') then
    if not exists (
      select 1 from public.inventory_movements
      where order_id = new.id and reason = 'job_use'
    ) then
      perform public.apply_inventory_movement(
        new.inventory_item_id,
        -1,
        'job_use',
        new.id,
        'Auto-consumed on job completion'
      );
    end if;
    if new.completed_at is null then
      new.completed_at = now();
    end if;
  end if;

  return new;
end;
$$;

create trigger orders_consume_stock
  before update of status on public.orders
  for each row execute function public.consume_stock_on_order_complete();

-- RLS
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.inquiries enable row level security;

-- Profiles
create policy "Staff can read profiles"
  on public.profiles for select
  to authenticated
  using (public.is_staff());

create policy "Users can update own profile name"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Prevent non-admins from escalating their own role
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Allow SQL Editor / service role bootstrap (no JWT). Block non-admin app users.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Customers
create policy "Staff can read customers"
  on public.customers for select
  to authenticated
  using (public.is_staff());

create policy "Ops can insert customers"
  on public.customers for insert
  to authenticated
  with check (public.can_write_ops());

create policy "Ops can update customers"
  on public.customers for update
  to authenticated
  using (public.can_write_ops())
  with check (public.can_write_ops());

create policy "Admins can delete customers"
  on public.customers for delete
  to authenticated
  using (public.is_admin());

-- Orders
create policy "Staff can read orders"
  on public.orders for select
  to authenticated
  using (public.is_staff());

create policy "Ops can insert orders"
  on public.orders for insert
  to authenticated
  with check (public.can_write_ops());

create policy "Ops can update orders"
  on public.orders for update
  to authenticated
  using (public.can_write_ops())
  with check (public.can_write_ops());

create policy "Admins can delete orders"
  on public.orders for delete
  to authenticated
  using (public.is_admin());

-- Inventory items
create policy "Staff can read inventory"
  on public.inventory_items for select
  to authenticated
  using (public.is_staff());

create policy "Ops can insert inventory"
  on public.inventory_items for insert
  to authenticated
  with check (public.can_write_ops());

create policy "Ops can update inventory"
  on public.inventory_items for update
  to authenticated
  using (public.can_write_ops())
  with check (public.can_write_ops());

create policy "Admins can delete inventory"
  on public.inventory_items for delete
  to authenticated
  using (public.is_admin());

-- Inventory movements
create policy "Staff can read movements"
  on public.inventory_movements for select
  to authenticated
  using (public.is_staff());

create policy "Ops can insert movements via function only"
  on public.inventory_movements for insert
  to authenticated
  with check (public.can_write_ops());

-- Inquiries: anon insert (contact form), staff read/update
create policy "Anyone can submit inquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "Staff can read inquiries"
  on public.inquiries for select
  to authenticated
  using (public.is_staff());

create policy "Ops can update inquiries"
  on public.inquiries for update
  to authenticated
  using (public.can_write_ops())
  with check (public.can_write_ops());

create policy "Admins can delete inquiries"
  on public.inquiries for delete
  to authenticated
  using (public.is_admin());

-- Privileges
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant insert on public.inquiries to anon;
grant usage on all sequences in schema public to authenticated;

-- Seed inventory from string catalog + grips/grommets
insert into public.inventory_items
  (sku, name, brand, category, unit, quantity_on_hand, reorder_level, unit_cost_cents, sell_price_cents, team_price_cents)
values
  ('YONEX-BG65', 'BG 65', 'Yonex', 'string', 'set', 40, 10, 1200, 2200, 2000),
  ('YONEX-BG65T', 'BG 65 Titanium', 'Yonex', 'string', 'set', 20, 8, 1400, 2400, 2200),
  ('YONEX-BG66U', 'BG 66 Ultimax', 'Yonex', 'string', 'set', 25, 8, 1500, 2500, 2300),
  ('YONEX-BG80', 'BG 80', 'Yonex', 'string', 'set', 30, 10, 1600, 2500, 2400),
  ('YONEX-BG80P', 'BG 80 Power', 'Yonex', 'string', 'set', 15, 6, 1700, 2600, 2500),
  ('YONEX-EX63', 'Exbolt 63', 'Yonex', 'string', 'set', 12, 5, 1800, 2800, 2600),
  ('YONEX-EX65', 'Exbolt 65', 'Yonex', 'string', 'set', 12, 5, 1800, 2800, 2600),
  ('YONEX-EX68', 'Exbolt 68', 'Yonex', 'string', 'set', 12, 5, 1800, 2800, 2600),
  ('YONEX-AERO', 'Aerobite', 'Yonex', 'string', 'set', 10, 4, 1800, 2800, 2600),
  ('YONEX-AEROB', 'Aerobite Boost', 'Yonex', 'string', 'set', 8, 4, 1900, 2900, 2700),
  ('GXS-S63', 'S63', 'GXS', 'string', 'set', 20, 8, 1000, 2400, 2200),
  ('GXS-K66', 'K66', 'GXS', 'string', 'set', 25, 8, 900, 2200, 2000),
  ('GXS-Z68', 'Z68', 'GXS', 'string', 'set', 30, 10, 700, 2000, 1800),
  ('OWN-STRING', 'Own String (labor only)', 'Own', 'string', 'set', 999, 0, 0, 1600, 1400),
  ('GRIP-TOWEL', 'Towel Grip', 'Generic', 'grip', 'each', 50, 15, 200, 500, 400),
  ('GRIP-PU', 'PU Overgrip', 'Generic', 'grip', 'each', 80, 20, 100, 300, 250),
  ('GROM-STD', 'Standard Grommet Set', 'Generic', 'grommet', 'set', 20, 5, 400, 800, 700);
