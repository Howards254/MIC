-- Enhanced profiles with more details
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS expertise TEXT[]; -- Array of expertise areas
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[]; -- Array of interest areas

-- Enhanced projects table with more innovator details
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_size INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stage TEXT; -- Idea, Prototype, MVP, Scaling
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline TEXT; -- Expected completion timeline
ALTER TABLE projects ADD COLUMN IF NOT EXISTS impact_metrics TEXT; -- Environmental impact goals
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technology TEXT; -- Technology/materials used
ALTER TABLE projects ADD COLUMN IF NOT EXISTS market_size TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS competitors TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS unique_value TEXT; -- What makes it unique
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT; -- Pitch video
ALTER TABLE projects ADD COLUMN IF NOT EXISTS documents TEXT[]; -- Supporting documents URLs

-- Enhanced investor_applications with more investor details
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS investment_thesis TEXT;
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS portfolio_companies TEXT; -- Past investments
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS preferred_stage TEXT; -- Preferred investment stage
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS ticket_size_min INTEGER;
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS ticket_size_max INTEGER;
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS geographic_focus TEXT;
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS decision_timeline TEXT; -- How fast they decide
ALTER TABLE investor_applications ADD COLUMN IF NOT EXISTS value_add TEXT; -- What they bring beyond money

-- Create investor_profiles table for approved investors
CREATE TABLE IF NOT EXISTS investor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  investment_range TEXT NOT NULL,
  areas_of_interest TEXT NOT NULL,
  investment_thesis TEXT,
  portfolio_companies TEXT,
  preferred_stage TEXT,
  ticket_size_min INTEGER,
  ticket_size_max INTEGER,
  geographic_focus TEXT,
  decision_timeline TEXT,
  value_add TEXT,
  total_investments INTEGER DEFAULT 0,
  active_investments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view investor profiles
CREATE POLICY "Anyone can view investor profiles"
  ON investor_profiles FOR SELECT
  USING (true);

-- Only the investor can update their profile
CREATE POLICY "Investors can update own profile"
  ON investor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create project_team table for team members
CREATE TABLE IF NOT EXISTS project_team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  linkedin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;

-- Anyone can view team members
CREATE POLICY "Anyone can view team members"
  ON project_team FOR SELECT
  USING (true);

-- Project owners can manage team
CREATE POLICY "Project owners can manage team"
  ON project_team FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_team.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create investor_interests table for matching
CREATE TABLE IF NOT EXISTS investor_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'interested', -- interested, meeting_scheduled, due_diligence, passed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(investor_id, project_id)
);

-- Enable RLS
ALTER TABLE investor_interests ENABLE ROW LEVEL SECURITY;

-- Investors can manage their interests
CREATE POLICY "Investors can manage own interests"
  ON investor_interests FOR ALL
  USING (auth.uid() = investor_id);

-- Project owners can view interests in their projects
CREATE POLICY "Project owners can view interests"
  ON investor_interests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = investor_interests.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investor_profiles_user_id ON investor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON project_team(project_id);
CREATE INDEX IF NOT EXISTS idx_investor_interests_investor_id ON investor_interests(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_interests_project_id ON investor_interests(project_id);
