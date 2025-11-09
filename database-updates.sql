-- Additional tables for enhanced dashboard features
-- Run this AFTER running supabase-schema.sql

-- Investment Equity/Terms Table
CREATE TABLE investment_terms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  investment_id UUID REFERENCES investments(id) ON DELETE CASCADE NOT NULL,
  equity_percentage DECIMAL(5,2),
  valuation DECIMAL(12,2),
  terms TEXT,
  agreed_by_investor BOOLEAN DEFAULT false,
  agreed_by_innovator BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages/Communication Table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Analytics Table
CREATE TABLE project_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  investment_inquiries INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(project_id, date)
);

-- Enable RLS
ALTER TABLE investment_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_analytics ENABLE ROW LEVEL SECURITY;

-- Investment Terms Policies
CREATE POLICY "Investment parties can view terms" ON investment_terms FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM investments i 
    WHERE i.id = investment_id 
    AND (i.investor_id = auth.uid() OR i.project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  )
);

CREATE POLICY "Investment parties can update terms" ON investment_terms FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM investments i 
    WHERE i.id = investment_id 
    AND (i.investor_id = auth.uid() OR i.project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  )
);

CREATE POLICY "Investors can create terms" ON investment_terms FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM investments i 
    WHERE i.id = investment_id AND i.investor_id = auth.uid()
  )
);

-- Messages Policies
CREATE POLICY "Users can view their messages" ON messages FOR SELECT
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received messages" ON messages FOR UPDATE
USING (receiver_id = auth.uid());

-- Analytics Policies
CREATE POLICY "Project owners can view analytics" ON project_analytics FOR SELECT
USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "System can insert analytics" ON project_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update analytics" ON project_analytics FOR UPDATE
USING (true);
