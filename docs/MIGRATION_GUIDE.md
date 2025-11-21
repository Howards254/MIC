# MIC Platform - Migration Guide

## Overview
This guide covers the migration from the old complex system to the new simplified platform with role-based signup and unified messaging.

## Key Changes

### 1. User Roles
**OLD:** Users, Investors, Job Seekers (3 separate account types)
**NEW:** Innovators, Investors (2 account types chosen at signup)

- Job seekers no longer need accounts
- Users choose role during signup: Innovator or Investor
- Admins are created via SQL command

### 2. Investment Flow
**OLD:** Complex negotiation system with separate tables
**NEW:** Simplified wallet-based system

**New Flow:**
1. Investor deposits funds to platform wallet (via Pesaflow)
2. Investor commits funds to project + sends initial message
3. Funds deducted from wallet and held by platform
4. Both parties negotiate in unified messaging center
5. When agreed, project waits for event day
6. At event, deal is signed (5% platform fee + 5% equity)
7. Within 48 hours, funds transferred to innovator
8. Investor can disinvest anytime before signing

### 3. Job System
**OLD:** Job applications stored in database
**NEW:** No applications - just instructions

- Jobs show "how_to_apply" field with instructions
- Job seekers follow instructions (email, form link, etc.)
- No account needed to view jobs
- Innovators manage applications externally

### 4. Messaging
**OLD:** Separate negotiation messages
**NEW:** Unified messaging center

- All investment-related communication in one place
- Real-time messaging with Supabase subscriptions
- Initial investment message auto-creates conversation
- Messages linked to investment commitments

## Database Migration Steps

### Step 1: Backup Current Database
```sql
-- Export your current data before migration
pg_dump your_database > backup_before_migration.sql
```

### Step 2: Run New Schema
```bash
# Run the new schema file
psql -U your_user -d your_database -f new-platform-schema.sql
```

This will:
- Drop old tables (profiles, projects, jobs, etc.)
- Create new simplified tables
- Set up RLS policies
- Create triggers and functions

### Step 3: Make Admin Account
```sql
-- After first signup, make yourself admin
SELECT make_admin('karolhowards@gmail.com');
```

### Step 4: Update Environment Variables
No changes needed to `.env` file - same Supabase credentials work.

## Code Changes

### Files Created
1. `new-platform-schema.sql` - Complete new database schema
2. `src/pages/dashboard/InvestorWallet.jsx` - Wallet management
3. `src/pages/dashboard/MessagingCenter.jsx` - Unified messaging
4. `src/components/investments/InvestmentModal.jsx` - New investment flow

### Files Modified
1. `src/pages/SignUpPage.jsx` - Added role selection
2. `src/pages/JobsPage.jsx` - Removed applications, show instructions

### Files to Update (Next Steps)
1. `src/components/layout/DashboardLayout.jsx` - Update navigation based on role
2. `src/pages/dashboard/DashboardOverview.jsx` - Role-specific dashboard
3. `src/pages/ProjectDetailPage.jsx` - Add investment button
4. `src/pages/dashboard/MyProjects.jsx` - Show investment offers
5. `src/App.jsx` - Add new routes

## New Routes Needed

```jsx
// In App.jsx
<Route path="/dashboard/wallet" element={<InvestorWallet />} />
<Route path="/dashboard/messages" element={<MessagingCenter />} />
```

## Payment Integration

### Pesaflow Setup
The platform uses Pesaflow for payment processing:

1. **Deposits:** Investors deposit to platform account
2. **Tracking:** Platform tracks each investor's balance
3. **Disbursement:** After deal signing, funds sent to innovator

**TODO:** Integrate Pesaflow API
- Deposit endpoint
- Webhook for payment confirmation
- Disbursement API

## Testing Checklist

### Signup & Authentication
- [ ] Signup as Innovator
- [ ] Signup as Investor
- [ ] Login works for both roles
- [ ] Admin can be created via SQL

### Innovator Flow
- [ ] Submit project
- [ ] Admin approves project
- [ ] Post job with "how to apply" instructions
- [ ] Receive investment offers
- [ ] View messages from investors
- [ ] Negotiate terms
- [ ] Accept/reject offers

### Investor Flow
- [ ] Complete investor profile form
- [ ] Admin approves investor
- [ ] Deposit funds to wallet
- [ ] View wallet balance
- [ ] Invest in project with message
- [ ] Negotiate in messaging center
- [ ] Disinvest before deal signing
- [ ] Cannot disinvest after signing

### Job Seeker Flow (No Account)
- [ ] Browse jobs without login
- [ ] View job details
- [ ] See "how to apply" instructions
- [ ] Follow external application process

### Admin Flow
- [ ] Approve projects
- [ ] Approve investors
- [ ] Create events
- [ ] Monitor platform activity

## Data Migration (If Needed)

If you have existing data to migrate:

```sql
-- Example: Migrate existing users to new roles
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, full_name, 
  CASE 
    WHEN role = 'user' THEN 'innovator'
    WHEN role = 'investor' THEN 'investor'
    ELSE 'innovator'
  END
FROM old_profiles;

-- Migrate projects
INSERT INTO projects (id, innovator_id, title, description, funding_goal, status)
SELECT id, innovator_id, title, description, funding_goal, status
FROM old_projects;
```

## Rollback Plan

If migration fails:

```sql
-- Restore from backup
psql -U your_user -d your_database < backup_before_migration.sql
```

## Support

For issues during migration:
1. Check Supabase logs for RLS policy errors
2. Verify all triggers are created
3. Test with fresh signup before migrating data
4. Contact: karolhowards@gmail.com

## Next Steps After Migration

1. **Payment Integration:** Set up Pesaflow API
2. **Email Notifications:** Investment offers, deal agreements
3. **File Uploads:** Project images, documents
4. **Event Management:** RSVP system for deal signing events
5. **Analytics Dashboard:** Platform metrics for admin

## Important Notes

- **No Data Loss:** Old system can be backed up before migration
- **Clean Start:** Recommended to start fresh with new schema
- **Testing:** Test thoroughly in development before production
- **Gradual Rollout:** Can run both systems in parallel during transition

---

**Migration Date:** TBD
**Estimated Downtime:** 1-2 hours
**Rollback Time:** 30 minutes if needed
