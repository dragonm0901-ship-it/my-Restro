-- ==========================================
-- RESTAURANT & HOTEL MANAGEMENT SAAS - SUPABASE SCHEMA
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

-- ==========================================
-- CORE: MENU & CATEGORIES
-- ==========================================

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
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- NEW: ADVANCED INVENTORY (RECIPES)
-- ==========================================

-- 5. Ingredients (Raw materials)
CREATE TABLE public.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g., 'kg', 'g', 'L', 'ml', 'pcs'
    current_stock NUMERIC(10, 3) DEFAULT 0,
    cost_per_unit NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Recipes (Mapping menu_items to ingredients)
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE RESTRICT,
    quantity_required NUMERIC(10, 3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- NEW: LOCATIONS & HOTEL
-- ==========================================

-- 7. Tables (Restaurant floorplan)
CREATE TABLE public.tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INTEGER DEFAULT 2,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'dirty')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Hotel Rooms
CREATE TABLE public.hotel_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Hotel Guests (Folios)
CREATE TABLE public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.hotel_rooms(id) ON DELETE RESTRICT,
    guest_name TEXT NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out TIMESTAMP WITH TIME ZONE,
    balance NUMERIC(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'checked_out')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TRANSACTIONS & SHIFTS
-- ==========================================

-- 10. Cash Drawers & Shifts
CREATE TABLE public.shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    opening_balance NUMERIC(10, 2) NOT NULL,
    closing_balance NUMERIC(10, 2),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed'))
);

-- ==========================================
-- ORDERS & ITEMS
-- ==========================================

-- 11. Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES public.shifts(id) ON DELETE SET NULL, -- Track which shift took the order
    type TEXT NOT NULL CHECK (type IN ('Dine-In', 'Takeaway', 'Delivery', 'Room-Service')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    
    -- Location Relational Links (Replacing raw strings)
    table_id UUID REFERENCES public.tables(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.hotel_rooms(id) ON DELETE SET NULL,
    
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    customer_info JSONB,
    
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'charged_to_room')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Transactions (Payments per order)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES public.shifts(id) ON DELETE SET NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'room_charge', 'wallet')),
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- NEW: STRICT ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Helper function: Get Current User's Restaurant ID
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

-- Helper function: Get Current User's Role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role 
    FROM public.profiles 
    WHERE id = auth.uid();
    RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is User Manager or Owner
CREATE OR REPLACE FUNCTION public.is_manager_or_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_current_user_role() IN ('manager', 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 1. Restaurants & Profiles (Read only for staff)
CREATE POLICY "Users can view their own restaurant"
ON public.restaurants FOR SELECT USING (id = public.get_current_restaurant_id());

CREATE POLICY "Users can view profiles in their restaurant"
ON public.profiles FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

-- 2. Menu & Categories (Staff can read. Only Managers can edit/delete)
CREATE POLICY "Staff can view categories"
ON public.categories FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can modify categories"
ON public.categories FOR ALL USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

CREATE POLICY "Staff can view menu items"
ON public.menu_items FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can modify menu items"
ON public.menu_items FOR ALL USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

-- 3. Inventory (Staff can read. Only Managers can edit/delete)
CREATE POLICY "Staff can view ingredients"
ON public.ingredients FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can modify ingredients"
ON public.ingredients FOR ALL USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

CREATE POLICY "Staff can view recipes"
ON public.recipes FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.menu_items 
    WHERE menu_items.id = recipes.menu_item_id AND menu_items.restaurant_id = public.get_current_restaurant_id()
));

CREATE POLICY "Managers can modify recipes"
ON public.recipes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.menu_items WHERE menu_items.id = recipes.menu_item_id AND menu_items.restaurant_id = public.get_current_restaurant_id()) 
    AND public.is_manager_or_owner()
);

-- 4. Locations (Staff can read/update status. Only managers can add/delete tables and rooms)
CREATE POLICY "Staff can view and update tables"
ON public.tables FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Staff can update table status"
ON public.tables FOR UPDATE USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can insert and delete tables"
ON public.tables FOR ALL USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

CREATE POLICY "Staff can view and update hotel rooms"
ON public.hotel_rooms FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Staff can update hotel room status"
ON public.hotel_rooms FOR UPDATE USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can insert and delete hotel rooms"
ON public.hotel_rooms FOR ALL USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

-- 5. Guests
CREATE POLICY "Staff can manage guests"
ON public.guests FOR ALL USING (restaurant_id = public.get_current_restaurant_id());

-- 6. Shifts & Transactions
CREATE POLICY "Staff can manage shifts"
ON public.shifts FOR ALL USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Staff can insert transactions but only managers can refund/delete"
ON public.transactions FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Staff can insert transactions"
ON public.transactions FOR INSERT WITH CHECK (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can modify transactions"
ON public.transactions FOR UPDATE USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

CREATE POLICY "Managers can delete transactions"
ON public.transactions FOR DELETE USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

-- 7. Orders & Items
CREATE POLICY "Staff can view their restaurant orders"
ON public.orders FOR SELECT USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Staff can insert and update their restaurant orders"
ON public.orders FOR INSERT WITH CHECK (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Staff can update their restaurant orders"
ON public.orders FOR UPDATE USING (restaurant_id = public.get_current_restaurant_id());

CREATE POLICY "Managers can delete orders"
ON public.orders FOR DELETE USING (restaurant_id = public.get_current_restaurant_id() AND public.is_manager_or_owner());

CREATE POLICY "Staff can manage order items"
ON public.order_items FOR ALL USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND orders.restaurant_id = public.get_current_restaurant_id()
));


-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter publication supabase_realtime add table public.tables;
alter publication supabase_realtime add table public.hotel_rooms;
