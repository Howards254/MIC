# MIC - Maathai Innovation Catalyst

A comprehensive platform connecting innovators, investors, and job seekers to build sustainable alternatives to timber and combat deforestation.

## 🌟 Features

### For All Users (Default)
- Submit project ideas for sustainable wood alternatives
- Track funding progress in real-time
- Post job openings for your projects
- Browse job opportunities at sustainable startups
- Apply to jobs with resume and cover letter
- Track application status

### To Become an Investor
- Apply through detailed investor form
- Get approved by admin
- Once approved:
  - Invest in vetted sustainable projects
  - Track your investment portfolio
  - Still retain all user features

### For Admins
- Review and approve project submissions
- Approve investor applications
- Manage platform integrity
- Monitor all activities

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd MIC
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a Supabase project at [supabase.com](https://supabase.com)
- Run the SQL schema from `supabase-schema.sql`
- Copy your credentials to `.env`

4. **Run the development server**
```bash
npm run dev
```

5. **Create your admin account**
- Sign up through the app
- Run the SQL command to make yourself admin (see SETUP.md)

## 📚 Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## 🛠 Tech Stack

- **Frontend**: React 18, React Router 7
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Project Structure

```
MIC/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   └── supabaseClient.js # Supabase configuration
├── supabase-schema.sql  # Database schema
├── SETUP.md            # Detailed setup guide
└── README.md           # This file
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure authentication with Supabase
- Protected admin routes

## 🌍 Deployment

Deploy to Vercel, Netlify, or any static hosting service. See SETUP.md for instructions.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- Email notifications
- File upload for project images and resumes
- Payment processing integration
- Advanced analytics dashboard
- Project milestone tracking
- Investor messaging system
- Mobile app

---

Built with ❤️ to save our forests
