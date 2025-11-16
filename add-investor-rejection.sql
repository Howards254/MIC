-- Add rejection fields to investor_profiles
ALTER TABLE investor_profiles 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_investor_profiles_rejected_by ON investor_profiles(rejected_by);
