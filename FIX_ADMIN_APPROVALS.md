# Fix Admin Approvals - Pending Projects Not Showing

## Problem
Pending projects are not appearing in the Admin > Approvals page, preventing admins from approving them.

## Root Cause
The issue is likely due to Row Level Security (RLS) policies not allowing admins to view all projects. By default, RLS policies might only allow users to see their own projects.

## Solution

### Step 1: Run the SQL Fix
Run the contents of `fix-admin-permissions.sql` in your Supabase SQL Editor.

This will:
1. Allow admins to view ALL projects (not just their own)
2. Allow admins to update ALL projects (for approvals)
3. Allow admins to view ALL investor applications
4. Allow admins to update ALL investor applications
5. Allow admins to update user roles (to make users investors)

### Step 2: Verify Your Admin Status
Make sure you're actually an admin:

```sql
-- Check your role
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'karolhowards@gmail.com';

-- If not admin, make yourself admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'karolhowards@gmail.com';
```

### Step 3: Check for Pending Projects
Verify there are actually pending projects:

```sql
-- Check for pending projects
SELECT id, title, status, user_id, created_at 
FROM projects 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Check for pending investor applications
SELECT id, company_name, status, user_id, created_at 
FROM investor_applications 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Step 4: Test the Fix
1. Log out and log back in as admin
2. Go to Admin > Approvals
3. Check browser console (F12) for any errors
4. You should see console logs showing the data being fetched
5. Pending projects should now appear

## Additional Improvements Made

### 1. Added Console Logging
The AdminApprovals page now logs:
- Projects response
- Investors response
- Any errors that occur

Check your browser console (F12 > Console tab) to see what's happening.

### 2. Auto-Create Investor Profiles
When an admin approves an investor application:
- User role is changed to 'investor'
- Investor profile is automatically created
- Profile includes all application details
- Profile becomes visible in "Browse Investors"

## Debugging Steps

If projects still don't show:

### 1. Check Browser Console
Open browser console (F12) and look for:
```
Projects Response: { data: [...], error: null }
```

If you see an error, it will tell you what's wrong.

### 2. Check RLS Policies
Run this to see all policies on projects table:
```sql
SELECT * FROM pg_policies WHERE tablename = 'projects';
```

### 3. Test Direct Query
Try querying as admin in Supabase:
```sql
-- This should return pending projects
SELECT * FROM projects WHERE status = 'pending';
```

### 4. Check Admin Role
Make absolutely sure you're an admin:
```sql
SELECT role FROM profiles WHERE id = auth.uid();
```

## Common Issues

### Issue 1: "No pending projects" but there are projects
**Cause:** RLS policies blocking admin access
**Fix:** Run `fix-admin-permissions.sql`

### Issue 2: Error in console about permissions
**Cause:** Missing RLS policies for admins
**Fix:** Run `fix-admin-permissions.sql`

### Issue 3: Can see projects but can't approve
**Cause:** Missing UPDATE policy for admins
**Fix:** Run `fix-admin-permissions.sql`

### Issue 4: Not actually an admin
**Cause:** Role not set correctly
**Fix:** Run the make_admin function or UPDATE query

## Testing Checklist

After applying the fix:

- [ ] Run `fix-admin-permissions.sql` in Supabase
- [ ] Verify you're an admin (check profiles table)
- [ ] Log out and log back in
- [ ] Go to Admin > Approvals
- [ ] Check browser console for logs
- [ ] Verify pending projects appear
- [ ] Try approving a project
- [ ] Verify project status changes to 'approved'
- [ ] Try approving an investor
- [ ] Verify user role changes to 'investor'
- [ ] Verify investor profile is created
- [ ] Check "Browse Investors" to see new investor

## Prevention

To prevent this issue in the future:

1. Always create admin policies when creating new tables
2. Test with different user roles (user, investor, admin)
3. Check RLS policies are working as expected
4. Use console logging to debug data fetching issues

## SQL Reference

### View all RLS policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Disable RLS temporarily (for testing only):
```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- Remember to re-enable after testing!
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

### Check if RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## Support

If the issue persists after following these steps:

1. Check the browser console for specific error messages
2. Verify the SQL was executed successfully
3. Make sure you're logged in as the correct admin user
4. Try clearing browser cache and cookies
5. Check Supabase logs for any backend errors
