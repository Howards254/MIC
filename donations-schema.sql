-- Donations table for project donations
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 10),
  platform_fee DECIMAL(10, 2) NOT NULL,
  net_amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add total_donations column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_donations DECIMAL(10, 2) DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- Function to update project total_donations
CREATE OR REPLACE FUNCTION update_project_donations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE projects 
    SET total_donations = COALESCE(total_donations, 0) + NEW.net_amount
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      UPDATE projects 
      SET total_donations = COALESCE(total_donations, 0) + NEW.net_amount
      WHERE id = NEW.project_id;
    ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      UPDATE projects 
      SET total_donations = COALESCE(total_donations, 0) - OLD.net_amount
      WHERE id = NEW.project_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'completed' THEN
    UPDATE projects 
    SET total_donations = COALESCE(total_donations, 0) - OLD.net_amount
    WHERE id = OLD.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_project_donations ON donations;
CREATE TRIGGER trigger_update_project_donations
  AFTER INSERT OR UPDATE OR DELETE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_project_donations();

-- RLS Policies
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Anyone can view completed donations (for donor list)
CREATE POLICY "donations_select_policy" ON donations FOR SELECT USING (
  status = 'completed'
  OR auth.uid() = donor_id
  OR EXISTS (SELECT 1 FROM projects WHERE projects.id = donations.project_id AND projects.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Anyone can create donations (guests or authenticated users)
CREATE POLICY "donations_insert_policy" ON donations FOR INSERT WITH CHECK (
  true
);

-- Only admins can update/delete donations
CREATE POLICY "donations_update_policy" ON donations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "donations_delete_policy" ON donations FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
