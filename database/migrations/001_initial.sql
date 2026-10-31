CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE commerce_mode AS ENUM ('buy', 'rent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending_payment',
    'paid',
    'processing',
    'shipped',
    'completed',
    'cancelled',
    'payment_failed',
    'refund_pending',
    'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refund_pending';

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category_id uuid NOT NULL REFERENCES categories(id),
  manufacturer text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  characteristics jsonb NOT NULL DEFAULT '[]'::jsonb,
  materials text NOT NULL DEFAULT '',
  purchase_price integer CHECK (purchase_price IS NULL OR purchase_price >= 0),
  rental_price_daily integer CHECK (rental_price_daily IS NULL OR rental_price_daily >= 0),
  rental_min_days integer NOT NULL DEFAULT 1 CHECK (rental_min_days > 0),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  purchase_enabled boolean NOT NULL DEFAULT true,
  rental_enabled boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  badge text NOT NULL DEFAULT '',
  source_url text,
  flow_lpm numeric,
  drive text NOT NULL DEFAULT 'unknown',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_published_idx ON products(category_id, published);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  mode commerce_mode NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_payment',
  amount integer NOT NULL CHECK (amount > 0),
  currency char(3) NOT NULL DEFAULT 'RUB',
  rental_start date,
  rental_end date,
  payment_id text UNIQUE,
  payment_confirmation_url text,
  idempotency_key text NOT NULL UNIQUE,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (mode = 'buy' AND rental_start IS NULL AND rental_end IS NULL)
    OR
    (mode = 'rent' AND rental_start IS NOT NULL AND rental_end IS NOT NULL AND rental_end >= rental_start)
  )
);

CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_rental_window_idx ON orders(rental_start, rental_end) WHERE mode = 'rent';

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  product_model text NOT NULL DEFAULT '',
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price integer NOT NULL CHECK (unit_price >= 0),
  rental_days integer,
  line_total integer NOT NULL CHECK (line_total >= 0),
  CHECK ((rental_days IS NULL) OR rental_days > 0)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  login text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS admin_login_limits (
  login_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0)
);

CREATE TABLE IF NOT EXISTS payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_event_id text NOT NULL UNIQUE,
  payment_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);
