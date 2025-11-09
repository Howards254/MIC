# Database Setup Verification

## ⚠️ IMPORTANT: Your .env file needs real credentials!

Your current `.env` file has placeholder values. You MUST update it with your actual Supabase credentials.

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com
2. Sign in or create an account
3. Create a new project (or use existing)
4. Wait for project to be ready (~2 minutes)
5. Go to **Settings** (gear icon) → **API**
6. Copy these two values:

### Project URL
```
Example: https://abcdefghijklmnop.supabase.co
```

### Anon/Public Key
```
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxOTM5MDMyNzg5fQ.abcdefghijklmnopqrstuvwxyz1234567890
```

## Step 2: Update Your .env File

Open `.env` and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR-ACTUAL-KEY-HERE
```

**IMPORTANT:** 
- Remove the placeholder text
- Use YOUR actual values from Supabase
- Don't add quotes around the values
- Don't add spaces

## Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the `supabase-schema.sql` file from this project
4. Copy ALL the contents (Ctrl+A, Ctrl+C)
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

## Step 4: Verify Database Setup

Run this query in Supabase SQL Editor to check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- ✅ profiles
- ✅ projects
- ✅ investor_applications
- ✅ investments
- ✅ jobs
- ✅ job_applications
- ✅ project_updates

## Step 5: Test the Connection

1. Make sure your `.env` file has real credentials
2. Restart your dev server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
3. Open http://localhost:5173
4. Try to sign up with a test account
5. If it works, you're all set! ✅

## Common Issues

### "Failed to fetch" error
**Problem:** Your `.env` file still has placeholder values

**Solution:** 
1. Update `.env` with real Supabase credentials
2. Restart the dev server

### "relation 'profiles' does not exist"
**Problem:** Database tables weren't created

**Solution:**
1. Go to Supabase SQL Editor
2. Run the entire `supabase-schema.sql` file
3. Check for any error messages

### "Invalid API key"
**Problem:** Wrong anon key in `.env`

**Solution:**
1. Go to Supabase → Settings → API
2. Copy the **anon public** key (not the service_role key!)
3. Update `.env` file
4. Restart dev server

### Sign up works but can't see data
**Problem:** RLS policies might not be set up

**Solution:**
1. Make sure you ran the ENTIRE schema file
2. Check that RLS policies were created:
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

## Quick Test Query

Run this in Supabase SQL Editor to test everything:

```sql
-- This should return empty (no users yet)
SELECT * FROM profiles;

-- This should return the function
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'make_admin';
```

## Need Help?

1. Check that Supabase project is active (not paused)
2. Verify you're using the correct project
3. Make sure you copied the ENTIRE schema file
4. Check browser console for specific error messages

## ✅ Checklist

Before you can use the app:

- [ ] Created Supabase project
- [ ] Copied Project URL to `.env`
- [ ] Copied Anon Key to `.env`
- [ ] Ran `supabase-schema.sql` in SQL Editor
- [ ] Verified tables exist
- [ ] Restarted dev server
- [ ] Can sign up successfully

Once all checked, you're ready to go! 🚀
