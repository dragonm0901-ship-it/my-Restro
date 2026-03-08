-- ==========================================
-- RESTAURANT MANAGEMENT SAAS - SUPABASE SCHEMA
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Restaurants (Tenants)
CREATE TABLE public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles (Users linked to Auth and Restaurants)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff')),
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Categories (Menu Categories per Restaurant)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Menu Items
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('food', 'beverage', 'other')),
    image TEXT,
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('Dine-In', 'Takeaway', 'Delivery')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    table_number TEXT,
    customer_info JSONB,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC(10, 2) NOT NULL, -- Snapshot of price when ordered
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current user's restaurant_id
CREATE OR REPLACE FUNCTION public.get_current_restaurant_id()
RETURNS UUID AS $$
DECLARE
    v_restaurant_id UUID;
BEGIN
    SELECT restaurant_id INTO v_restaurant_id 
    FROM public.profiles 
    WHERE id = auth.uid();
    RETURN v_restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Restaurants Policies
-- A user can only see their own restaurant
CREATE POLICY "Users can view their own restaurant"
ON public.restaurants FOR SELECT
USING (id = public.get_current_restaurant_id());

-- Profiles Policies
-- A user can view profiles belonging to their restaurant
CREATE POLICY "Users can view profiles in their restaurant"
ON public.profiles FOR SELECT
USING (restaurant_id = public.get_current_restaurant_id());

-- Categories Policies
CREATE POLICY "Restaurant staff can manage categories"
ON public.categories FOR ALL
USING (restaurant_id = public.get_current_restaurant_id())
WITH CHECK (restaurant_id = public.get_current_restaurant_id());

-- Menu Items Policies
CREATE POLICY "Restaurant staff can manage menu items"
ON public.menu_items FOR ALL
USING (restaurant_id = public.get_current_restaurant_id())
WITH CHECK (restaurant_id = public.get_current_restaurant_id());

-- Orders Policies
CREATE POLICY "Restaurant staff can manage orders"
ON public.orders FOR ALL
USING (restaurant_id = public.get_current_restaurant_id())
WITH CHECK (restaurant_id = public.get_current_restaurant_id());

-- Order Items Policies
CREATE POLICY "Restaurant staff can manage order items"
ON public.order_items FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.restaurant_id = public.get_current_restaurant_id()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.restaurant_id = public.get_current_restaurant_id()
));

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
-- Enable real-time for orders (for KDS)
-- (Run this via Supabase dashboard as well if needed)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
