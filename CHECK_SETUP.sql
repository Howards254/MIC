-- Run this in Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if profiles table exists
SELECT 'profiles table' as check_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
       THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- 2. Check profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check what roles are allowed
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%profiles%role%';

-- 4. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- 5. Test if you can insert a user profile
-- (This will fail if table doesn't exist or RLS is blocking)
-- Don't worry about the error, we're just testing

-- If all checks pass, your database is ready!
-- If any fail, you need to run supabase-schema.sql
