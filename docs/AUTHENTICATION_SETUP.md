# Authentication Setup Guide

Complete guide for the authentication system with email verification, password reset, and toast notifications.

## 🎯 Features Implemented

### ✅ Core Authentication
- User signup with email/password
- User signin with email/password
- Email verification on signup
- Forgot password functionality
- Password reset with secure tokens
- Automatic profile creation
- Role-based access (user, admin, investor, innovator)

### ✅ User Experience
- Toast notifications for all actions
- Beautiful custom email templates
- Responsive design
- Clear error messages
- Loading states
- Success confirmations

### ✅ Security
- Row Level Security (RLS) on all tables
- Secure password requirements (min 6 characters)
- Email verification required
- Token-based password reset
- Session management
- Protected routes

## 📁 Files Created/Modified

### New Files
```
src/
├── lib/
│   └── toast.ts                    # Toast notification utilities
├── pages/
│   ├── ForgotPasswordPage.tsx      # Forgot password page
│   └── ResetPasswordPage.tsx       # Reset password page
database/
├── complete-schema-with-rls.sql    # Complete database schema
├── SETUP_INSTRUCTIONS.md           # Setup guide
└── email-templates/
    ├── confirmation-email.html     # Email verification template
    ├── magic-link-email.html       # Magic link template
    ├── password-reset-email.html   # Password reset template
    └── README.md                   # Email templates guide
```

### Modified Files
```
src/
├── App.tsx                         # Added Toaster and new routes
├── contexts/AuthContext.tsx        # Added forgotPassword & resetPassword
├── types/index.ts                  # Updated AuthContextType
├── pages/
│   ├── SignInPage.tsx             # Added toast notifications & forgot password link
│   └── SignUpPage.tsx             # Added toast notifications & email verification
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install react-hot-toast
```

### 2. Set Up Database
1. Go to Supabase Dashboard → SQL Editor
2. Run `database/complete-schema-with-rls.sql`
3. Verify all tables are created

### 3. Configure Email Templates
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Update each template with the HTML from `database/email-templates/`
3. Set appropriate subject lines

### 4. Configure Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Test the Features
- Sign up: `/signup`
- Sign in: `/signin`
- Forgot password: `/forgot-password`
- Reset password: `/reset-password`

## 🎨 Toast Notifications

### Available Functions

```typescript
import { showSuccess, showError, showInfo, showWarning, showLoading } from '../lib/toast';

// Success notification
showSuccess('Account created successfully!');

// Error notification
showError('Invalid email or password');

// Info notification
showInfo('Check your email for verification link');

// Warning notification
showWarning('Your session is about to expire');

// Loading notification
const toastId = showLoading('Processing...');
// Later dismiss it
dismissToast(toastId);

// Promise-based notification
showPromise(
  apiCall(),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save'
  }
);
```

### Usage Examples

#### In Sign In
```typescript
try {
  await signIn(email, password);
  showSuccess('Welcome back!');
  navigate('/dashboard');
} catch (err: any) {
  showError(err.message || 'Invalid credentials');
}
```

#### In Sign Up
```typescript
try {
  await signUp(email, password);
  showSuccess('Account created! Check your email.');
  showInfo('Check spam folder if needed.');
} catch (err: any) {
  showError(err.message);
}
```

## 🔐 Authentication Flow

### Sign Up Flow
```
1. User fills signup form
2. Submit → Create auth user
3. Create profile in database
4. Send verification email
5. Show success toast
6. Redirect to signin
7. User clicks email link
8. Email verified
9. User can now sign in
```

### Sign In Flow
```
1. User enters credentials
2. Submit → Verify credentials
3. Check email verification
4. Create session
5. Show success toast
6. Redirect to dashboard
```

### Forgot Password Flow
```
1. User enters email
2. Submit → Send reset email
3. Show success toast
4. User clicks email link
5. Redirect to reset page
6. User enters new password
7. Update password
8. Show success toast
9. Redirect to signin
```

## 🗄️ Database Schema

### Tables Created
- **profiles** - User profiles with roles
- **projects** - User projects
- **jobs** - Job postings
- **events** - Events
- **blog_posts** - Blog articles
- **investments** - Investment offers
- **donations** - Project donations
- **messages** - Direct messages
- **notifications** - User notifications
- **investment_commitments** - Accepted investments
- **chat_messages** - Investment chat
- **investor_applications** - Investor applications

### RLS Policies
Each table has appropriate RLS policies:
- Users can view their own data
- Admins can view/edit all data
- Public data is viewable by everyone
- Private data is restricted

## 📧 Email Templates

### Confirmation Email
- Sent on signup
- Contains verification link
- Expires in 24 hours
- Beautiful branded design

### Magic Link Email
- Passwordless authentication
- Expires in 1 hour
- Security warnings included

### Password Reset Email
- Sent on forgot password
- Contains reset link
- Expires in 1 hour
- Password tips included

## 🔧 Configuration

### Supabase Auth Settings

1. **Email Confirmations**
   - Enable: ✅
   - Redirect URL: `https://yourdomain.com/dashboard`

2. **Password Requirements**
   - Minimum length: 6 characters
   - Complexity: Configurable

3. **Email Rate Limits**
   - Adjust as needed for your use case

4. **Session Settings**
   - Session timeout: Configurable
   - Refresh token rotation: Enabled

## 🧪 Testing Checklist

### Sign Up
- [ ] Form validation works
- [ ] Email verification sent
- [ ] Profile created in database
- [ ] Toast notifications appear
- [ ] Redirects to signin

### Sign In
- [ ] Valid credentials work
- [ ] Invalid credentials show error
- [ ] Toast notifications appear
- [ ] Redirects to dashboard
- [ ] Session persists

### Forgot Password
- [ ] Email sent successfully
- [ ] Toast notifications appear
- [ ] Reset link works
- [ ] Link expires after 1 hour

### Reset Password
- [ ] Form validation works
- [ ] Password updated successfully
- [ ] Toast notifications appear
- [ ] Redirects to signin
- [ ] Can sign in with new password

### Email Templates
- [ ] Emails render correctly
- [ ] Links work properly
- [ ] Mobile responsive
- [ ] Brand consistent

## 🐛 Troubleshooting

### Emails Not Sending
1. Check Supabase email provider is enabled
2. Verify SMTP settings (if using custom domain)
3. Check spam folder
4. Review Supabase logs

### Toast Not Showing
1. Verify Toaster component is in App.tsx
2. Check import statements
3. Verify react-hot-toast is installed

### RLS Blocking Queries
1. Check user is authenticated
2. Review specific table policies
3. Check Supabase logs
4. Verify user role

### Profile Not Created
1. Check trigger is enabled
2. Verify function exists
3. Review Supabase logs
4. Check auth.users table

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Hot Toast Documentation](https://react-hot-toast.com/)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 Next Steps

1. Customize email templates with your branding
2. Add social authentication (Google, GitHub, etc.)
3. Implement 2FA (Two-Factor Authentication)
4. Add password strength meter
5. Implement account deletion
6. Add email change functionality
7. Create admin dashboard for user management

---

For detailed setup instructions, see `database/SETUP_INSTRUCTIONS.md`
