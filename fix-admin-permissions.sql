-- Fix admin permissions to view all projects and investor applications

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can update all projects" ON projects;
DROP POLICY IF EXISTS "Admins can view all investor applications" ON investor_applications;
DROP POLICY IF EXISTS "Admins can update all investor applications" ON investor_applications;

-- Allow admins to view all projects
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update all projects (for approvals)
CREATE POLICY "Admins can update all projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to view all investor applications
CREATE POLICY "Admins can view all investor applications"
  ON investor_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update all investor applications (for approvals)
CREATE POLICY "Admins can update all investor applications"
  ON investor_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update user roles (for making investors)
DROP POLICY IF EXISTS "Admins can update user roles" ON profiles;
CREATE POLICY "Admins can update user roles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );
