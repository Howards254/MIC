# MIC Platform - Complete Testing Checklist

## Pre-Testing Setup
- [ ] Run `new-platform-schema.sql` in Supabase
- [ ] Run `add-category-column.sql` in Supabase
- [ ] Run `fix-rls-policies.sql` in Supabase
- [ ] Delete all existing users from Supabase Auth
- [ ] Clear browser cache and cookies

## 1. Authentication & Signup

### Innovator Signup
- [ ] Go to `/signup`
- [ ] Select "Innovator" role
- [ ] Fill in name, email, password
- [ ] Accept terms
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check profile created in database

### Investor Signup
- [ ] Sign out
- [ ] Go to `/signup`
- [ ] Select "Investor" role
- [ ] Fill in name, email, password
- [ ] Accept terms
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check profile created in database

### Login
- [ ] Sign out
- [ ] Go to `/signin`
- [ ] Login with innovator account
- [ ] Verify dashboard loads
- [ ] Sign out and login with investor account
- [ ] Verify dashboard loads

## 2. Admin Setup
- [ ] Run SQL: `SELECT make_admin('karolhowards@gmail.com');`
- [ ] Login as admin
- [ ] Verify admin dashboard accessible at `/admin`
- [ ] Check all admin navigation items visible

## 3. Innovator Features

### Submit Project
- [ ] Login as innovator
- [ ] Go to "My Projects"
- [ ] Click "Submit New Project"
- [ ] Fill all required fields:
  - Title
  - Description
  - Category (dropdown)
  - Problem Statement
  - Solution
  - Target Market
  - Business Model
  - Funding Goal
- [ ] Fill optional fields:
  - Timeline
  - Team Size
  - Technology
  - Environmental Impact
- [ ] Submit form
- [ ] Verify redirect to "My Projects"
- [ ] Check project appears with "pending" status

### Edit Project
- [ ] Go to "My Projects"
- [ ] Click "Edit" on a project
- [ ] Modify some fields
- [ ] Click "Save Changes"
- [ ] Verify redirect to "My Projects"
- [ ] Check changes saved

### Delete Project
- [ ] Go to "My Projects"
- [ ] Click "Delete" on a project
- [ ] Confirm deletion
- [ ] Verify project removed from list

### View Investment Offers
- [ ] Go to "Investment Offers"
- [ ] Check page loads without errors
- [ ] Verify empty state shows if no offers

### Messages
- [ ] Go to "Messages" (unified messaging)
- [ ] Check page loads without errors
- [ ] Verify empty state shows if no messages

## 4. Investor Features

### Apply as Investor (If signed up as innovator)
- [ ] Login as innovator
- [ ] Go to "Apply as Investor" in sidebar
- [ ] Fill investor application form
- [ ] Submit
- [ ] Verify success message

### Complete Investor Profile
- [ ] Login as investor
- [ ] Go to "Investor Profile"
- [ ] Fill all fields:
  - Company Name
  - Investment Range
  - Areas of Interest
  - Investment Thesis
  - Min/Max Ticket Size
  - Geographic Focus
- [ ] Save profile
- [ ] Verify success message

### Deposit Funds to Wallet
- [ ] Go to "My Wallet"
- [ ] Click "Deposit Funds"
- [ ] Enter amount (min $10)
- [ ] Submit (simulated payment)
- [ ] Verify balance updated
- [ ] Check transaction appears in history

### Browse Projects
- [ ] Go to "Browse Projects" (links to /explore)
- [ ] Verify approved projects visible
- [ ] Click on a project
- [ ] Check project details page loads

### Invest in Project
- [ ] On project detail page, click "Invest"
- [ ] Enter investment amount
- [ ] Enter equity percentage
- [ ] Write initial message with terms
- [ ] Submit
- [ ] Verify wallet balance deducted
- [ ] Check investment appears in "My Investments"

### View Portfolio
- [ ] Go to "My Investments"
- [ ] Verify invested projects listed
- [ ] Check amounts and equity shown
- [ ] Verify only agreed/signed deals shown

### Messages
- [ ] Go to "Messages"
- [ ] Check conversation created from investment
- [ ] Send message to innovator
- [ ] Verify message appears

## 5. Admin Features

### Approve Projects
- [ ] Login as admin
- [ ] Go to "Approvals"
- [ ] Check pending projects listed
- [ ] Click "View" on a project
- [ ] Click "Approve"
- [ ] Verify project status changes to "approved"
- [ ] Check project now visible on explore page

### Reject Projects
- [ ] Go to "Approvals"
- [ ] Click "Reject" on a project
- [ ] Enter rejection reason
- [ ] Submit
- [ ] Verify project status changes to "rejected"

### Approve Investors
- [ ] Go to "Approvals"
- [ ] Check pending investor applications
- [ ] Click "View" on an investor
- [ ] Click "Approve"
- [ ] Verify investor approved
- [ ] Check investor can now invest

### Reject Investors
- [ ] Go to "Approvals"
- [ ] Click "Reject" on an investor
- [ ] Verify investor profile deleted

### Platform Overview
- [ ] Go to "Platform Overview"
- [ ] Check all stats display correctly:
  - Total Users
  - Total Projects
  - Total Investments
  - Pending Approvals
- [ ] Verify charts and metrics load

### Manage Events
- [ ] Go to "Manage Events"
- [ ] Create new event
- [ ] Edit event
- [ ] Delete event
- [ ] Verify changes saved

### All Users
- [ ] Go to "All Users"
- [ ] Check all users listed
- [ ] Filter by role (innovator, investor, admin)
- [ ] Verify filters work

### All Projects
- [ ] Go to "All Projects"
- [ ] Check all projects listed
- [ ] Verify all statuses shown

## 6. Public Pages

### Homepage
- [ ] Visit `/`
- [ ] Check animated background carousel
- [ ] Verify CTA buttons work
- [ ] Click "View All Projects"
- [ ] Check navigation to explore page

### Explore Projects
- [ ] Visit `/explore`
- [ ] Check approved projects listed
- [ ] Filter by category
- [ ] Search projects
- [ ] Click on a project
- [ ] Verify detail page loads

### Jobs Page
- [ ] Visit `/jobs`
- [ ] Check jobs listed (if any posted)
- [ ] Click on a job
- [ ] Verify "How to Apply" instructions shown
- [ ] Confirm no login required to view

### Events Page
- [ ] Visit `/events`
- [ ] Check events listed
- [ ] Verify event details shown

## 7. Messaging System

### Investor → Innovator
- [ ] Login as investor
- [ ] Invest in a project with message
- [ ] Go to "Messages"
- [ ] Verify conversation created
- [ ] Send additional message
- [ ] Check real-time delivery

### Innovator → Investor
- [ ] Login as innovator
- [ ] Go to "Messages"
- [ ] Open conversation
- [ ] Reply to investor
- [ ] Verify message sent

### Real-time Updates
- [ ] Open messaging in two browser windows
- [ ] Send message from one
- [ ] Verify appears in other without refresh

## 8. Investment Flow

### Complete Flow
- [ ] Investor deposits $10,000
- [ ] Investor invests $5,000 in project
- [ ] Check wallet balance = $5,000
- [ ] Innovator receives investment offer
- [ ] Both negotiate via messages
- [ ] Innovator accepts terms
- [ ] Investment status → "agreed"
- [ ] Project funding goal reached
- [ ] Project status → "funded"
- [ ] Admin creates event
- [ ] Deal signed at event
- [ ] Investment status → "deal_signed"
- [ ] Funds transferred to innovator (simulated)
- [ ] Project removed from explore page

### Disinvestment
- [ ] Investor invests in project
- [ ] Before deal signing, investor disinvests
- [ ] Check funds returned to wallet
- [ ] Verify investment removed

## 9. Error Handling

### Form Validation
- [ ] Try submitting empty forms
- [ ] Verify error messages shown
- [ ] Try invalid email format
- [ ] Try password < 6 characters
- [ ] Try funding goal < $1000

### Insufficient Balance
- [ ] Try investing more than wallet balance
- [ ] Verify error message shown

### Duplicate Submissions
- [ ] Try applying as investor twice
- [ ] Verify error message shown

### Unauthorized Access
- [ ] Try accessing admin pages as user
- [ ] Try editing another user's project
- [ ] Verify redirects or errors

## 10. Database Integrity

### Check Tables
- [ ] Verify all tables exist in Supabase
- [ ] Check RLS policies enabled
- [ ] Verify triggers working

### Check Data
- [ ] Profiles have correct roles
- [ ] Projects have innovator_id
- [ ] Investments linked correctly
- [ ] Messages linked to commitments
- [ ] Wallet balances accurate

## 11. Performance

### Page Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Explore page loads < 3 seconds
- [ ] Messages load < 2 seconds

### Real-time Features
- [ ] Messages appear instantly
- [ ] Wallet updates immediately
- [ ] Investment status changes reflect

## Issues Found

Document any issues here:

1. 
2. 
3. 

## Sign-off

- [ ] All critical features working
- [ ] No blocking bugs found
- [ ] Ready for production

**Tested by:** _______________
**Date:** _______________
**Version:** 2.0
