# Quick Start Guide - MIC Platform

## 🚀 Get Running in 5 Minutes

### Step 1: Supabase Setup (2 minutes)

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: `MIC`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Click "Create new project" and wait ~2 minutes

### Step 2: Create Database (1 minute)

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the `supabase-schema.sql` file from this project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

### Step 3: Get Your Keys (30 seconds)

1. Click **Settings** (gear icon in left sidebar)
2. Click **API**
3. Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
4. Copy the **anon public** key (long string starting with `eyJ...`)

### Step 4: Configure Environment (30 seconds)

1. Open the `.env` file in this project
2. Replace the values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

### Step 5: Install & Run (1 minute)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open http://localhost:5173 in your browser!

### Step 6: Create Admin Account (1 minute)

1. Click "Sign Up" in the app
2. Fill in your details and select any role (we'll change it)
3. After signing up, go back to Supabase
4. Click **SQL Editor** > **New Query**
5. Run this (replace with YOUR email):

```sql
SELECT make_admin('your-email@example.com');
```

6. Refresh the app - you're now an admin!

## ✅ You're Done!

Now you can:
- **Sign up** other test users with different roles
- **Submit projects** as an innovator
- **Apply as investor** and approve yourself as admin
- **Post jobs** from approved projects
- **Apply to jobs** as a job seeker

## 🎯 Test the Full Flow

1. **Create an Innovator Account**
   - Sign up with role "Innovator"
   - Go to Dashboard
   - Submit a project
   - As admin, approve the project

2. **Create an Investor Account**
   - Sign up with role "Investor"
   - Go to Dashboard
   - Apply to become investor
   - As admin, approve the investor
   - Browse projects and invest

3. **Create a Job Seeker Account**
   - Sign up with role "Job Seeker"
   - As project owner, post a job
   - As job seeker, browse and apply

## 🐛 Troubleshooting

**"Failed to fetch" error?**
- Check your `.env` file has correct Supabase credentials
- Make sure you ran the SQL schema

**Can't sign up?**
- Check browser console for errors
- Verify Supabase project is active

**Not seeing admin panel?**
- Make sure you ran the `make_admin()` SQL command
- Refresh the page after running it

## 📞 Need Help?

Check the full [SETUP.md](./SETUP.md) for detailed instructions.

---

Happy building! 🌱
