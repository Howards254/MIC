# Admin Role Management Features

## Overview
This document describes the comprehensive admin management system implemented in the Maathai Innovation Catalyst platform. The admin role has full control over user management, investor approvals, and platform operations.

## Database Schema Changes

### 1. Profiles Table Enhancements
Added the following fields to the `profiles` table:
- `is_suspended` (BOOLEAN): Indicates if a user is suspended
- `suspended_at` (TIMESTAMPTZ): Timestamp of suspension
- `suspended_by` (UUID): Reference to admin who suspended the user
- `suspension_reason` (TEXT): Reason for suspension

### 2. Investor Applications Table Updates
Enhanced the `investor_applications` table:
- Updated status enum to include: `'pending'`, `'approved'`, `'rejected'`, `'suspended'`
- Added `approved_by` (UUID): Reference to admin who approved
- Added `approved_at` (TIMESTAMPTZ): Timestamp of approval
- Added `rejected_by` (UUID): Reference to admin who rejected
- Added `rejected_at` (TIMESTAMPTZ): Timestamp of rejection

### 3. Admin Audit Log Table (NEW)
Created a comprehensive audit log table to track all admin actions:
```sql
CREATE TABLE public.admin_audit_log (
    id UUID PRIMARY KEY,
    admin_id UUID NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ
);
```

## Admin Functions

### 1. `admin_change_user_role(p_user_id, p_new_role)`
Changes a user's role to any of: `'user'`, `'innovator'`, `'investor'`, `'admin'`
- **Security**: Only admins can execute
- **Logging**: Automatically logs the action
- **Returns**: Boolean success status

### 2. `admin_suspend_user(p_user_id, p_suspend, p_reason)`
Suspends or unsuspends a user account
- **Parameters**:
  - `p_user_id`: Target user ID
  - `p_suspend`: TRUE to suspend, FALSE to unsuspend
  - `p_reason`: Reason for suspension (required when suspending)
- **Security**: Only admins can execute
- **Logging**: Automatically logs the action
- **Returns**: Boolean success status

### 3. `admin_approve_investor(p_application_id)`
Approves an investor application
- **Actions**:
  - Updates application status to 'approved'
  - Changes user role to 'investor'
  - Sets `is_investor` flag to TRUE
  - Records approval timestamp and admin ID
- **Security**: Only admins can execute
- **Logging**: Automatically logs the action
- **Returns**: Boolean success status

### 4. `admin_reject_investor(p_application_id, p_reason)`
Rejects an investor application
- **Parameters**:
  - `p_application_id`: Application ID
  - `p_reason`: Reason for rejection
- **Security**: Only admins can execute
- **Logging**: Automatically logs the action
- **Returns**: Boolean success status

### 5. `log_admin_action(p_admin_id, p_action, p_target_type, p_target_id, p_details)`
Internal function to log all admin actions
- **Returns**: UUID of the created log entry

## Admin UI Features

### 1. All Users Management (`/admin/all-users`)
**Features**:
- View all users with filtering by role (all, user, innovator, investor, admin)
- Display user status (Active/Suspended)
- Change user roles with modal interface
- Suspend/unsuspend users with reason tracking
- Visual indicators for suspended accounts
- Prevent admins from modifying their own account

**Actions Available**:
- **Change Role**: Click "Role" button to open role selection modal
- **Suspend User**: Click "Suspend" button, provide reason
- **Unsuspend User**: Click "Unsuspend" button (shows previous suspension reason)

### 2. Enhanced Approvals (`/admin/approvals`)
**Features**:
- Approve/reject project submissions
- Approve/reject investor applications using new database functions
- Add new administrators by email
- View all current administrators
- Detailed view modals for projects and investor applications

**Improvements**:
- Uses `admin_approve_investor()` function for proper role assignment
- Uses `admin_reject_investor()` function with reason tracking
- Uses `admin_change_user_role()` for adding new admins

### 3. Audit Log Viewer (`/admin/audit-log`)
**Features**:
- View all administrative actions in chronological order
- Filter by action type:
  - Change Role
  - Suspend User
  - Unsuspend User
  - Approve Investor
  - Reject Investor
- Display admin who performed action
- Show target type and details
- Color-coded action badges
- Timestamp with date and time

## Row Level Security (RLS)

### Admin-Specific Policies
1. **Profiles Table**:
   - Admins can update any profile (in addition to users updating their own)

2. **Admin Audit Log**:
   - Only admins can view audit logs
   - System can insert logs (for function execution)

3. **All Tables**:
   - Admins have elevated permissions for viewing, updating, and deleting records

## Migration Instructions

### Running the Migration
1. Open your Supabase SQL Editor
2. Copy the entire contents of `/database/complete-schema-with-rls.sql`
3. Execute the SQL script
4. Verify all tables, functions, and policies are created

### Creating the First Admin
After running the migration, you need to create your first admin user:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Verifying the Setup
Check that all components are in place:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'investor_applications', 'admin_audit_log');

-- Check functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'admin_%';

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE '%admin%';
```

## Admin Capabilities Summary

### User Management
✅ View all users with filtering
✅ Change any user's role
✅ Suspend/unsuspend users with reason tracking
✅ View user suspension history
✅ Prevent self-modification

### Investor Management
✅ Approve investor applications
✅ Reject investor applications with reasons
✅ Automatically assign investor role on approval
✅ Track approval/rejection metadata

### Project Management
✅ View all projects (pending, approved, rejected)
✅ Approve/reject project submissions
✅ Delete projects
✅ View project details

### Platform Administration
✅ Promote users to admin role
✅ Manage events
✅ Send platform notifications
✅ Manage blog posts
✅ View comprehensive audit logs

### Audit & Compliance
✅ All admin actions are logged
✅ Audit log includes admin identity, action, target, and details
✅ Filterable audit log viewer
✅ Immutable audit trail

## Security Considerations

1. **Function Security**: All admin functions use `SECURITY DEFINER` and verify admin role
2. **RLS Policies**: Comprehensive row-level security prevents unauthorized access
3. **Audit Trail**: All admin actions are logged for accountability
4. **Self-Protection**: Admins cannot modify their own accounts in user management
5. **Reason Tracking**: Suspensions and rejections require documented reasons

## Best Practices

1. **Always provide clear reasons** when suspending users or rejecting applications
2. **Review audit logs regularly** to monitor admin activity
3. **Use role changes judiciously** - verify user identity before promoting to admin
4. **Document major decisions** in the suspension/rejection reasons
5. **Keep admin count minimal** - only promote trusted users to admin role

## Troubleshooting

### Function Not Found Error
If you get "function does not exist" errors:
```sql
-- Re-run the function creation section from the migration
-- Check function exists:
SELECT * FROM pg_proc WHERE proname LIKE 'admin_%';
```

### Permission Denied Error
If admins can't perform actions:
```sql
-- Verify user is actually an admin:
SELECT id, email, role FROM profiles WHERE role = 'admin';

-- Check RLS policies:
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Audit Log Not Recording
```sql
-- Check if audit log table exists and is accessible:
SELECT COUNT(*) FROM admin_audit_log;

-- Verify log function works:
SELECT log_admin_action(
    auth.uid(), 
    'test_action', 
    'test_type', 
    NULL, 
    '{"test": "data"}'::jsonb
);
```

## Future Enhancements

Potential additions to the admin system:
- Bulk user operations
- Advanced filtering and search
- Export audit logs to CSV
- Email notifications for admin actions
- Two-factor authentication for admin accounts
- Admin role hierarchy (super admin, moderator, etc.)
- Scheduled reports on platform activity
