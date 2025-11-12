-- Fix RLS policies for profiles table

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Recreate with correct policies
CREATE POLICY "profiles_select_policy" ON profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON profiles 
  FOR DELETE 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
