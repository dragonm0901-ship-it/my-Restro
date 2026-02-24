-- myRestro Restaurant Management — Database Schema (Multi-Tenant)
-- Run this in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- RESTAURANTS TABLE (New for Multi-Tenancy)
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE, -- Link to restaurant
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'kitchen', 'superadmin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- We no longer auto-create the profile with a generic role in the same way,
-- because a user needs to either CREATE a restaurant (becoming admin) 
-- or be INVITED to one (becoming staff). 
-- For now, we'll keep a basic trigger but allow `restaurant_id` to be null initially
-- until they complete the onboarding step.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, restaurant_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin'), -- Default to admin for new signups
    NULL -- Will be set during restaurant creation onboarding
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- MENU ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE, -- Multi-tenant Foreign Key
  name TEXT NOT NULL,
  name_np TEXT,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Other',
  image_url TEXT,
  sizes TEXT[] DEFAULT '{}',
  variations TEXT[] DEFAULT '{}',
  spice_levels TEXT[] DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE, -- Multi-tenant Foreign Key
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]',
  table_number INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (MULTI-TENANT POLICIES)
-- ============================================================

-- RESTAURANTS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own restaurant" ON restaurants
  FOR SELECT USING (
    id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update their restaurant" ON restaurants
  FOR UPDATE USING (
    id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles in their restaurant" ON profiles
  FOR SELECT USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid())
    OR id = auth.uid() -- Can always view own profile even if restaurant_id is null (during onboarding)
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update profiles in their restaurant" ON profiles
  FOR UPDATE USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- MENU ITEMS 
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone in the restaurant can view menu items" ON menu_items
  FOR SELECT USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can insert menu items for their restaurant" ON menu_items
  FOR INSERT WITH CHECK (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update menu items in their restaurant" ON menu_items
  FOR UPDATE USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete menu items in their restaurant" ON menu_items
  FOR DELETE USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view orders in their restaurant" ON orders
  FOR SELECT USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Staff can create orders for their restaurant" ON orders
  FOR INSERT WITH CHECK (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Staff can update orders in their restaurant" ON orders
  FOR UPDATE USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'kitchen'))
  );

-- ============================================================
-- REAL-TIME (enable for orders and menu_items)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;

-- ============================================================
-- HELPER FUNCTIONS / TRIGGERS
-- ============================================================

-- Function to handle restaurant creation during onboarding
-- This function will be called via Supabase RPC from the frontend
CREATE OR REPLACE FUNCTION public.create_restaurant_and_link(restaurant_name TEXT)
RETURNS UUID AS $$
DECLARE
  new_restaurant_id UUID;
BEGIN
  -- Insert new restaurant
  INSERT INTO public.restaurants (name)
  VALUES (restaurant_name)
  RETURNING id INTO new_restaurant_id;

  -- Update the calling user's profile with the new restaurant_id and set role to admin
  UPDATE public.profiles
  SET restaurant_id = new_restaurant_id, role = 'admin'
  WHERE id = auth.uid();

  RETURN new_restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
