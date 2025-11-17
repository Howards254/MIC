# Admin Features Migration Guide

## Overview
This guide will help you apply the admin management features to your existing database.

## Files
- `admin-features-migration.sql` - Adds all admin features
- `admin-features-rollback.sql` - Removes admin features (if needed)

## Prerequisites
✅ Existing database with base schema
✅ Supabase project with SQL Editor access
✅ At least one user account created

## Migration Steps

### Step 1: Backup Your Database
Before running any migration, create a backup:

1. Go to Supabase Dashboard → Database → Backups
2. Create a manual backup
3. Wait for backup to complete

### Step 2: Run the Migration

1. Open Supabase SQL Editor
2. Copy the entire contents of `admin-features-migration.sql`
3. Paste into the SQL Editor
4. Click "Run" or press Ctrl+Enter
5. Wait for execution to complete

**Expected Output:**
```
Success. No rows returned
```

### Step 3: Verify Migration

Run this verification query:

```sql
-- Check if all components were created
SELECT 
    'Tables' as component,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'admin_audit_log'

UNION ALL

SELECT 
    'Functions' as component,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'admin_%'

UNION ALL

SELECT 
    'Indexes' as component,
    COUNT(*) as count
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE '%admin%'

UNION ALL

SELECT 
    'Columns Added' as component,
    COUNT(*) as count
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
AND column_name IN ('is_suspended', 'suspended_at', 'suspended_by', 'suspension_reason');
```

**Expected Results:**
- Tables: 1 (admin_audit_log)
- Functions: 5 (admin functions)
- Indexes: 6 (performance indexes)
- Columns Added: 4 (suspension fields)

### Step 4: Create Your First Admin

Replace `your-email@example.com` with your actual email:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Verify admin was created:

```sql
SELECT id, email, full_name, role 
FROM public.profiles 
WHERE role = 'admin';
```

### Step 5: Test Admin Functions

Test the admin functions work correctly:

```sql
-- Test 1: Check if you can call admin functions
SELECT public.admin_change_user_role(
    (SELECT id FROM profiles WHERE email = 'test-user@example.com'),
    'innovator'
);

-- Test 2: Check audit log was created
SELECT * FROM admin_audit_log 
ORDER BY created_at DESC 
LIMIT 5;
```

## Troubleshooting

### Error: "relation already exists"
**Cause:** Migration was partially run before
**Solution:** Run the rollback migration first, then re-run the migration

```sql
-- Run rollback
\i admin-features-rollback.sql

-- Then run migration again
\i admin-features-migration.sql
```

### Error: "permission denied"
**Cause:** Insufficient database permissions
**Solution:** Ensure you're using the service_role key or have proper permissions

### Error: "function does not exist" (when using admin features)
**Cause:** Functions weren't created properly
**Solution:** Check function creation:

```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'admin_%';
```

If no results, re-run the function creation section of the migration.

### Error: "constraint already exists"
**Cause:** Constraint names conflict
**Solution:** The migration handles this with `DROP CONSTRAINT IF EXISTS`

If issues persist:
```sql
-- Manually drop the constraint
ALTER TABLE investor_applications 
DROP CONSTRAINT IF EXISTS investor_applications_status_check;

-- Then re-run the migration
```

## Rollback Instructions

If you need to remove the admin features:

1. Open Supabase SQL Editor
2. Copy contents of `admin-features-rollback.sql`
3. Paste and run
4. Verify removal:

```sql
-- Should return 0 for all
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name = 'admin_audit_log';

SELECT COUNT(*) FROM information_schema.routines 
WHERE routine_name LIKE 'admin_%';
```

⚠️ **WARNING:** Rollback will delete all audit logs permanently!

## Post-Migration Checklist

- [ ] Migration completed without errors
- [ ] Verification queries show expected counts
- [ ] First admin user created
- [ ] Admin can access `/admin` routes
- [ ] Admin functions are callable
- [ ] Audit logs are being created
- [ ] RLS policies are working (non-admins can't access admin features)

## Testing Admin Features

### Test User Role Changes
```sql
-- As admin, change a user's role
SELECT admin_change_user_role(
    '<user-id>',
    'investor'
);

-- Verify in audit log
SELECT * FROM admin_audit_log 
WHERE action = 'change_role' 
ORDER BY created_at DESC LIMIT 1;
```

### Test User Suspension
```sql
-- Suspend a user
SELECT admin_suspend_user(
    '<user-id>',
    true,
    'Testing suspension feature'
);

-- Check user is suspended
SELECT email, is_suspended, suspension_reason 
FROM profiles 
WHERE id = '<user-id>';

-- Unsuspend
SELECT admin_suspend_user(
    '<user-id>',
    false,
    NULL
);
```

### Test Investor Approval
```sql
-- Create test investor application first
INSERT INTO investor_applications (user_id, investor_type, investment_range)
VALUES (
    '<user-id>',
    'Angel Investor',
    '$10K - $50K'
);

-- Approve it
SELECT admin_approve_investor('<application-id>');

-- Verify user role changed to investor
SELECT email, role, is_investor 
FROM profiles 
WHERE id = '<user-id>';
```

## Security Verification

Verify RLS policies are working:

```sql
-- As non-admin user, this should fail:
SELECT admin_change_user_role('<some-user-id>', 'admin');
-- Expected: ERROR: Only admins can change user roles

-- As non-admin user, this should return 0 rows:
SELECT COUNT(*) FROM admin_audit_log;
-- Expected: 0 (or permission denied)
```

## Performance Considerations

The migration adds several indexes for optimal performance:
- `idx_profiles_role` - Fast role filtering
- `idx_profiles_is_suspended` - Quick suspension checks
- `idx_admin_audit_log_admin_id` - Fast admin action lookup
- `idx_admin_audit_log_target_id` - Quick target lookup
- `idx_admin_audit_log_action` - Efficient action filtering
- `idx_admin_audit_log_created_at` - Chronological queries

Monitor index usage:
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE indexname LIKE '%admin%'
ORDER BY idx_scan DESC;
```

## Maintenance

### Regular Audit Log Cleanup
Audit logs can grow large over time. Consider periodic cleanup:

```sql
-- Delete audit logs older than 90 days
DELETE FROM admin_audit_log 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Monitor Admin Activity
```sql
-- View admin activity summary
SELECT 
    p.email as admin_email,
    a.action,
    COUNT(*) as action_count,
    MAX(a.created_at) as last_action
FROM admin_audit_log a
JOIN profiles p ON p.id = a.admin_id
GROUP BY p.email, a.action
ORDER BY action_count DESC;
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Review Supabase logs for detailed error messages
4. Ensure you're using the latest migration file

## Migration History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-17 | Initial admin features migration |

## Next Steps

After successful migration:
1. Test all admin features in the UI
2. Create additional admin users as needed
3. Review and customize RLS policies if needed
4. Set up monitoring for admin actions
5. Document your admin procedures
