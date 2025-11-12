-- Add category column to projects table

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
