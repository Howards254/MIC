# Custom Email Templates for Supabase

This directory contains custom HTML email templates for the Maathai Innovation Catalyst platform.

## 📧 Templates Included

### 1. Confirmation Email (`confirmation-email.html`)
- **Purpose:** Email verification for new user signups
- **Trigger:** When a user signs up for a new account
- **Supabase Template:** "Confirm signup"
- **Subject:** "Confirm Your Email - Maathai Innovation Catalyst"

### 2. Magic Link Email (`magic-link-email.html`)
- **Purpose:** Passwordless authentication via email
- **Trigger:** When a user requests a magic link to sign in
- **Supabase Template:** "Magic Link"
- **Subject:** "Sign In to Maathai Innovation Catalyst"

### 3. Password Reset Email (`password-reset-email.html`)
- **Purpose:** Password recovery
- **Trigger:** When a user requests to reset their password
- **Supabase Template:** "Reset Password"
- **Subject:** "Reset Your Password - Maathai Innovation Catalyst"

## 🎨 Design Features

All templates include:
- ✅ Responsive design (mobile-friendly)
- ✅ Brand colors (green gradient: #065f46 to #10b981)
- ✅ Professional layout with header and footer
- ✅ Clear call-to-action buttons
- ✅ Security warnings where appropriate
- ✅ Fallback text links for email clients that don't support buttons
- ✅ Company branding and logo

## 🔧 How to Use

### Step 1: Access Supabase Dashboard
1. Log in to your Supabase project
2. Go to **Authentication** → **Email Templates**

### Step 2: Update Each Template
For each template:
1. Select the corresponding template type
2. Copy the HTML content from the respective file
3. Paste it into the Supabase editor
4. Update the subject line
5. Click **Save**

### Step 3: Test
Send test emails to verify:
- Rendering in different email clients
- Links work correctly
- Mobile responsiveness
- Brand consistency

## 📝 Template Variables

These templates use Supabase's built-in variables:

- `{{ .ConfirmationURL }}` - The confirmation/reset/magic link URL
- `{{ .Email }}` - The user's email address
- `{{ .SiteURL }}` - Your application's URL
- `{{ .Token }}` - The authentication token (used internally)

## 🎨 Customization

To customize these templates:

1. **Colors:** Update the gradient colors in the CSS
   - Primary: `#065f46` (dark green)
   - Secondary: `#10b981` (light green)

2. **Logo:** Replace the emoji logo (🌳 MIC) with your own logo image:
   ```html
   <img src="your-logo-url.png" alt="Logo" style="max-width: 200px;">
   ```

3. **Footer:** Update company information in the footer section

4. **Content:** Modify the text to match your brand voice

## 📱 Email Client Compatibility

These templates are tested and compatible with:
- ✅ Gmail (Desktop & Mobile)
- ✅ Outlook (Desktop & Mobile)
- ✅ Apple Mail (Desktop & Mobile)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

## 🔒 Security Best Practices

The templates include:
- ⚠️ Security warnings about link expiration
- 🔐 Advice not to share links
- ℹ️ Instructions for users who didn't request the email
- ⏰ Clear expiration times (1 hour)

## 🐛 Troubleshooting

**Template not rendering correctly?**
- Check for inline CSS (required for email clients)
- Verify all HTML tags are properly closed
- Test in multiple email clients

**Links not working?**
- Verify the redirect URLs in Supabase settings
- Check that `{{ .ConfirmationURL }}` is used correctly
- Ensure your application routes match the redirect URLs

**Images not showing?**
- Use absolute URLs for images
- Host images on a reliable CDN
- Provide alt text for accessibility

## 📚 Resources

- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)
- [Can I Email](https://www.caniemail.com/) - Check CSS support in email clients

## 💡 Tips

1. **Test thoroughly** - Always send test emails before going live
2. **Keep it simple** - Email clients have limited CSS support
3. **Use tables** - For complex layouts, use table-based layouts
4. **Inline CSS** - Always use inline styles for maximum compatibility
5. **Alt text** - Provide alt text for all images
6. **Plain text** - Consider providing a plain text version as fallback

---

Need help? Check the main setup instructions in `../SETUP_INSTRUCTIONS.md`
