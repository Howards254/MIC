-- Simple fix: Drop all existing policies and create new ones

-- PROJECTS TABLE
DROP POLICY IF EXISTS "Approved projects viewable by all" ON projects;
DROP POLICY IF EXISTS "Projects viewable by owners, admins, or if approved" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Admins can update any project" ON projects;
DROP POLICY IF EXISTS "Admins and owners can update projects" ON projects;

-- Allow everyone to see approved projects, owners to see their own, admins to see all
CREATE POLICY "projects_select_policy" ON projects FOR SELECT USING (
  status IN ('approved', 'funded', 'active') 
  OR auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Allow owners and admins to update
CREATE POLICY "projects_update_policy" ON projects FOR UPDATE USING (
  auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- INVESTOR APPLICATIONS TABLE
DROP POLICY IF EXISTS "Users can view own applications" ON investor_applications;
DROP POLICY IF EXISTS "Users and admins can view applications" ON investor_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON investor_applications;
DROP POLICY IF EXISTS "Admins can update investor applications" ON investor_applications;

-- Allow users to see their own applications, admins to see all
CREATE POLICY "investor_applications_select_policy" ON investor_applications FOR SELECT USING (
  auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Allow admins to update
CREATE POLICY "investor_applications_update_policy" ON investor_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
