# Resend Email Setup Guide

## Why Resend?
- ✅ Works on Render free tier (uses HTTP API, not SMTP)
- ✅ 3,000 free emails per month
- ✅ Better deliverability than Gmail
- ✅ No SMTP port blocking issues
- ✅ Same HTML format support

## Setup Steps

### 1. Create Resend Account
1. Go to https://resend.com/signup
2. Sign up with your email
3. Verify your email address

### 2. Get API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "LPRES Backend"
4. Copy the API key (starts with `re_`)

### 3. Configure Domain (Optional but Recommended)
**Option A: Use Resend Test Domain (Quick Start)**
- Use `onboarding@resend.dev` as your FROM address
- Limited to 100 emails/day
- Good for testing

**Option B: Verify Your Domain (Production)**
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `lpres-niger.com`)
4. Add the DNS records they provide
5. Wait for verification
6. Use `noreply@lpres-niger.com` or similar

### 4. Update Local Environment
Edit `backend/.env`:
```env
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=LPRES Administration
```

### 5. Install Package
```bash
cd backend
npm install
```

### 6. Update Render Environment Variables
1. Go to your Render dashboard
2. Select your `lpress-backend` service
3. Go to Environment tab
4. Add new environment variable:
   - Key: `RESEND_API_KEY`
   - Value: `re_your_actual_api_key_here`
5. Update existing variable:
   - Key: `EMAIL_FROM`
   - Value: `onboarding@resend.dev` (or your verified domain email)
6. Save changes
7. Trigger manual deploy

### 7. Test
Once deployed, try sending a test newsletter from your admin panel!

## Troubleshooting

**Error: "Resend API key not configured"**
- Make sure `RESEND_API_KEY` is set in Render environment variables
- Redeploy after adding the variable

**Error: "Email address not verified"**
- If using custom domain, make sure it's verified in Resend dashboard
- Use `onboarding@resend.dev` for quick testing

**Emails not arriving**
- Check spam folder
- Verify the recipient email is valid
- Check Resend dashboard logs: https://resend.com/logs

## Migration Complete ✅
The code has been updated to use Resend instead of Nodemailer/SMTP. The email format and all functionality remain exactly the same!
