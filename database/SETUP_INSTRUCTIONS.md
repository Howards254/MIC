# Database and Email Setup Instructions

This guide will help you set up the complete database schema with RLS policies and configure custom email templates for Supabase.

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Email Templates Setup](#email-templates-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Testing](#testing)

---

## 🗄️ Database Setup

### Step 1: Run the Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `complete-schema-with-rls.sql`
5. Paste and execute the SQL

This will create:
- ✅ All database tables with proper relationships
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Triggers for automatic timestamp updates
- ✅ Automatic profile creation on user signup
- ✅ Indexes for query optimization
- ✅ Proper permissions for authenticated users

### Step 2: Verify the Migration

Run this query to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- profiles
- projects
- jobs
- events
- blog_posts
- investments
- donations
- messages
- notifications
- investment_commitments
- chat_messages
- investor_applications

---

## 📧 Email Templates Setup

### Step 1: Access Supabase Email Templates

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Each Template

#### A. Confirmation Email (Email Verification)

1. Select **"Confirm signup"** template
2. Replace the HTML content with the contents of:
   `email-templates/confirmation-email.html`
3. **Subject line:** `Confirm Your Email - Maathai Innovation Catalyst`
4. Click **Save**

#### B. Magic Link Email

1. Select **"Magic Link"** template
2. Replace the HTML content with the contents of:
   `email-templates/magic-link-email.html`
3. **Subject line:** `Sign In to Maathai Innovation Catalyst`
4. Click **Save**

#### C. Password Reset Email

1. Select **"Reset Password"** template
2. Replace the HTML content with the contents of:
   `email-templates/password-reset-email.html`
3. **Subject line:** `Reset Your Password - Maathai Innovation Catalyst`
4. Click **Save**

### Step 3: Configure Email Settings

1. Go to **Authentication** → **Settings**
2. Configure the following:

**Email Confirmation:**
- ✅ Enable email confirmations
- Set confirmation URL: `https://yourdomain.com/dashboard`

**Password Recovery:**
- Set redirect URL: `https://yourdomain.com/reset-password`

**Email Rate Limits:**
- Adjust as needed (default is usually fine)

---

## ⚙️ Supabase Configuration

### Environment Variables

Make sure your `.env` file has these variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure SMTP settings (optional, for custom email domain):
   - Go to **Project Settings** → **Auth**
   - Scroll to **SMTP Settings**
   - Add your SMTP credentials

---

## 🧪 Testing

### Test Email Verification

1. Sign up with a new account at `/signup`
2. Check your email inbox for the confirmation email
3. Click the confirmation link
4. Verify you're redirected to the dashboard

### Test Password Reset

1. Go to `/forgot-password`
2. Enter your email address
3. Check your email for the reset link
4. Click the link and set a new password
5. Sign in with the new password

### Test Database Permissions

Run these queries to verify RLS is working:

```sql
-- Should return only your profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Should return only approved projects or your own
SELECT * FROM projects;

-- Should return only your notifications
SELECT * FROM notifications WHERE user_id = auth.uid();
```

---

## 🔒 Security Features

The setup includes:

- ✅ **Row Level Security (RLS)** on all tables
- ✅ **Email verification** required for new accounts
- ✅ **Password reset** with secure tokens
- ✅ **Automatic profile creation** on signup
- ✅ **Role-based access control** (user, admin, investor)
- ✅ **Secure password requirements** (minimum 6 characters)

---

## 📝 Additional Notes

### Custom Email Domain (Optional)

To use your own email domain:

1. Set up SPF, DKIM, and DMARC records
2. Configure SMTP in Supabase settings
3. Verify your domain

### Email Template Variables

The templates use these Supabase variables:
- `{{ .ConfirmationURL }}` - The confirmation/reset link
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL

### Troubleshooting

**Emails not sending?**
- Check spam folder
- Verify email provider is enabled
- Check Supabase logs in Dashboard → Logs

**RLS policies blocking queries?**
- Verify user is authenticated
- Check the specific policy for the table
- Review Supabase logs for policy violations

**Profile not created on signup?**
- Check if the trigger is enabled
- Verify the `handle_new_user()` function exists
- Check Supabase logs for errors

---

## 🎉 You're All Set!

Your application now has:
- ✅ Complete database with RLS policies
- ✅ Email verification on signup
- ✅ Forgot password functionality
- ✅ Beautiful custom email templates
- ✅ Toast notifications throughout the app

For support, check the Supabase documentation or open an issue in the repository.
