# Deployment Checklist

## Pre-Deployment

- [ ] Test all user flows locally
- [ ] Verify Supabase RLS policies are working
- [ ] Test with multiple user roles
- [ ] Check all forms validate properly
- [ ] Ensure error messages are user-friendly
- [ ] Test on mobile devices

## Vercel Deployment (Recommended)

### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click "Deploy"

### Step 3: Configure Domain (Optional)
1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed

## Netlify Deployment

### Step 1: Build Settings
1. Go to https://netlify.com
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 2: Environment Variables
1. Go to Site settings > Environment variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 3: Deploy
1. Click "Deploy site"
2. Wait for build to complete

## Post-Deployment

### Verify Everything Works
- [ ] Sign up new account
- [ ] Sign in with existing account
- [ ] Submit a project (as innovator)
- [ ] Apply as investor
- [ ] Approve items (as admin)
- [ ] Make an investment
- [ ] Post a job
- [ ] Apply to a job
- [ ] Test all navigation links
- [ ] Check mobile responsiveness

### Supabase Configuration
- [ ] Update Supabase Auth settings:
  - Go to Authentication > URL Configuration
  - Add your production URL to "Site URL"
  - Add your production URL to "Redirect URLs"

### Security Checklist
- [ ] Verify RLS policies are enabled
- [ ] Check that users can only access their own data
- [ ] Ensure admin routes are protected
- [ ] Test that unapproved investors cannot invest
- [ ] Verify email confirmation is working (if enabled)

## Monitoring

### Set Up Alerts
1. **Supabase Dashboard**
   - Monitor database usage
   - Check API request counts
   - Review error logs

2. **Vercel/Netlify Analytics**
   - Track page views
   - Monitor build times
   - Check for errors

### Regular Maintenance
- [ ] Weekly: Check for pending approvals
- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review database performance
- [ ] Quarterly: Backup database

## Scaling Considerations

### When You Grow
1. **Database**
   - Upgrade Supabase plan if needed
   - Add database indexes for performance
   - Consider read replicas

2. **Storage**
   - Set up Supabase Storage for file uploads
   - Implement CDN for images

3. **Features to Add**
   - Email notifications (Supabase Edge Functions)
   - Payment processing (Stripe)
   - Advanced analytics
   - Real-time notifications
   - Mobile app

## Rollback Plan

If something goes wrong:

1. **Vercel**: Click "Rollback" on previous deployment
2. **Netlify**: Go to Deploys > Click on previous deploy > "Publish deploy"
3. **Database**: Restore from Supabase backup (Settings > Database > Backups)

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- React Router: https://reactrouter.com

## Cost Estimates (Free Tiers)

- **Supabase Free**: 500MB database, 50,000 monthly active users
- **Vercel Free**: 100GB bandwidth, unlimited deployments
- **Netlify Free**: 100GB bandwidth, 300 build minutes

All free tiers are sufficient for starting out!

---

Good luck with your deployment! 🚀
