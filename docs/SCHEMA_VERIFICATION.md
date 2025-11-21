# Schema Verification Checklist

## Critical: Run This SQL First

Before using the platform, execute `complete-schema-updates.sql` in your Supabase SQL Editor:

```sql
-- Add category column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT;
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Add optional project fields
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS technology TEXT,
ADD COLUMN IF NOT EXISTS impact_metrics TEXT;

-- Add rejection reason fields to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_projects_rejected_by ON projects(rejected_by);
```

## Schema Alignment Verified

### ✅ Projects Table
- Uses `innovator_id` (not user_id)
- Has `category` column
- Has optional fields: `timeline`, `team_size`, `technology`, `impact_metrics`
- Has rejection fields: `rejection_reason`, `rejected_at`, `rejected_by`
- Has core fields: `problem_statement`, `solution`, `target_market`, `business_model`

### ✅ Investor Profiles Table
- Uses `user_id` as foreign key to profiles
- Has `sectors_of_interest` as TEXT[]
- Has `min_ticket_size` and `max_ticket_size`
- Has `is_approved` boolean

### ✅ Jobs Table
- Uses `is_active` (not status)
- Has `how_to_apply` field
- No applications table (external applications only)

### ✅ Events Table
- Uses `is_active` (not status)
- No `ticket_price` or `venue_details` columns

### ✅ Donations Table
- No `status` column
- Has `platform_fee` calculated automatically

## Common Errors Fixed

1. **"rejected_at column not found"** - Run complete-schema-updates.sql
2. **"user_id not found in projects"** - Code uses `innovator_id` correctly
3. **"status not found in jobs"** - Code uses `is_active` correctly
4. **"status not found in events"** - Code uses `is_active` correctly
5. **"status not found in donations"** - Removed from queries

## Files Using Correct Schema

- ✅ ProjectDetailPage.jsx - Uses innovator_id, new project fields
- ✅ SubmitProject.jsx - Uses innovator_id, new project fields
- ✅ EditProject.jsx - Auto-resubmits rejected projects
- ✅ MyProjects.jsx - Shows rejection reasons
- ✅ AdminApprovals.jsx - Saves rejection reasons
- ✅ Notifications.jsx - Displays rejection reasons
- ✅ JobsPage.jsx - Uses is_active
- ✅ EventsPage.jsx - Uses is_active
- ✅ DonorList.jsx - No status filter
- ✅ MessagingCenter.jsx - Uses maybeSingle() for null safety
- ✅ InvestorProfile.jsx - Uses user_id correctly
- ✅ ApplyInvestor.jsx - Uses user_id correctly

## Admin Setup

After first signup, make yourself admin:

```sql
SELECT make_admin('karolhowards@gmail.com');
```
