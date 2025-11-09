-- Fix RLS policies to ensure admins can see ALL projects and investor applications

-- Drop and recreate the projects SELECT policy to be more explicit
DROP POLICY IF EXISTS "Approved projects viewable by all" ON projects;

CREATE POLICY "Projects viewable by owners, admins, or if approved" 
ON projects FOR SELECT 
USING (
  status IN ('approved', 'funded', 'active') 
  OR auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Ensure admins can update any project
DROP POLICY IF EXISTS "Admins can update any project" ON projects;

CREATE POLICY "Admins and owners can update projects" 
ON projects FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Ensure admins can delete projects if needed
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

CREATE POLICY "Admins and owners can delete projects" 
ON projects FOR DELETE 
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Fix investor applications policies
DROP POLICY IF EXISTS "Users can view own applications" ON investor_applications;

CREATE POLICY "Users and admins can view applications" 
ON investor_applications FOR SELECT 
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Ensure admins can update investor applications
DROP POLICY IF EXISTS "Admins can update applications" ON investor_applications;

CREATE POLICY "Admins can update investor applications" 
ON investor_applications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verify the policies are working
-- Run these queries to test:
-- SELECT * FROM projects WHERE status = 'pending';
-- SELECT * FROM investor_applications WHERE status = 'pending';
