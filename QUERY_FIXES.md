# Database Query Fixes

## Issues Fixed

### 1. DonorList.jsx
**Problem:** Querying `status='completed'` on donations table (column doesn't exist)
**Fix:** Removed status filter, added projectId validation
```javascript
// Before
.eq('status', 'completed')

// After
// No status filter, just order by created_at
```

### 2. MessagingCenter.jsx
**Problem:** TypeError when project or profile is null
**Fix:** Added null checks with `maybeSingle()` and filter out null conversations
```javascript
// Before
.single()

// After
.maybeSingle()
// Then filter: conversationsWithDetails.filter(c => c !== null)
```

### 3. EventsPage.jsx
**Problem:** Querying `status` column and `ticket_price` (don't exist in events table)
**Fix:** Use `is_active` instead, remove ticket_price references
```javascript
// Before
.in('status', ['upcoming', 'ongoing'])

// After
.eq('is_active', true)
```

### 4. ProjectDetailPage.jsx (Already Fixed)
**Problem:** Using `user_id`, `status='open'`, `status='completed'`
**Fix:** Changed to `innovator_id`, `is_active=true`, removed status filters

## Root Cause

The errors occurred because components were querying columns that don't exist in the new simplified schema:

### Removed Columns:
- `donations.status` - Donations don't have status
- `jobs.status` - Jobs use `is_active` boolean
- `events.status` - Events use `is_active` boolean
- `events.ticket_price` - Not in schema
- `events.venue_details` - Not in schema
- `projects.user_id` - Changed to `innovator_id`

## Testing Checklist

After these fixes, test:
- [ ] View project detail page - No 400 errors
- [ ] Check donations list - Displays correctly
- [ ] Open messaging center - No TypeError
- [ ] View events page - Loads without errors
- [ ] Edit and save project - Works correctly
- [ ] All pages load without console errors

## Prevention

To prevent similar issues:

1. **Always check schema** before querying
2. **Use `.maybeSingle()`** instead of `.single()` when data might not exist
3. **Add null checks** before accessing nested properties
4. **Test with empty data** to catch null reference errors
5. **Check console** for 400 errors indicating wrong column names

## Schema Reference

### Donations Table
```sql
- id
- project_id
- donor_name
- donor_email
- amount
- platform_fee
- message
- is_anonymous
- payment_method
- payment_reference
- created_at
```

### Jobs Table
```sql
- id
- project_id
- innovator_id
- title
- description
- requirements
- how_to_apply
- location
- job_type
- salary_range
- is_active (boolean)
- created_at
- updated_at
```

### Events Table
```sql
- id
- title
- description
- event_date
- location
- max_attendees
- is_active (boolean)
- created_by
- created_at
- updated_at
```

### Projects Table
```sql
- id
- innovator_id (not user_id!)
- title
- description
- category
- problem_statement
- solution
- target_market
- business_model
- funding_goal
- funds_raised
- total_donations
- status
- rejection_reason
- rejected_at
- rejected_by
- approved_at
- approved_by
- deal_signed_at
- event_id
- timeline
- team_size
- technology
- impact_metrics
- created_at
- updated_at
```

## Status

✅ All query errors fixed
✅ Null safety added
✅ Schema alignment complete
