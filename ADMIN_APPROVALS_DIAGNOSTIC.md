# Admin Approvals Diagnostic Guide

## Quick Fix Steps

### Step 1: Run the RLS Policy Fix
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the entire contents of `fix-rls-policies.sql`
4. Click "Run"
5. Wait for "Success" message

### Step 2: Verify You're an Admin
Run this in Supabase SQL Editor:
```sql
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'karolhowards@gmail.com';
```

Expected result: `role` should be `'admin'`

If not admin, run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'karolhowards@gmail.com';
```

### Step 3: Check for Pending Projects
Run this in Supabase SQL Editor:
```sql
SELECT id, title, status, user_id, created_at 
FROM projects 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

This shows if there are actually pending projects in the database.

### Step 4: Test the Admin View
1. Log out of the application
2. Log back in as admin (karolhowards@gmail.com)
3. Go to Admin > Approvals
4. Open browser console (Press F12)
5. Look for these console logs:
   - "Projects Response: ..."
   - "Investors Response: ..."
6. Check if there are any errors in red

### Step 5: Check Console Output

**If you see this:**
```
Projects Response: { data: [], error: null }
```
This means the query worked but returned no results. Either:
- There are no pending projects
- RLS is still blocking access

**If you see this:**
```
Projects Response: { data: null, error: {...} }
```
This means there's an error. Check the error message.

**If you see this:**
```
Projects Response: { data: [{...}, {...}], error: null }
```
Success! Projects are being fetched. If they're not displaying, it's a UI issue.

## Common Issues and Solutions

### Issue 1: "No pending projects" but you just submitted one

**Diagnosis:**
```sql
-- Check if project exists
SELECT * FROM projects WHERE status = 'pending';

-- Check your current user role
SELECT role FROM profiles WHERE id = auth.uid();
```

**Solution:**
Run `fix-rls-policies.sql`

### Issue 2: Console shows error about permissions

**Error message might say:**
- "permission denied for table projects"
- "new row violates row-level security policy"

**Solution:**
1. Run `fix-rls-policies.sql`
2. Make sure you're logged in as admin
3. Clear browser cache and reload

### Issue 3: Projects show in SQL but not in UI

**Diagnosis:**
Check browser console for JavaScript errors

**Solution:**
The data is fetching but not rendering. Check:
1. Is `pendingProjects.length` showing correct count in the header?
2. Are there any React errors in console?

### Issue 4: Can't approve projects (button doesn't work)

**Diagnosis:**
```sql
-- Check if you can update projects
UPDATE projects 
SET status = 'approved' 
WHERE id = 'PROJECT_ID_HERE';
```

**Solution:**
Run `fix-rls-policies.sql` to add UPDATE policy for admins

## Manual Testing

### Test 1: Submit a Project
1. Log in as a regular user (not admin)
2. Go to Dashboard > Submit Project
3. Fill in all fields
4. Submit
5. Note the project title

### Test 2: View as Admin
1. Log out
2. Log in as admin
3. Go to Admin > Approvals
4. Look for the project you just submitted
5. It should appear in "Pending Project Approvals"

### Test 3: Approve Project
1. Click "Approve" button
2. Project should disappear from pending list
3. Go to "Explore Projects" page
4. Your project should now be visible

## SQL Diagnostic Queries

### Check all projects and their status:
```sql
SELECT 
  p.id,
  p.title,
  p.status,
  pr.full_name as owner,
  pr.email,
  p.created_at
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC
LIMIT 10;
```

### Check RLS policies on projects table:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'projects';
```

### Check if RLS is enabled:
```sql
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('projects', 'investor_applications');
```

### Test admin access directly:
```sql
-- First, get your user ID
SELECT auth.uid();

-- Then check if you're admin
SELECT role FROM profiles WHERE id = auth.uid();

-- Try to select pending projects
SELECT * FROM projects WHERE status = 'pending';
```

## Emergency Fix (Temporary)

If nothing works, you can temporarily disable RLS for testing:

```sql
-- TEMPORARY - DO NOT USE IN PRODUCTION
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE investor_applications DISABLE ROW LEVEL SECURITY;
```

Then test if projects show up. If they do, the issue is definitely RLS policies.

**IMPORTANT:** Re-enable RLS after testing:
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_applications ENABLE ROW LEVEL SECURITY;
```

Then run `fix-rls-policies.sql` to fix the policies properly.

## Success Checklist

- [ ] Ran `fix-rls-policies.sql` successfully
- [ ] Verified I'm an admin in profiles table
- [ ] Confirmed pending projects exist in database
- [ ] Logged out and back in as admin
- [ ] Checked browser console for errors
- [ ] Can see pending projects in Admin > Approvals
- [ ] Can approve a project successfully
- [ ] Approved project appears in Explore Projects

## Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Check Supabase logs:**
   - Go to Supabase Dashboard
   - Click on "Logs" in sidebar
   - Look for any errors related to projects table

2. **Verify database connection:**
   - Check `.env` file has correct Supabase URL and key
   - Make sure you're connected to the right project

3. **Clear everything:**
   - Clear browser cache
   - Clear browser cookies
   - Close and reopen browser
   - Log in again

4. **Check the data:**
   ```sql
   -- See exactly what the query returns
   SELECT 
     p.*,
     pr.full_name,
     pr.email
   FROM projects p
   LEFT JOIN profiles pr ON p.user_id = pr.id
   WHERE p.status = 'pending'
   ORDER BY p.created_at DESC;
   ```

5. **Contact support with:**
   - Console error messages
   - SQL query results
   - Your admin email
   - Screenshots of the issue
