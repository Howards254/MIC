-- Fix for existing users with old schema
-- Run this AFTER running new-platform-schema.sql

-- First, check if any users exist in auth but not in profiles
DO $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN SELECT id, email FROM auth.users LOOP
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth_user.id) THEN
      -- Create profile with default role 'innovator'
      INSERT INTO profiles (id, email, full_name, role)
      VALUES (
        auth_user.id,
        auth_user.email,
        COALESCE(auth_user.raw_user_meta_data->>'full_name', 'User'),
        'innovator'
      )
      ON CONFLICT (id) DO NOTHING;
      
      RAISE NOTICE 'Created profile for user: %', auth_user.email;
    END IF;
  END LOOP;
END $$;

-- Update any profiles that might have old role values
UPDATE profiles 
SET role = 'innovator' 
WHERE role NOT IN ('innovator', 'investor', 'admin');
