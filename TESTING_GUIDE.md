# Testing Guide - MIC Platform

## 🧪 Complete Testing Workflow

Follow this guide to test all features of the platform.

## Setup (5 minutes)

1. Complete the setup from QUICKSTART.md
2. Make yourself an admin using MAKE_ADMIN.sql
3. Open the app in your browser

## Test 1: Innovator Flow (10 minutes)

### Create Innovator Account
1. Click "Sign Up"
2. Fill in:
   - Full Name: "Sarah Johnson"
   - Email: "sarah@example.com"
   - Password: "password123"
   - Role: **Innovator**
   - Check terms
3. Click "Sign Up"

### Submit a Project
1. You should be on the Dashboard
2. Click "Submit New Project"
3. Fill in:
   - Title: "Bamboo Composite Building Materials"
   - Description: "Revolutionary building materials made from sustainable bamboo"
   - Funding Goal: 100000
   - Timeline: "12 months"
   - Team Size: 5
   - Category: "Building Materials"
4. Click "Submit"
5. You should see the project with status "pending"

### Sign Out
1. Click "Sign Out" in navbar

## Test 2: Admin Approval (5 minutes)

### Sign In as Admin
1. Click "Sign In"
2. Use your admin email and password
3. Click "Sign In"

### Approve the Project
1. Click "Admin" in navbar
2. You should see "Pending Project Approvals (1)"
3. Find Sarah's project
4. Click "Approve"
5. The project should disappear from pending list

### Sign Out
1. Click "Sign Out"

## Test 3: Investor Flow (15 minutes)

### Create Investor Account
1. Click "Sign Up"
2. Fill in:
   - Full Name: "Michael Chen"
   - Email: "michael@example.com"
   - Password: "password123"
   - Role: **Investor**
3. Click "Sign Up"

### Apply to Become Investor
1. You should see "Become an Approved Investor" card
2. Click "Apply Now"
3. Fill in:
   - Company Name: "Green Ventures LLC"
   - Investment Range: "$50,000 - $500,000"
   - Areas of Interest: "Building Materials, Packaging, Textiles"
   - LinkedIn: "https://linkedin.com/in/michaelchen"
   - Website: "https://greenventures.com"
   - Reason: "I'm passionate about sustainable alternatives and want to support innovative startups"
4. Click "Submit"
5. You should see "Application Pending"

### Sign Out
1. Click "Sign Out"

### Approve Investor (as Admin)
1. Sign in with your admin account
2. Go to Admin panel
3. You should see "Pending Investor Approvals (1)"
4. Find Michael's application
5. Click "Approve"
6. Sign out

### Make Investment (as Investor)
1. Sign in as Michael (michael@example.com)
2. Click "Explore Projects" in navbar
3. You should see Sarah's bamboo project
4. Click on the project
5. Click "Invest in This Project"
6. Enter amount: 25000
7. Add message: "Excited to support this innovative project!"
8. Click "Confirm Investment"
9. Go back to project page
10. You should see "Funds Raised: $25,000"

### Sign Out
1. Click "Sign Out"

## Test 4: Job Posting (10 minutes)

### Post a Job (as Innovator)
1. Sign in as Sarah (sarah@example.com)
2. Go to Dashboard
3. Your project should now show $25,000 raised
4. Click on "Explore Projects"
5. Click on your project
6. Click "Post a Job"
7. Fill in:
   - Job Title: "Materials Engineer"
   - Description: "We're looking for an experienced materials engineer to help develop our bamboo composite technology"
   - Location: "San Francisco, CA"
   - Job Type: "Full-time"
   - Salary Range: "$80,000 - $120,000"
   - Requirements (one per line):
     ```
     Bachelor's degree in Materials Science or related field
     5+ years experience in composite materials
     Knowledge of sustainable materials
     ```
   - Responsibilities (one per line):
     ```
     Lead materials research and development
     Test and validate bamboo composite prototypes
     Collaborate with manufacturing team
     ```
8. Click "Post Job"
9. Sign out

## Test 5: Job Application (10 minutes)

### Create Job Seeker Account
1. Click "Sign Up"
2. Fill in:
   - Full Name: "Emily Rodriguez"
   - Email: "emily@example.com"
   - Password: "password123"
   - Role: **Job Seeker**
3. Click "Sign Up"

### Apply to Job
1. Click "Jobs" in navbar
2. You should see "Materials Engineer" position
3. Review the job details
4. Click "Apply Now"
5. Fill in:
   - Resume URL: "https://drive.google.com/resume-emily"
   - Cover Letter: "I'm excited to apply for this position. With 7 years of experience in materials science and a passion for sustainability, I believe I'm a perfect fit for your team."
6. Click "Submit Application"
7. You should see "Application submitted successfully!"

### Check Application Status
1. Click "Dashboard"
2. You should see your application listed
3. Status should be "pending"

### Sign Out
1. Click "Sign Out"

## Test 6: Review Application (as Innovator)

1. Sign in as Sarah (sarah@example.com)
2. Go to your project detail page
3. You should see the job listing
4. (Note: Full application review would be in a future enhancement)

## Test 7: Explore & Filter (5 minutes)

### Test Project Filtering
1. Sign out if signed in
2. Click "Explore Projects"
3. Try different category filters:
   - All
   - Building Materials
   - Furniture
   - Packaging
4. Projects should filter correctly

### Test Public Access
1. Click on a project (while not signed in)
2. You should see project details
3. You should NOT see "Invest" button (only for investors)

## Test 8: Navigation & UI (5 minutes)

### Test All Links
1. Click through all navbar links
2. Verify each page loads correctly
3. Test on mobile (resize browser)
4. Check footer links

### Test Responsive Design
1. Resize browser to mobile size
2. Check that layout adapts
3. Verify all buttons are clickable
4. Test forms on mobile

## ✅ Success Criteria

After completing all tests, you should have:

- [x] 4 user accounts (Admin, Innovator, Investor, Job Seeker)
- [x] 1 approved project with $25,000 funding
- [x] 1 approved investor
- [x] 1 job posting
- [x] 1 job application
- [x] All dashboards showing correct data
- [x] Admin panel working correctly

## 🐛 Common Issues & Solutions

### "Failed to fetch"
- Check .env file has correct Supabase credentials
- Verify Supabase project is running

### Can't sign up
- Check browser console for errors
- Verify SQL schema was run correctly

### Project not appearing
- Make sure it's approved by admin
- Check project status in database

### Can't invest
- Verify investor is approved
- Check that you're signed in as investor role

### Job not showing
- Verify project is approved
- Check job status is "open"

## 📊 Database Verification

After testing, check your Supabase database:

```sql
-- Check all users
SELECT email, full_name, role FROM profiles;

-- Check projects
SELECT title, status, funding_goal, funds_raised FROM projects;

-- Check investments
SELECT amount, created_at FROM investments;

-- Check jobs
SELECT title, status FROM jobs;

-- Check applications
SELECT status, created_at FROM job_applications;
```

## 🎉 Congratulations!

If all tests pass, your platform is fully functional and ready for production!

## Next Steps

1. Customize branding and colors
2. Add your own content
3. Deploy to production (see DEPLOYMENT.md)
4. Invite real users
5. Monitor and iterate

---

Happy testing! 🚀
