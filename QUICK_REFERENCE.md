# Quick Reference Card

## 🚨 BEFORE YOU START

### 1. Update .env File (REQUIRED!)
```bash
# Open .env and replace with YOUR credentials from Supabase
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR-KEY
```

### 2. Create Database Tables (REQUIRED!)
```sql
-- In Supabase SQL Editor, run the entire supabase-schema.sql file
```

### 3. Start the App
```bash
npm install
npm run dev
```

## 📖 Documentation Quick Links

| File | Purpose | When to Read |
|------|---------|--------------|
| **START_HERE.md** | Overview & guide | First! |
| **QUICKSTART.md** | 5-min setup | To get running fast |
| **CHECK_DATABASE.md** | Database verification | If database issues |
| **FIXES_APPLIED.md** | What was fixed | To understand changes |
| **TESTING_GUIDE.md** | Test all features | After setup |
| **DEPLOYMENT.md** | Go to production | When ready to deploy |
| **PROJECT_SUMMARY.md** | What was built | To understand system |

## 🔑 Key Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 👥 User Roles

| Role | Can Do |
|------|--------|
| **Innovator** | Submit projects, post jobs |
| **Investor** | Apply to invest, fund projects |
| **Job Seeker** | Browse jobs, apply |
| **Admin** | Approve everything |

## 🗄️ Database Tables

```
profiles              → User accounts
projects              → Project submissions
investor_applications → Investor approvals
investments           → Investment transactions
jobs                  → Job postings
job_applications      → Job applications
project_updates       → Project updates
```

## 🔐 Make Yourself Admin

```sql
-- In Supabase SQL Editor, after signing up:
SELECT make_admin('your-email@example.com');
```

## 🧪 Quick Test

1. Sign up at `/signup`
2. Sign in at `/signin`
3. Go to `/dashboard`
4. Submit a project (if innovator)
5. Make yourself admin
6. Approve the project at `/admin`

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Failed to fetch" | Update `.env` with real credentials |
| "relation 'profiles' does not exist" | Run `supabase-schema.sql` |
| "Invalid API key" | Check anon key in `.env` |
| Can't sign up | Check browser console, verify database |

## 📱 Pages

| URL | Page | Access |
|-----|------|--------|
| `/` | Home | Public |
| `/signup` | Sign Up | Public |
| `/signin` | Sign In | Public |
| `/explore` | Browse Projects | Public |
| `/jobs` | Job Board | Public |
| `/project/:id` | Project Details | Public |
| `/dashboard` | User Dashboard | Logged in |
| `/admin` | Admin Panel | Admin only |

## 🎯 Validation Rules

- **Password:** Minimum 6 characters
- **Name:** Minimum 2 characters
- **Email:** Valid email format
- **Terms:** Must be accepted

## 🚀 Deployment Checklist

- [ ] Test locally
- [ ] Update `.env` for production
- [ ] Push to GitHub
- [ ] Deploy to Vercel/Netlify
- [ ] Add environment variables
- [ ] Update Supabase Auth URLs
- [ ] Test production site

## 💡 Pro Tips

1. **Use Chrome DevTools** to debug issues
2. **Check Supabase Logs** for backend errors
3. **Test with multiple accounts** (different roles)
4. **Keep .env secure** (never commit to git)
5. **Backup database** before major changes

## 📞 Get Help

1. Check browser console for errors
2. Check Supabase logs
3. Review relevant documentation file
4. Verify .env has real credentials
5. Ensure database tables exist

## ✅ Success Indicators

- ✅ Can sign up new users
- ✅ Can sign in
- ✅ Dashboard shows role-specific content
- ✅ Projects can be submitted
- ✅ Admin can approve items
- ✅ Investments work
- ✅ Jobs can be posted and applied to

## 🎉 You're Ready When...

- [x] `.env` has real Supabase credentials
- [x] Database tables created
- [x] Can sign up successfully
- [x] Can sign in successfully
- [x] Made yourself admin
- [x] Tested basic flows

---

**Need detailed help?** → See START_HERE.md

**Ready to test?** → See TESTING_GUIDE.md

**Ready to deploy?** → See DEPLOYMENT.md
