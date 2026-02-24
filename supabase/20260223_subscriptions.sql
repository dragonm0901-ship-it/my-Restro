-- ============================================================
-- SAAS SUBSCRIPTIONS & MONETIZATION
-- ============================================================

-- 1. SUBSCRIPTION PLANS
-- These are the plans available for restaurants to purchase (e.g., Basic, Pro).
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- e.g., 'Basic', 'Pro', 'Premium'
  description TEXT,
  price_npr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  duration_days INT NOT NULL DEFAULT 30, -- usually 30 for monthly, 365 for yearly
  max_staff INT NOT NULL DEFAULT 5, -- Feature gating 
  max_menu_items INT NOT NULL DEFAULT 50, -- Feature gating
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Note: We can insert default plans here or do it via seeding.
INSERT INTO subscription_plans (name, description, price_npr, duration_days, max_staff, max_menu_items)
VALUES 
('Free Tier', 'Basic features for testing', 0.00, 14, 2, 20)
ON CONFLICT (name) DO NOTHING;

INSERT INTO subscription_plans (name, description, price_npr, duration_days, max_staff, max_menu_items)
VALUES 
('Pro Monthly', 'Good for small restaurants', 2000.00, 30, 10, 200)
ON CONFLICT (name) DO NOTHING;


-- 2. RESTAURANT SUBSCRIPTIONS
-- Links a restaurant to a specific plan and tracks its validity.
CREATE TABLE IF NOT EXISTS restaurant_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE UNIQUE, -- One active sub per restaurant
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '14 days', -- Default trial
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 3. PAYMENT TRANSACTIONS
-- Logs all payment attempts (eSewa, Khalti, Bank Transfer).
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  amount_npr NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('esewa', 'khalti', 'bank_transfer', 'manual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT, -- eSewa REF ID or Khalti Token
  reference_id TEXT, -- Our internal string sent to eSewa/Khalti (e.g., UUID string without dashes)
  gateway_response JSONB, -- Store full response payload for debugging
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RLS POLICIES FOR SAAS TABLES
-- ============================================================

-- SUBSCRIPTION PLANS (Read-only for all logged-in profiles)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
  FOR SELECT USING (auth.role() = 'authenticated');


-- RESTAURANT SUBSCRIPTIONS
ALTER TABLE restaurant_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their restaurant subscription" ON restaurant_subscriptions
  FOR SELECT USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only service role (backend) should update subscriptions, but if needed:
-- CREATE POLICY "Admins can update their restaurant subscription" ON restaurant_subscriptions ...


-- PAYMENT TRANSACTIONS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their payment transactions" ON payment_transactions
  FOR SELECT USING (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert pending transactions" ON payment_transactions
  FOR INSERT WITH CHECK (
    restaurant_id = (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only the server (service role) should update the status to completed based on gateway callbacks.


-- ============================================================
-- AUTOMATION TRIGGERS
-- ============================================================

-- Trigger to automatically create a "Free Tier" or "Trial" subscription when a new restaurant is created
CREATE OR REPLACE FUNCTION public.handle_new_restaurant_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Find the Free Tier plan ID
  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE name = 'Free Tier' LIMIT 1;

  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.restaurant_subscriptions (restaurant_id, plan_id, status, current_period_end)
    VALUES (NEW.id, free_plan_id, 'trialing', NOW() + INTERVAL '14 days');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON restaurants
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_restaurant_subscription();
