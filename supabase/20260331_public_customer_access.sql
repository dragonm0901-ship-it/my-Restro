-- Public Customer Menu Access Policies
-- Run this in Supabase SQL Editor to allow unauthenticated customers 
-- to browse menus and place orders after scanning QR codes.

-- Allow anyone to view restaurant names (needed for header)
CREATE POLICY "Public can view restaurant names" ON restaurants
  FOR SELECT USING (true);

-- Allow anyone to view menu items (customer-facing menu)
CREATE POLICY "Public can view menu items" ON menu_items
  FOR SELECT USING (true);

-- Allow anyone to view categories (for menu filtering)
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

-- Allow unauthenticated customers to create orders (from QR menu)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow unauthenticated customers to insert order items
CREATE POLICY "Public can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);
