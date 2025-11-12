-- Debug and fix profiles issue

-- 1. Check what's in auth.users
SELECT id, email, created_at FROM auth.users;

-- 2. Check what's in profiles
SELECT * FROM profiles;

-- 3. Check if profiles table exists with correct structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- 4. Fix: Create profiles for all auth users that don't have one
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
  'innovator'
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- 5. Verify profiles were created
SELECT p.id, p.email, p.full_name, p.role, au.email as auth_email
FROM profiles p
FULL OUTER JOIN auth.users au ON p.id = au.id;
