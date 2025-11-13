# MIC Platform - New Simplified System

## System Architecture

### Three Parties, Two Account Types

1. **Innovators** (Account Required)
   - Submit sustainable project ideas
   - Post job openings
   - Receive investments
   - Negotiate with investors
   - Sign deals at events

2. **Investors** (Account Required)
   - Deposit funds to platform wallet
   - Invest in projects
   - Negotiate terms via messaging
   - Disinvest before deal signing
   - Sign deals at events

3. **Job Seekers** (No Account Needed)
   - Browse job listings
   - View job requirements
   - Follow "how to apply" instructions
   - Apply externally (email, form, etc.)

## User Journey

### Innovator Journey

1. **Signup**
   - Choose "Innovator" role
   - Create account

2. **Submit Project**
   - Fill project details
   - Set funding goal
   - Submit for admin approval

3. **Post Jobs**
   - Create job listing
   - Add requirements
   - Provide "how to apply" instructions

4. **Receive Investments**
   - Get investment offers with messages
   - View in messaging center
   - Negotiate terms

5. **Deal Signing**
   - When funding goal reached
   - Attend scheduled event
   - Sign deal with investors
   - Receive funds within 48 hours

### Investor Journey

1. **Signup**
   - Choose "Investor" role
   - Create account

2. **Complete Profile**
   - Fill investor details form
   - Investment thesis
   - Ticket sizes
   - Submit for admin approval

3. **Deposit Funds**
   - Add money to platform wallet
   - Via Pesaflow payment gateway
   - Track balance

4. **Invest in Projects**
   - Browse approved projects
   - Click "Invest"
   - Enter amount & equity desired
   - Write message with terms
   - Funds deducted from wallet

5. **Negotiate**
   - Message appears in messaging center
   - Chat with innovator
   - Agree on terms
   - Can disinvest anytime before signing

6. **Deal Signing**
   - Attend scheduled event
   - Sign deal with innovator
   - Platform takes 5% fee + 5% equity
   - Cannot disinvest after signing

### Job Seeker Journey

1. **Browse Jobs**
   - Visit jobs page (no login needed)
   - View all active listings

2. **View Details**
   - Read job description
   - Check requirements
   - See salary range

3. **Apply**
   - Follow "how to apply" instructions
   - Email resume, fill form, etc.
   - No account needed

## Investment Flow Details

### Step-by-Step Process

```
1. Investor Deposits → Platform Wallet
   ├─ Via Pesaflow gateway
   ├─ Balance tracked in investor_wallets table
   └─ Can deposit anytime

2. Investor Commits to Project
   ├─ Selects project
   ├─ Enters amount & equity %
   ├─ Writes initial message with terms
   ├─ Funds deducted from wallet
   └─ Held by platform (not sent to innovator yet)

3. Negotiation Phase
   ├─ Message appears in messaging center
   ├─ Both parties chat in real-time
   ├─ Negotiate equity, terms, milestones
   ├─ Investor can disinvest (funds returned to wallet)
   └─ When agreed, status → 'agreed'

4. Funding Goal Reached
   ├─ Project status → 'funded'
   ├─ Project waits for event day
   └─ No new investments accepted

5. Event Day - Deal Signing
   ├─ Both parties attend event
   ├─ Sign legal agreement
   ├─ Platform takes 5% transaction fee
   ├─ Platform gets 5% equity in startup
   └─ Status → 'deal_signed'

6. Fund Disbursement
   ├─ Within 48 hours of signing
   ├─ Funds transferred to innovator account
   ├─ Investor cannot disinvest anymore
   └─ Project removed from explore page
```

## Database Structure

### Core Tables

1. **profiles**
   - All users (innovators, investors, admins)
   - Role chosen at signup

2. **investor_profiles**
   - Extended info for investors
   - Requires admin approval

3. **investor_wallets**
   - Tracks each investor's balance
   - Auto-created when investor profile created

4. **investor_wallet_transactions**
   - All deposits, investments, disinvestments
   - Audit trail

5. **projects**
   - Submitted by innovators
   - Requires admin approval
   - Tracks funding progress

6. **investment_commitments**
   - Links investor to project
   - Tracks amount, equity, status
   - Calculates platform fees

7. **messages**
   - Unified messaging system
   - Linked to investment commitments
   - Real-time via Supabase subscriptions

8. **jobs**
   - Posted by innovators
   - No applications table
   - Shows "how_to_apply" instructions

9. **donations**
   - Separate from investments
   - 2% platform fee
   - Anyone can donate

10. **events**
    - Deal signing events
    - Created by admin
    - Projects linked to events

## Monetization Model

### Revenue Streams

1. **Investment Fees (5%)**
   - Charged on every investment
   - Deducted when funds disbursed
   - Example: $10,000 investment → $500 fee

2. **Platform Equity (5%)**
   - 5% equity in every funded startup
   - Negotiated at deal signing
   - Long-term value creation

3. **Donation Fees (2%)**
   - Charged on all donations
   - Example: $100 donation → $2 fee

### Fee Calculation

```javascript
// Investment
const investmentAmount = 10000;
const platformFee = investmentAmount * 0.05; // $500
const platformEquity = 5; // 5%

// Donation
const donationAmount = 100;
const donationFee = donationAmount * 0.02; // $2
```

## Key Features

### For Innovators
- ✅ Submit projects (admin approval)
- ✅ Post jobs with custom application process
- ✅ Receive investment offers
- ✅ Negotiate via messaging
- ✅ Accept donations
- ✅ Track funding progress
- ✅ Sign deals at events

### For Investors
- ✅ Deposit funds to wallet
- ✅ Track balance in real-time
- ✅ Invest in multiple projects
- ✅ Negotiate terms via messaging
- ✅ Disinvest before deal signing
- ✅ Portfolio tracking
- ✅ Transaction history

### For Job Seekers
- ✅ Browse jobs without account
- ✅ View all details
- ✅ Apply via external process
- ✅ No platform fees

### For Admins
- ✅ Approve projects
- ✅ Approve investors
- ✅ Create events
- ✅ Monitor all activity
- ✅ Platform analytics

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admins have elevated permissions

### Role-Based Access
- Innovators: Submit projects, post jobs
- Investors: Invest, message
- Admins: Approve, manage

### Payment Security
- Funds held by platform
- Pesaflow gateway integration
- Audit trail for all transactions

## Technical Stack

- **Frontend:** React 18, React Router 7
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **Payments:** Pesaflow (to be integrated)
- **Icons:** Lucide React
- **Build:** Vite

## API Integration Points

### Pesaflow Payment Gateway

```javascript
// Deposit funds
POST /api/pesaflow/deposit
{
  investor_id: uuid,
  amount: number,
  currency: 'USD'
}

// Disburse funds to innovator
POST /api/pesaflow/disburse
{
  innovator_id: uuid,
  amount: number,
  reference: string
}

// Webhook for payment confirmation
POST /api/pesaflow/webhook
{
  transaction_id: string,
  status: 'success' | 'failed',
  amount: number
}
```

## Deployment Checklist

- [ ] Run new-platform-schema.sql on Supabase
- [ ] Create admin account
- [ ] Test signup for both roles
- [ ] Test investment flow
- [ ] Test messaging system
- [ ] Integrate Pesaflow API
- [ ] Set up webhooks
- [ ] Configure email notifications
- [ ] Deploy frontend
- [ ] Monitor for errors

## Future Enhancements

1. **Phase 2**
   - Email notifications
   - File uploads (project images, documents)
   - Advanced analytics dashboard

2. **Phase 3**
   - Mobile app
   - Investor messaging system
   - Project milestone tracking
   - Video pitches

3. **Phase 4**
   - AI-powered project matching
   - Automated due diligence
   - Secondary market for equity
   - International payments

## Support & Documentation

- **Setup Guide:** See MIGRATION_GUIDE.md
- **Database Schema:** See new-platform-schema.sql
- **Admin Email:** karolhowards@gmail.com

---

**Version:** 2.0
**Last Updated:** 2024
**Status:** Ready for Implementation
