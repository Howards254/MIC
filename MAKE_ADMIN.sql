-- Run this command in Supabase SQL Editor after you sign up
-- Replace 'your-email@example.com' with the email you used to sign up

SELECT make_admin('your-email@example.com');

-- You should see: "Success. No rows returned"
-- Refresh your app and you'll now have admin access!

-- To verify you're an admin, run:
SELECT id, email, full_name, role FROM profiles WHERE email = 'your-email@example.com';

-- You should see role = 'admin'
