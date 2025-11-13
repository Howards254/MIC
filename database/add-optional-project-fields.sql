-- Add optional fields to projects table

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS technology TEXT,
ADD COLUMN IF NOT EXISTS impact_metrics TEXT;
