-- =====================================================
-- MIC PLATFORM - NEW SIMPLIFIED SCHEMA
-- Two roles: Innovator & Investor (chosen at signup)
-- Job seekers don't need accounts
-- =====================================================

-- Drop existing tables (in correct order to handle dependencies)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS investment_messages CASCADE;
DROP TABLE IF EXISTS investment_commitments CASCADE;
DROP TABLE IF EXISTS investor_wallet_transactions CASCADE;
DROP TABLE IF EXISTS investor_wallets CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS investor_profiles CASCADE;
DROP TABLE IF EXISTS investor_applications CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS platform_investments CASCADE;
DROP TABLE IF EXISTS investment_milestones CASCADE;
DROP TABLE IF EXISTS equity_holdings CASCADE;
DROP TABLE IF EXISTS deal_documents CASCADE;
DROP TABLE IF EXISTS investor_accreditation CASCADE;
DROP TABLE IF EXISTS negotiation_history CASCADE;
DROP TABLE IF EXISTS fund_transfers CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- PROFILES TABLE (All Users)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('innovator', 'investor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- INVESTOR PROFILES (Extended info for investors)
-- =====================================================
CREATE TABLE investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT,
  investment_thesis TEXT,
  min_ticket_size DECIMAL(15,2),
  max_ticket_size DECIMAL(15,2),
  sectors_of_interest TEXT[],
  geographic_focus TEXT[],
  linkedin_url TEXT,
  website_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for investor_profiles
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "investor_profiles_select_policy" ON investor_profiles FOR SELECT USING (true);
CREATE POLICY "investor_profiles_insert_policy" ON investor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "investor_profiles_update_policy" ON investor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- INVESTOR WALLETS (Track deposits and balance)
-- =====================================================
CREATE TABLE investor_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0 CHECK (balance >= 0),
  total_deposited DECIMAL(15,2) DEFAULT 0,
  total_invested DECIMAL(15,2) DEFAULT 0,
  total_disinvested DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for investor_wallets
ALTER TABLE investor_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "investor_wallets_select_policy" ON investor_wallets FOR SELECT USING (auth.uid() = investor_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "investor_wallets_insert_policy" ON investor_wallets FOR INSERT WITH CHECK (auth.uid() = investor_id);

-- =====================================================
-- WALLET TRANSACTIONS (Deposits, investments, disinvestments)
-- =====================================================
CREATE TABLE investor_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES investor_wallets(id) ON DELETE CASCADE NOT NULL,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'investment', 'disinvestment', 'refund')),
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  reference_id UUID, -- Links to investment_commitments if applicable
  payment_method TEXT, -- 'pesaflow', 'mpesa', 'card', etc.
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for wallet transactions
ALTER TABLE investor_wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_transactions_select_policy" ON investor_wallet_transactions FOR SELECT USING (auth.uid() = investor_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "wallet_transactions_insert_policy" ON investor_wallet_transactions FOR INSERT WITH CHECK (auth.uid() = investor_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  innovator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_statement TEXT,
  solution TEXT,
  target_market TEXT,
  business_model TEXT,
  funding_goal DECIMAL(15,2) NOT NULL,
  funds_raised DECIMAL(15,2) DEFAULT 0,
  total_donations DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'funding', 'funded', 'deal_signed', 'closed')),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  deal_signed_at TIMESTAMPTZ,
  event_id UUID, -- Reference to event where deal will be signed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_policy" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_policy" ON projects FOR INSERT WITH CHECK (auth.uid() = innovator_id);
CREATE POLICY "projects_update_policy" ON projects FOR UPDATE USING (auth.uid() = innovator_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "projects_delete_policy" ON projects FOR DELETE USING (auth.uid() = innovator_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- INVESTMENT COMMITMENTS (Investor commits to project)
-- =====================================================
CREATE TABLE investment_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  equity_offered DECIMAL(5,2), -- Percentage equity investor wants
  initial_message TEXT, -- Terms and conditions from investor
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'agreed', 'deal_signed', 'disinvested')),
  deal_signed_at TIMESTAMPTZ,
  platform_fee DECIMAL(15,2) DEFAULT 0, -- 5% of investment
  platform_equity DECIMAL(5,2) DEFAULT 5.00, -- 5% equity to platform
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for investment_commitments
ALTER TABLE investment_commitments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commitments_select_policy" ON investment_commitments FOR SELECT USING (
  auth.uid() = investor_id OR 
  auth.uid() IN (SELECT innovator_id FROM projects WHERE id = project_id) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "commitments_insert_policy" ON investment_commitments FOR INSERT WITH CHECK (auth.uid() = investor_id);
CREATE POLICY "commitments_update_policy" ON investment_commitments FOR UPDATE USING (
  auth.uid() = investor_id OR 
  auth.uid() IN (SELECT innovator_id FROM projects WHERE id = project_id)
);

-- =====================================================
-- MESSAGES (Unified messaging between investor & innovator)
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment_id UUID REFERENCES investment_commitments(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_policy" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert_policy" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update_policy" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- =====================================================
-- DONATIONS TABLE (Separate from investments)
-- =====================================================
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(15,2) NOT NULL,
  platform_fee DECIMAL(15,2) DEFAULT 0, -- 2% of donation
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donations_select_policy" ON donations FOR SELECT USING (true);
CREATE POLICY "donations_insert_policy" ON donations FOR INSERT WITH CHECK (true);

-- =====================================================
-- JOBS TABLE (No applications - just instructions)
-- =====================================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  innovator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  how_to_apply TEXT NOT NULL, -- Instructions on how to apply (email, form link, etc.)
  location TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  salary_range TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_policy" ON jobs FOR SELECT USING (true);
CREATE POLICY "jobs_insert_policy" ON jobs FOR INSERT WITH CHECK (auth.uid() = innovator_id);
CREATE POLICY "jobs_update_policy" ON jobs FOR UPDATE USING (auth.uid() = innovator_id);
CREATE POLICY "jobs_delete_policy" ON jobs FOR DELETE USING (auth.uid() = innovator_id);

-- =====================================================
-- EVENTS TABLE (Deal signing events)
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  max_attendees INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_policy" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert_policy" ON events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "events_update_policy" ON events FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Auto-create investor wallet when investor profile is created
CREATE OR REPLACE FUNCTION create_investor_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO investor_wallets (investor_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_investor_wallet
AFTER INSERT ON investor_profiles
FOR EACH ROW
EXECUTE FUNCTION create_investor_wallet();

-- Update project funds_raised when investment is made
CREATE OR REPLACE FUNCTION update_project_funding()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'agreed' OR NEW.status = 'deal_signed' THEN
    UPDATE projects 
    SET funds_raised = (
      SELECT COALESCE(SUM(amount), 0) 
      FROM investment_commitments 
      WHERE project_id = NEW.project_id 
      AND status IN ('agreed', 'deal_signed')
    )
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_project_funding
AFTER INSERT OR UPDATE ON investment_commitments
FOR EACH ROW
EXECUTE FUNCTION update_project_funding();

-- Update project total_donations when donation is made
CREATE OR REPLACE FUNCTION update_project_donations()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects 
  SET total_donations = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM donations 
    WHERE project_id = NEW.project_id
  )
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_project_donations
AFTER INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION update_project_donations();

-- Auto-create initial message when investment commitment is made
CREATE OR REPLACE FUNCTION create_initial_investment_message()
RETURNS TRIGGER AS $$
DECLARE
  innovator_id UUID;
BEGIN
  IF NEW.initial_message IS NOT NULL THEN
    SELECT p.innovator_id INTO innovator_id FROM projects p WHERE p.id = NEW.project_id;
    
    INSERT INTO messages (commitment_id, sender_id, receiver_id, message)
    VALUES (NEW.id, NEW.investor_id, innovator_id, NEW.initial_message);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_initial_message
AFTER INSERT ON investment_commitments
FOR EACH ROW
EXECUTE FUNCTION create_initial_investment_message();

-- Calculate platform fee on investment (5%)
CREATE OR REPLACE FUNCTION calculate_investment_fee()
RETURNS TRIGGER AS $$
BEGIN
  NEW.platform_fee := NEW.amount * 0.05;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_investment_fee
BEFORE INSERT OR UPDATE ON investment_commitments
FOR EACH ROW
EXECUTE FUNCTION calculate_investment_fee();

-- Calculate platform fee on donation (2%)
CREATE OR REPLACE FUNCTION calculate_donation_fee()
RETURNS TRIGGER AS $$
BEGIN
  NEW.platform_fee := NEW.amount * 0.02;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_donation_fee
BEFORE INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION calculate_donation_fee();

-- Update project status when funding goal reached
CREATE OR REPLACE FUNCTION check_funding_goal()
RETURNS TRIGGER AS $$
DECLARE
  project_funding_goal DECIMAL(15,2);
  project_funds_raised DECIMAL(15,2);
BEGIN
  SELECT funding_goal, funds_raised INTO project_funding_goal, project_funds_raised
  FROM projects WHERE id = NEW.project_id;
  
  IF project_funds_raised >= project_funding_goal THEN
    UPDATE projects SET status = 'funded' WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_check_funding_goal
AFTER UPDATE ON projects
FOR EACH ROW
WHEN (OLD.funds_raised IS DISTINCT FROM NEW.funds_raised)
EXECUTE FUNCTION check_funding_goal();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Make user admin
CREATE OR REPLACE FUNCTION make_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET role = 'admin' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get investor balance
CREATE OR REPLACE FUNCTION get_investor_balance(investor_uuid UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  current_balance DECIMAL(15,2);
BEGIN
  SELECT balance INTO current_balance FROM investor_wallets WHERE investor_id = investor_uuid;
  RETURN COALESCE(current_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_innovator ON projects(innovator_id);
CREATE INDEX idx_commitments_project ON investment_commitments(project_id);
CREATE INDEX idx_commitments_investor ON investment_commitments(investor_id);
CREATE INDEX idx_commitments_status ON investment_commitments(status);
CREATE INDEX idx_messages_commitment ON messages(commitment_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_donations_project ON donations(project_id);
CREATE INDEX idx_jobs_project ON jobs(project_id);
CREATE INDEX idx_wallet_transactions_investor ON investor_wallet_transactions(investor_id);

-- =====================================================
-- INITIAL ADMIN SETUP
-- =====================================================
-- Run this after first signup: SELECT make_admin('karolhowards@gmail.com');
