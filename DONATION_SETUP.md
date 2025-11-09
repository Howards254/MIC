# Donation Feature Setup Guide

## Database Setup

1. **Run the SQL schema**
   ```bash
   # In your Supabase SQL Editor, run:
   donations-schema.sql
   ```

   This will:
   - Create the `donations` table
   - Add `total_donations` column to `projects` table
   - Set up RLS policies
   - Create trigger to auto-update project totals

## Testing the Feature

### 1. Test Donation Flow
- Navigate to any approved project
- Click the "Donate" button
- Select a donation tier or enter custom amount
- Add optional message
- Toggle anonymous option if desired
- Submit donation

### 2. Verify Database Updates
```sql
-- Check donations
SELECT * FROM donations ORDER BY created_at DESC;

-- Check project totals updated
SELECT id, title, total_donations FROM projects WHERE total_donations > 0;
```

### 3. Test Donor List
- Donations should appear in the "Recent Donors" section
- Anonymous donations show as "Anonymous"
- Messages display correctly

## Current Implementation (MVP)

✅ **Completed:**
- Database schema with RLS policies
- Donation modal with tiers ($10-$1000+)
- 3% platform fee calculation
- Donor list with messages
- Donation stats display
- Integration in project cards and detail pages
- Anonymous donation option

⚠️ **Mock Payment (No Stripe Yet):**
- Donations are created directly in database
- Status set to 'completed' immediately
- No actual payment processing

## Next Steps for Production

### 1. Stripe Integration (Required)
```bash
npm install @stripe/stripe-js
```

**Backend Setup:**
- Create Stripe account
- Set up Stripe Connect for project owners
- Implement payment intent API
- Add webhook handlers

**Frontend Updates:**
- Replace mock payment in `DonateModal.jsx`
- Add Stripe Elements for card input
- Handle payment confirmation
- Show loading states during payment

### 2. Email Notifications
- Thank you email to donors
- Notification to project owners
- Receipt generation

### 3. Enhanced Features
- Donation receipts (PDF)
- Recurring donations
- Donation milestones
- Donor badges/recognition tiers
- Tax receipt generation (if applicable)

## Fee Structure

- **Platform Fee:** 3% of donation amount
- **Stripe Fee:** ~2.9% + $0.30 (when integrated)
- **Net to Project:** ~94% of donation

Example:
- Donor gives: $100
- Platform fee: $3
- Stripe fee: ~$3.20
- Project receives: ~$93.80

## Revenue Projections

Based on implementation plan:
- **Year 1:** $300 (10 projects × $100/month × 3%)
- **Year 2:** $4,500 (50 projects × $500/month × 3%)
- **Year 3:** $48,000 (200 projects × $2,000/month × 3%)

## Security Notes

- RLS policies ensure data privacy
- Only completed donations are public
- Donor email only visible to admins and project owners
- Anonymous option hides donor identity
- All amounts validated (minimum $10)

## Support

For issues or questions:
1. Check Supabase logs for errors
2. Verify RLS policies are active
3. Test with different user roles
4. Check browser console for frontend errors
