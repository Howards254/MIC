# Project Donation Implementation Plan

## Focus: Project Donations Only (Platform donations for future)

---

## Implementation Overview

### What We'll Build:
1. Donation button on project pages
2. Simple donation flow
3. Donor recognition system
4. Basic tracking & receipts

### What We Won't Build (Yet):
- Platform donations
- Complex gamification
- Advanced perks system
- Matching campaigns

---

## Phase 1: Database Schema

### New Table: `donations`

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_id TEXT,
  platform_fee DECIMAL(12,2) NOT NULL,
  net_amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add total_donations to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_donations DECIMAL(12,2) DEFAULT 0;

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Anyone can view donations (for transparency)
CREATE POLICY "Anyone can view donations"
  ON donations FOR SELECT
  USING (is_anonymous = FALSE OR auth.uid() = donor_id);

-- Only authenticated users can create donations
CREATE POLICY "Authenticated users can donate"
  ON donations FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

-- Create index
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);

-- Function to update project total_donations
CREATE OR REPLACE FUNCTION update_project_donations()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects 
  SET total_donations = (
    SELECT COALESCE(SUM(net_amount), 0) 
    FROM donations 
    WHERE project_id = NEW.project_id 
    AND payment_status = 'completed'
  )
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update project donations
CREATE TRIGGER update_project_donations_trigger
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_project_donations();
```

---

## Phase 2: UI Components

### 1. Donation Button (on Project Detail Page)

**Location:** Next to "Invest" button

```jsx
<div className="flex gap-4">
  {profile?.role === 'investor' && (
    <Button onClick={() => setIsInvestModalOpen(true)}>
      Invest in This Project
    </Button>
  )}
  <Button 
    variant="outline" 
    onClick={() => setIsDonateModalOpen(true)}
  >
    💚 Donate
  </Button>
</div>
```

### 2. Donation Modal

**Simple, Clean Design:**

```
┌─────────────────────────────────────┐
│  Support [Project Name]             │
├─────────────────────────────────────┤
│                                     │
│  Choose Amount:                     │
│  [$10] [$25] [$50] [$100] [Custom] │
│                                     │
│  Or enter custom amount:            │
│  $ [_____]                          │
│                                     │
│  Your Name: [__________]            │
│  Your Email: [__________]           │
│                                     │
│  Message (optional):                │
│  [________________________]         │
│                                     │
│  ☐ Make my donation anonymous      │
│                                     │
│  Breakdown:                         │
│  • To Project: $47.00               │
│  • Platform Fee (3%): $1.50         │
│  • Payment Processing: $1.50        │
│  • Total: $50.00                    │
│                                     │
│  [Donate $50.00]                    │
│                                     │
│  ✓ Secure payment via Stripe        │
│  ✓ Receipt emailed instantly        │
└─────────────────────────────────────┘
```

### 3. Donors List (on Project Page)

**Show Recent Donors:**

```jsx
<div className="bg-white rounded-lg shadow p-6 mt-6">
  <h3 className="text-xl font-bold mb-4">
    Recent Supporters ({donorCount})
  </h3>
  <div className="space-y-3">
    {recentDonors.map(donor => (
      <div key={donor.id} className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          💚
        </div>
        <div>
          <p className="font-medium">
            {donor.is_anonymous ? 'Anonymous' : donor.donor_name}
          </p>
          <p className="text-sm text-gray-600">
            Donated ${donor.amount} • {timeAgo(donor.created_at)}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 4. Donation Stats (on Project Page)

**Show Impact:**

```jsx
<div className="grid grid-cols-3 gap-4 mb-6">
  <div className="bg-green-50 p-4 rounded-lg">
    <p className="text-2xl font-bold text-green-800">
      ${totalDonations}
    </p>
    <p className="text-sm text-gray-600">Total Donations</p>
  </div>
  <div className="bg-blue-50 p-4 rounded-lg">
    <p className="text-2xl font-bold text-blue-800">
      {donorCount}
    </p>
    <p className="text-sm text-gray-600">Supporters</p>
  </div>
  <div className="bg-purple-50 p-4 rounded-lg">
    <p className="text-2xl font-bold text-purple-800">
      ${avgDonation}
    </p>
    <p className="text-sm text-gray-600">Avg Donation</p>
  </div>
</div>
```

---

## Phase 3: Payment Flow

### Using Stripe Checkout (Simplest)

**Process:**
1. User clicks "Donate $50"
2. Create Stripe Checkout session
3. Redirect to Stripe payment page
4. Stripe processes payment
5. Webhook confirms payment
6. Update database
7. Send thank you email
8. Redirect back to project

**Code Structure:**

```javascript
// Create donation
const handleDonate = async () => {
  const { data: donation } = await supabase
    .from('donations')
    .insert({
      project_id: projectId,
      donor_id: user.id,
      donor_name: donorName,
      donor_email: donorEmail,
      amount: amount,
      platform_fee: amount * 0.03,
      net_amount: amount * 0.97,
      message: message,
      is_anonymous: isAnonymous,
      payment_status: 'pending'
    })
    .select()
    .single();

  // Create Stripe session
  const response = await fetch('/api/create-donation-session', {
    method: 'POST',
    body: JSON.stringify({
      donationId: donation.id,
      amount: amount,
      projectName: projectName
    })
  });

  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe
};
```

---

## Phase 4: Fee Structure

### Recommended: **3% Platform Fee**

**Why 3%?**
- ✅ Fair and transparent
- ✅ Covers payment processing (2.9%)
- ✅ Small margin for platform
- ✅ Lower than competitors (5%)
- ✅ Donors feel good about it

**Breakdown Example ($100 donation):**
```
Donor pays: $100.00
├─ To Project: $97.00 (97%)
├─ Platform Fee: $3.00 (3%)
└─ Stripe Fee: ~$2.90 (paid by platform)

Net to Platform: $0.10 per $100
```

**Alternative: 5% Platform Fee**
```
Donor pays: $100.00
├─ To Project: $95.00 (95%)
├─ Platform Fee: $5.00 (5%)
└─ Stripe Fee: ~$2.90 (paid by platform)

Net to Platform: $2.10 per $100
```

**My Recommendation: Start with 3%, increase to 5% later if needed**

---

## Phase 5: Features

### Must-Have (MVP):
✅ Donation button on project page
✅ Simple donation modal
✅ Stripe payment integration
✅ Donor list (recent 10)
✅ Total donations counter
✅ Thank you email
✅ Receipt email

### Nice-to-Have (V2):
- Recurring donations
- Donation tiers with perks
- Donor badges
- Impact calculator
- Social sharing
- Donation goals/progress bar

### Future (V3):
- Matching campaigns
- Donor dashboard
- Tax receipts
- Advanced analytics
- Donor messaging

---

## Phase 6: User Experience

### For Donors:

**Before Donation:**
- See project details
- Understand impact
- Choose amount easily
- Know where money goes

**During Donation:**
- Quick, simple process
- Secure payment
- Clear fee breakdown
- Optional message

**After Donation:**
- Instant confirmation
- Thank you email
- Receipt for records
- See name on supporters list

### For Project Owners:

**Dashboard Shows:**
- Total donations received
- Number of donors
- Recent donations
- Donor messages
- Download donor list

**They Can:**
- Thank donors
- Send updates
- Track progress
- Export data

---

## Phase 7: Email Templates

### 1. Thank You Email (to Donor)

```
Subject: Thank you for supporting [Project Name]! 💚

Hi [Donor Name],

Thank you for your generous donation of $[Amount] to [Project Name]!

Your support helps [brief impact statement].

Donation Details:
• Amount: $[Amount]
• To Project: $[Net Amount]
• Platform Fee: $[Fee]
• Date: [Date]
• Receipt #: [ID]

[Project Owner Name] says: "[Personal thank you message]"

You can track the project's progress here:
[Project Link]

With gratitude,
The MIC Team

---
This is your donation receipt for tax purposes.
```

### 2. Notification Email (to Project Owner)

```
Subject: You received a new donation! 🎉

Hi [Owner Name],

Great news! [Donor Name] just donated $[Amount] to [Project Name].

Donor Message:
"[Message]"

Total Donations: $[Total]
Number of Supporters: [Count]

Don't forget to thank your supporter!
[Link to send thank you]

Keep up the great work!
The MIC Team
```

---

## Phase 8: Implementation Steps

### Week 1: Database
- [ ] Create donations table
- [ ] Add total_donations to projects
- [ ] Set up RLS policies
- [ ] Create triggers
- [ ] Test queries

### Week 2: Backend
- [ ] Set up Stripe account
- [ ] Create Stripe Checkout endpoint
- [ ] Set up webhook handler
- [ ] Test payment flow
- [ ] Error handling

### Week 3: Frontend
- [ ] Add donate button
- [ ] Create donation modal
- [ ] Build donor list component
- [ ] Add donation stats
- [ ] Responsive design

### Week 4: Integration
- [ ] Connect frontend to backend
- [ ] Test full flow
- [ ] Email templates
- [ ] Error messages
- [ ] Loading states

### Week 5: Testing
- [ ] Test with real payments
- [ ] Test edge cases
- [ ] Security review
- [ ] Performance testing
- [ ] User testing

### Week 6: Launch
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Gather feedback
- [ ] Iterate

---

## Cost Estimate

### Setup Costs:
- Stripe account: Free
- Development time: 40-60 hours
- Testing: 10 hours
- **Total: ~$5K if outsourced, $0 if DIY**

### Ongoing Costs:
- Stripe fees: 2.9% + $0.30 per transaction
- Hosting: Included in current costs
- Email service: $10-50/month
- **Total: ~$20-100/month**

---

## Revenue Projection

### Conservative (Year 1):
- 100 projects on platform
- 20% receive donations
- Average $500 in donations per project
- Total donations: $10,000
- Platform fee (3%): **$300**

### Moderate (Year 2):
- 500 projects
- 30% receive donations
- Average $1,000 per project
- Total donations: $150,000
- Platform fee (3%): **$4,500**

### Optimistic (Year 3):
- 2,000 projects
- 40% receive donations
- Average $2,000 per project
- Total donations: $1,600,000
- Platform fee (3%): **$48,000**

---

## Success Metrics

### Track:
- Total donations processed
- Number of donors
- Average donation amount
- Conversion rate (visitors → donors)
- Repeat donor rate
- Projects with donations
- Donor satisfaction

### Goals:
- **Month 1:** First 10 donations
- **Month 3:** $1,000 total donations
- **Month 6:** $5,000 total donations
- **Year 1:** $10,000 total donations

---

## Risk Mitigation

### Potential Issues:

**1. Low Adoption**
- Solution: Promote feature heavily
- Solution: Incentivize first donors
- Solution: Show social proof

**2. Payment Failures**
- Solution: Clear error messages
- Solution: Multiple payment methods
- Solution: Support team ready

**3. Fraud**
- Solution: Stripe fraud detection
- Solution: Manual review for large amounts
- Solution: Refund policy

**4. Project Owner Complaints**
- Solution: Clear fee disclosure
- Solution: Competitive rates
- Solution: Show value provided

---

## My Recommendation

### Start Simple:

**Phase 1 (Now):**
1. Add donations table
2. Add "Donate" button
3. Simple Stripe integration
4. Basic donor list
5. Thank you emails

**Cost:** $0-2K
**Time:** 2-3 weeks
**Risk:** Low

**Phase 2 (3 months later):**
1. Recurring donations
2. Donation tiers
3. Better analytics
4. Donor dashboard

**Phase 3 (6 months later):**
1. Matching campaigns
2. Advanced features
3. Platform donations

### Why This Works:
- ✅ Quick to implement
- ✅ Low risk
- ✅ Immediate value
- ✅ Easy to iterate
- ✅ Scalable foundation

---

## Ready to Implement?

If you approve this plan, I can:
1. Create the database schema
2. Build the donation modal component
3. Add donate button to project pages
4. Set up basic tracking

**Estimated time: 2-3 weeks for MVP**

What do you think? Should we proceed with this implementation?
