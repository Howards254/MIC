-- =====================================================
-- COMPLETE SCHEMA UPDATES
-- Run this to add all missing columns to existing database
-- =====================================================

-- Add category column to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT;

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Add optional project fields
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS technology TEXT,
ADD COLUMN IF NOT EXISTS impact_metrics TEXT;

-- Add rejection reason fields to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_projects_rejected_by ON projects(rejected_by);

-- Verify all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;
