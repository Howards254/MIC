# Admin Setup Guide for Karol Howards

## Step 1: Sign Up as Karol

1. Go to http://localhost:5173/signup
2. Fill in:
   - **Full Name:** Karol Howards
   - **Email:** karolhowards@gmail.com
   - **Password:** (choose a secure password)
   - Check terms
3. Click "Sign Up"

## Step 2: Make Yourself Admin

1. Go to Supabase: https://nzmoqwqvejfuycqjliag.supabase.co
2. Click **SQL Editor**
3. Run this command:

```sql
SELECT make_admin('karolhowards@gmail.com');
```

4. You should see: "Success. No rows returned"

## Step 3: Verify Admin Access

Run this to verify:

```sql
SELECT id, email, full_name, role FROM profiles WHERE email = 'karolhowards@gmail.com';
```

You should see:
- email: karolhowards@gmail.com
- full_name: Karol Howards
- role: **admin** ✅

## Step 4: Refresh and Access Admin Panel

1. Refresh your browser (F5)
2. You should now see "Admin Panel" in the sidebar
3. Click "Admin Panel" or go to http://localhost:5173/admin

## What You Can Do as Admin

### 1. View Dashboard Stats
- Total projects on platform
- Pending projects needing approval
- Total approved investors
- Pending investor applications
- Number of platform admins

### 2. Approve/Reject Projects
- See all pending project submissions
- View submitter details (name, email)
- See project details (title, category, funding goal)
- **Approve** - Makes project visible on Explore page
- **Reject** - Provide reason for rejection
- **Tracking** - System records YOU approved/rejected it

### 3. Approve/Reject Investors
- See all pending investor applications
- View applicant details
- See investment range and interests
- **Approve** - Changes user role to "investor", allows them to invest
- **Reject** - Denies application
- **Tracking** - System records YOU made the decision

### 4. Manage Admins
- See list of all platform administrators
- **Add new admins** - Enter email of existing user
- View when each admin was added

### 5. View Approval History
All approvals/rejections show:
- Who approved it (your name)
- When it was approved
- Rejection reasons (if rejected)

## Admin Navigation

Your sidebar will show:
- 📊 Overview - Dashboard stats
- ⚙️ Admin Panel - Approve projects/investors
- 📁 All Projects - View all projects
- 👥 All Users - Manage users
- 💬 Messages - Platform messages

## Testing the Admin Features

### Test 1: Create Demo Users
1. Sign up 2-3 test users with different emails
2. Have them submit projects
3. Have one apply to be an investor

### Test 2: Approve a Project
1. Go to Admin Panel
2. See pending projects
3. Click "Approve" on a project
4. Check that it now appears on /explore page
5. Verify the approval shows your name

### Test 3: Approve an Investor
1. Go to Admin Panel
2. See pending investor applications
3. Click "Approve"
4. That user can now invest in projects

### Test 4: Add Another Admin
1. Sign up a new user
2. In Admin Panel, click "Add Admin"
3. Enter their email
4. They now have admin access

### Test 5: Reject with Reason
1. Click "Reject" on a project
2. Enter reason: "Needs more details about sustainability impact"
3. Submit
4. User will see rejection reason

## Admin Credentials

**Email:** karolhowards@gmail.com  
**Name:** Karol Howards  
**Role:** Admin  
**Access:** Full platform management

## Quick Commands

```sql
-- Make yourself admin
SELECT make_admin('karolhowards@gmail.com');

-- Check your role
SELECT role FROM profiles WHERE email = 'karolhowards@gmail.com';

-- See all admins
SELECT full_name, email, created_at FROM profiles WHERE role = 'admin';

-- See pending approvals
SELECT COUNT(*) FROM projects WHERE status = 'pending';
SELECT COUNT(*) FROM investor_applications WHERE status = 'pending';

-- See who approved what
SELECT p.title, pr.full_name as approved_by, p.reviewed_at 
FROM projects p 
JOIN profiles pr ON p.reviewed_by = pr.id 
WHERE p.status = 'approved';
```

## Important Notes

1. **Same Login** - You log in at /signin like everyone else
2. **Admin Panel** - Only visible to admins in sidebar
3. **Approval Tracking** - Every action is logged with your ID
4. **Add Admins** - Can promote existing users to admin
5. **Full Access** - Can see all projects, users, and data

## Need Help?

If you don't see the Admin Panel:
1. Make sure you ran the make_admin command
2. Refresh your browser (F5)
3. Check your role: `SELECT role FROM profiles WHERE email = 'karolhowards@gmail.com'`
4. Should say 'admin'

---

You're all set! Welcome to the admin team! 🎉
