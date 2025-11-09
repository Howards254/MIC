-- Make Karol Howards an admin
-- Run this in Supabase SQL Editor

SELECT make_admin('karolhowards@gmail.com');

-- Verify admin status
SELECT id, email, full_name, role FROM profiles WHERE email = 'karolhowards@gmail.com';

-- You should see:
-- email: karolhowards@gmail.com
-- full_name: Karol Howards
-- role: admin
