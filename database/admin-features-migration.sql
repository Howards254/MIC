-- =====================================================
-- ADMIN FEATURES MIGRATION
-- Maathai Innovation Catalyst Platform
-- Run this migration to add comprehensive admin management
-- =====================================================

-- =====================================================
-- 1. ADD SUSPENSION FIELDS TO PROFILES TABLE
-- =====================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- =====================================================
-- 2. UPDATE INVESTOR_APPLICATIONS TABLE
-- =====================================================

-- Drop existing constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE public.investor_applications 
    DROP CONSTRAINT IF EXISTS investor_applications_status_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Add new status constraint with suspended option
ALTER TABLE public.investor_applications 
ADD CONSTRAINT investor_applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));

-- Add approval tracking fields
ALTER TABLE public.investor_applications 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- =====================================================
-- 3. CREATE ADMIN AUDIT LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. ADD RLS POLICIES
-- =====================================================

-- Policy for admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for admin audit log
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_log FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;
CREATE POLICY "System can insert audit logs"
    ON public.admin_audit_log FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 5. CREATE ADMIN HELPER FUNCTIONS
-- =====================================================

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_admin_id UUID,
    p_action TEXT,
    p_target_type TEXT,
    p_target_id UUID,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.admin_audit_log (admin_id, action, target_type, target_id, details)
    VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_details)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to change user role (admin only)
CREATE OR REPLACE FUNCTION public.admin_change_user_role(
    p_user_id UUID,
    p_new_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_admin_id UUID;
    v_old_role TEXT;
BEGIN
    -- Get current user ID
    v_admin_id := auth.uid();
    
    -- Check if current user is admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
    
    -- Validate new role
    IF p_new_role NOT IN ('user', 'admin', 'investor', 'innovator') THEN
        RAISE EXCEPTION 'Invalid role: %', p_new_role;
    END IF;
    
    -- Get old role for logging
    SELECT role INTO v_old_role FROM public.profiles WHERE id = p_user_id;
    
    -- Update user role
    UPDATE public.profiles
    SET role = p_new_role, updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log the action
    PERFORM public.log_admin_action(
        v_admin_id,
        'change_role',
        'profile',
        p_user_id,
        jsonb_build_object('old_role', v_old_role, 'new_role', p_new_role)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to suspend/unsuspend user (admin only)
CREATE OR REPLACE FUNCTION public.admin_suspend_user(
    p_user_id UUID,
    p_suspend BOOLEAN,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Get current user ID
    v_admin_id := auth.uid();
    
    -- Check if current user is admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Only admins can suspend users';
    END IF;
    
    -- Require reason when suspending
    IF p_suspend AND (p_reason IS NULL OR p_reason = '') THEN
        RAISE EXCEPTION 'Suspension reason is required';
    END IF;
    
    -- Update user suspension status
    UPDATE public.profiles
    SET 
        is_suspended = p_suspend,
        suspended_at = CASE WHEN p_suspend THEN NOW() ELSE NULL END,
        suspended_by = CASE WHEN p_suspend THEN v_admin_id ELSE NULL END,
        suspension_reason = CASE WHEN p_suspend THEN p_reason ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log the action
    PERFORM public.log_admin_action(
        v_admin_id,
        CASE WHEN p_suspend THEN 'suspend_user' ELSE 'unsuspend_user' END,
        'profile',
        p_user_id,
        jsonb_build_object('reason', p_reason)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve investor application
CREATE OR REPLACE FUNCTION public.admin_approve_investor(
    p_application_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_admin_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user ID
    v_admin_id := auth.uid();
    
    -- Check if current user is admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Only admins can approve investors';
    END IF;
    
    -- Get user_id from application
    SELECT user_id INTO v_user_id
    FROM public.investor_applications
    WHERE id = p_application_id;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Application not found';
    END IF;
    
    -- Update application status
    UPDATE public.investor_applications
    SET 
        status = 'approved',
        approved_by = v_admin_id,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = p_application_id;
    
    -- Update user profile to investor role
    UPDATE public.profiles
    SET 
        role = 'investor',
        is_investor = TRUE,
        updated_at = NOW()
    WHERE id = v_user_id;
    
    -- Log the action
    PERFORM public.log_admin_action(
        v_admin_id,
        'approve_investor',
        'investor_application',
        p_application_id,
        jsonb_build_object('user_id', v_user_id)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject investor application
CREATE OR REPLACE FUNCTION public.admin_reject_investor(
    p_application_id UUID,
    p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Get current user ID
    v_admin_id := auth.uid();
    
    -- Check if current user is admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Only admins can reject investors';
    END IF;
    
    -- Require rejection reason
    IF p_reason IS NULL OR p_reason = '' THEN
        RAISE EXCEPTION 'Rejection reason is required';
    END IF;
    
    -- Update application status
    UPDATE public.investor_applications
    SET 
        status = 'rejected',
        rejected_by = v_admin_id,
        rejected_at = NOW(),
        rejection_reason = p_reason,
        updated_at = NOW()
    WHERE id = p_application_id;
    
    -- Log the action
    PERFORM public.log_admin_action(
        v_admin_id,
        'reject_investor',
        'investor_application',
        p_application_id,
        jsonb_build_object('reason', p_reason)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_suspended ON public.profiles(is_suspended);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_id ON public.admin_audit_log(target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON public.admin_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_change_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_suspend_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_investor TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_investor TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- To create your first admin, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- =====================================================
