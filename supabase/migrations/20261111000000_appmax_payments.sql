-- Pagamentos via Appmax: pedidos de assinatura e ajustes na tabela subscriptions.

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'appmax',
  plan text not null check (plan in ('monthly', 'quarterly', 'annual')),
  method text not null check (method in ('pix', 'card')),
  amount_cents integer not null,
  appmax_customer_id bigint,
  appmax_order_id bigint unique,
  status text not null default 'pendente',
  pix_emv text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_user_idx on public.payment_orders (user_id, created_at desc);
create index if not exists payment_orders_customer_idx on public.payment_orders (appmax_customer_id);

alter table public.payment_orders enable row level security;

drop policy if exists "payment_orders_select_own" on public.payment_orders;
create policy "payment_orders_select_own" on public.payment_orders
  for select using (auth.uid() = user_id);

-- A escrita é feita só pelo servidor (service role, que ignora o RLS).

-- Assinaturas deixam de exigir os campos do Stripe.
do $$
declare c text;
begin
  foreach c in array array['stripe_customer_id', 'stripe_subscription_id', 'stripe_price_id'] loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'subscriptions' and column_name = c and is_nullable = 'NO'
    ) then
      execute format('alter table public.subscriptions alter column %I drop not null', c);
    end if;
  end loop;
end $$;
