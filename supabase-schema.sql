-- MIC Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'investor', 'admin')) DEFAULT 'user' NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor Applications Table
CREATE TABLE investor_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  investment_range TEXT NOT NULL,
  areas_of_interest TEXT[] NOT NULL,
  linkedin_url TEXT,
  website_url TEXT,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  funding_goal DECIMAL(12,2) NOT NULL,
  funds_raised DECIMAL(12,2) DEFAULT 0,
  timeline TEXT NOT NULL,
  team_size INTEGER,
  website_url TEXT,
  pitch_deck_url TEXT,
  video_url TEXT,
  images TEXT[],
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'funded', 'active')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments Table
CREATE TABLE investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')) NOT NULL,
  salary_range TEXT,
  requirements TEXT[] NOT NULL,
  responsibilities TEXT[] NOT NULL,
  status TEXT CHECK (status IN ('open', 'closed')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_url TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Project Updates Table
CREATE TABLE project_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Investor Applications Policies
CREATE POLICY "Users can view own applications" ON investor_applications FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can create applications" ON investor_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update applications" ON investor_applications FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Projects Policies
CREATE POLICY "Approved projects viewable by all" ON projects FOR SELECT USING (status = 'approved' OR status = 'funded' OR status = 'active' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins can update any project" ON projects FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Investments Policies
CREATE POLICY "Investments viewable by project owner and investor" ON investments FOR SELECT USING (auth.uid() = investor_id OR auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Approved investors can create investments" ON investments FOR INSERT WITH CHECK (auth.uid() = investor_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'investor'));

-- Jobs Policies
CREATE POLICY "Open jobs viewable by all" ON jobs FOR SELECT USING (status = 'open' OR auth.uid() = posted_by);
CREATE POLICY "Project owners can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Project owners can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = posted_by);

-- Job Applications Policies
CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT posted_by FROM jobs WHERE id = job_id));
CREATE POLICY "Job seekers can create applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Job posters can update applications" ON job_applications FOR UPDATE USING (auth.uid() IN (SELECT posted_by FROM jobs WHERE id = job_id));

-- Project Updates Policies
CREATE POLICY "Updates viewable by all for approved projects" ON project_updates FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND (status = 'approved' OR status = 'funded' OR status = 'active')));
CREATE POLICY "Project owners can create updates" ON project_updates FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));

-- Functions
CREATE OR REPLACE FUNCTION update_project_funds()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects 
  SET funds_raised = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM investments 
    WHERE project_id = NEW.project_id
  )
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_funds_trigger
AFTER INSERT ON investments
FOR EACH ROW
EXECUTE FUNCTION update_project_funds();

-- Create admin user function (call this after first user signs up)
CREATE OR REPLACE FUNCTION make_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET role = 'admin' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
