# Project Rejection & Resubmit Feature

## Overview
Innovators can now see why their projects were rejected and fix the issues before resubmitting.

## Implementation

### 1. Database Changes
**File:** `add-rejection-reason.sql`

Added columns to projects table:
- `rejection_reason` TEXT - Admin's explanation
- `rejected_at` TIMESTAMPTZ - When rejected
- `rejected_by` UUID - Admin who rejected

### 2. Admin Rejection Flow
**File:** `AdminApprovals.jsx`

- Admin must provide rejection reason (required)
- Reason saved to database
- Timestamp and admin ID recorded

### 3. Innovator Notification
**File:** `Notifications.jsx`

- Rejected projects appear as notifications
- Shows rejection reason prominently
- "Fix & Resubmit Project" button links to edit page
- Notifications auto-generated from rejected projects

### 4. Project List Display
**File:** `MyProjects.jsx`

- Rejected projects show red alert box with reason
- "Fix & Resubmit" button instead of "Edit"
- Clear instructions to fix and resubmit
- View button hidden for rejected projects

### 5. Auto-Resubmit on Edit
**File:** `EditProject.jsx`

- When editing rejected project:
  - Status automatically changes to 'pending'
  - Rejection reason cleared
  - Rejection metadata cleared
  - Success message: "Project updated and resubmitted for review!"

## User Flow

### Admin Rejects Project
1. Admin clicks "Reject" on pending project
2. Modal opens requiring rejection reason
3. Admin enters detailed reason (e.g., "Missing business model details")
4. Admin clicks "Reject Project"
5. Project status → 'rejected'

### Innovator Sees Rejection
1. Innovator logs in
2. Red notification badge on "Notifications"
3. Opens notifications
4. Sees: "Project Rejected: [Project Title]"
5. Reads rejection reason
6. Clicks "Fix & Resubmit Project"

### Innovator Fixes & Resubmits
1. Edit page opens with current project data
2. Innovator fixes the issues mentioned
3. Clicks "Save Changes"
4. System automatically:
   - Resets status to 'pending'
   - Clears rejection reason
   - Shows success message
5. Project goes back to admin approval queue

### Admin Reviews Again
1. Project appears in pending approvals
2. Admin reviews changes
3. Can approve or reject again with new reason

## Benefits

### For Innovators
- ✅ Clear feedback on what needs fixing
- ✅ Opportunity to improve and resubmit
- ✅ No need to create new project
- ✅ Maintains project history

### For Admins
- ✅ Better communication with innovators
- ✅ Higher quality projects after fixes
- ✅ Reduced duplicate submissions
- ✅ Clear audit trail

### For Platform
- ✅ Improved project quality
- ✅ Better user experience
- ✅ Reduced support requests
- ✅ Transparent process

## Example Rejection Reasons

Good rejection reasons:
- "Missing detailed business model. Please explain how you will generate revenue."
- "Target market section is too vague. Please specify your customer segments."
- "Funding goal seems unrealistic. Please provide a detailed budget breakdown."
- "Environmental impact metrics are unclear. Please quantify your goals."

Bad rejection reasons:
- "Not good enough" ❌
- "Rejected" ❌
- "Try again" ❌

## Testing Checklist

- [ ] Admin can reject project with reason
- [ ] Rejection reason is required (can't be empty)
- [ ] Rejected project shows in innovator's project list
- [ ] Rejection reason displays in red alert box
- [ ] Notification appears for rejected project
- [ ] "Fix & Resubmit" button works
- [ ] Edit page loads with project data
- [ ] After saving, status changes to 'pending'
- [ ] Rejection reason is cleared
- [ ] Project reappears in admin approval queue
- [ ] Admin can see it's a resubmission (check history)

## Database Migration

Run this SQL file:
```bash
psql -U your_user -d your_database -f add-rejection-reason.sql
```

Or in Supabase SQL Editor:
```sql
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_projects_rejected_by ON projects(rejected_by);
```

## Future Enhancements

1. **Email Notifications**
   - Send email when project is rejected
   - Include rejection reason in email

2. **Rejection History**
   - Track all rejection reasons
   - Show improvement over time

3. **Common Rejection Templates**
   - Pre-written rejection reasons
   - Admin can select and customize

4. **Appeal Process**
   - Innovator can appeal rejection
   - Admin reviews appeal

5. **Analytics**
   - Track rejection rates
   - Common rejection reasons
   - Time to resubmit

## Security Considerations

- ✅ Only project owner can edit and resubmit
- ✅ Only admins can reject projects
- ✅ Rejection reason is visible only to project owner
- ✅ RLS policies enforce access control

## Status

✅ **Implemented and Ready for Testing**

---

**Version:** 1.0
**Last Updated:** 2024
**Status:** Complete
