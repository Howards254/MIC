-- Add rejection reason to projects table

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES profiles(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_rejected_by ON projects(rejected_by);
