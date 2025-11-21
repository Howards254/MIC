-- =====================================================
-- ADMIN FEATURES ROLLBACK MIGRATION
-- Maathai Innovation Catalyst Platform
-- Run this to UNDO the admin features migration
-- WARNING: This will remove all admin audit logs!
-- =====================================================

-- =====================================================
-- 1. DROP ADMIN FUNCTIONS
-- =====================================================
DROP FUNCTION IF EXISTS public.admin_reject_investor(UUID, TEXT);
DROP FUNCTION IF EXISTS public.admin_approve_investor(UUID);
DROP FUNCTION IF EXISTS public.admin_suspend_user(UUID, BOOLEAN, TEXT);
DROP FUNCTION IF EXISTS public.admin_change_user_role(UUID, TEXT);
DROP FUNCTION IF EXISTS public.log_admin_action(UUID, TEXT, TEXT, UUID, JSONB);

-- =====================================================
-- 2. DROP INDEXES
-- =====================================================
DROP INDEX IF EXISTS public.idx_admin_audit_log_created_at;
DROP INDEX IF EXISTS public.idx_admin_audit_log_action;
DROP INDEX IF EXISTS public.idx_admin_audit_log_target_id;
DROP INDEX IF EXISTS public.idx_admin_audit_log_admin_id;
DROP INDEX IF EXISTS public.idx_profiles_is_suspended;
DROP INDEX IF EXISTS public.idx_profiles_role;

-- =====================================================
-- 3. DROP RLS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- =====================================================
-- 4. DROP ADMIN AUDIT LOG TABLE
-- =====================================================
DROP TABLE IF EXISTS public.admin_audit_log CASCADE;

-- =====================================================
-- 5. REMOVE COLUMNS FROM INVESTOR_APPLICATIONS
-- =====================================================
ALTER TABLE public.investor_applications 
DROP COLUMN IF EXISTS rejected_at,
DROP COLUMN IF EXISTS rejected_by,
DROP COLUMN IF EXISTS approved_at,
DROP COLUMN IF EXISTS approved_by;

-- Restore original status constraint
ALTER TABLE public.investor_applications 
DROP CONSTRAINT IF EXISTS investor_applications_status_check;

ALTER TABLE public.investor_applications 
ADD CONSTRAINT investor_applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- =====================================================
-- 6. REMOVE COLUMNS FROM PROFILES TABLE
-- =====================================================
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS suspension_reason,
DROP COLUMN IF EXISTS suspended_by,
DROP COLUMN IF EXISTS suspended_at,
DROP COLUMN IF EXISTS is_suspended;

-- =====================================================
-- ROLLBACK COMPLETE
-- =====================================================
-- All admin features have been removed from the database
-- =====================================================
