-- 1. Create the catalog_products table
CREATE TABLE IF NOT EXISTS public.catalog_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    v_id TEXT UNIQUE NOT NULL, -- The custom ID (e.g. 'nat-001')
    brand TEXT NOT NULL,       -- e.g. 'natura', 'avon'
    brand_display TEXT NOT NULL, 
    line TEXT NOT NULL,        -- e.g. 'Ekos', 'Tododia'
    name TEXT NOT NULL,        -- Product full name
    category TEXT NOT NULL,    -- skincare, perfumaria, etc
    subcategory TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    suggested_price NUMERIC(10, 2) NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    popular BOOLEAN DEFAULT false,
    image_placeholder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_catalog_brand ON public.catalog_products(brand);
CREATE INDEX IF NOT EXISTS idx_catalog_category ON public.catalog_products(category);
-- Full text search index on name
CREATE INDEX IF NOT EXISTS idx_catalog_name ON public.catalog_products USING gin (to_tsvector('portuguese', name));

-- 3. Row Level Security (RLS)
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;

-- Everyone can view the catalog
CREATE POLICY "Everyone can view the catalog"
    ON public.catalog_products FOR SELECT
    USING (true);

-- Only authenticated admins or service roles can update/insert (optional but recommended)
-- In a real scenario, restrict INSERT/UPDATE to a specific admin role. 
-- For seeding via service_role key, it bypasses RLS anyway.
