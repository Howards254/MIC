# MIC Platform Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- A Supabase account (free tier works)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Go to **SQL Editor** in the left sidebar
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL Editor and click **Run**
6. This will create all necessary tables, policies, and functions

## Step 2: Get Supabase Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy the **anon/public** key (long string starting with `eyJ...`)
4. Update your `.env` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Step 5: Create Your Admin Account

1. Sign up for a new account through the app
2. Go to your Supabase project > **SQL Editor**
3. Run this command (replace with your email):

```sql
SELECT make_admin('your-email@example.com');
```

4. Refresh the page and you'll now have admin access

## User Roles & Features

### Innovator
- Submit project ideas for approval
- View project funding progress
- Post job openings for their projects
- Receive investments from approved investors

### Investor
- Apply to become an approved investor
- Once approved, browse and invest in projects
- Track investment portfolio

### Job Seeker
- Browse open job positions
- Apply to jobs with resume and cover letter
- Track application status

### Admin (You)
- Approve/reject project submissions
- Approve/reject investor applications
- Full platform oversight

## Database Tables

- **profiles**: User information and roles
- **projects**: Project submissions and details
- **investor_applications**: Investor approval requests
- **investments**: Investment transactions
- **jobs**: Job postings
- **job_applications**: Job applications
- **project_updates**: Project progress updates

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only see and modify their own data
- Admins have elevated permissions
- Investors must be approved before investing

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables
7. Deploy!

## Support

For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- React Router documentation: https://reactrouter.com
- Tailwind CSS documentation: https://tailwindcss.com

## Next Steps

1. Customize the branding and colors in `tailwind.config.js`
2. Add email notifications using Supabase Edge Functions
3. Implement file uploads for project images and resumes
4. Add payment processing integration (Stripe, PayPal)
5. Create analytics dashboard for admins
6. Add project update notifications for investors
