# Deploying Yearbook App with Photo Upload to Vercel

Complete guide to deploy your yearbook app with file upload functionality to Vercel.

## Prerequisites

Before deploying, ensure you have:
1. A GitHub account
2. A Vercel account
3. A Supabase project with:
   - Database configured (profiles table)
   - Auth configured
   - Storage bucket created (`yearbook-photos`)
   - All RLS policies in place

## Step 1: Push Code to GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **+** icon in the top right and select **New repository**
3. Name it: `yearbook-app` (or any name you prefer)
4. Choose **Public** or **Private** (your choice)
5. Do **NOT** initialize with README (you already have one)
6. Click **Create repository**

### 1.2 Connect Local Git to GitHub

```bash
cd your-project-directory
git init
git add .
git commit -m "Initial commit: Yearbook app with photo upload"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yearbook-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Deploy to Vercel

### 2.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New...** and select **Project**
3. Click **Import Git Repository**
4. Paste your GitHub repository URL
5. Click **Continue**

### 2.2 Configure Vercel Project

1. **Project Name**: Keep the default or change to `yearbook-app`
2. **Framework**: Select **Next.js** (should auto-detect)
3. **Root Directory**: Leave as `./`

### 2.3 Set Environment Variables in Vercel

Click **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Your admin email |

Copy these from your Supabase project settings:
1. Go to your Supabase project: https://app.supabase.com
2. Click **Settings** → **API**
3. Copy the **Project URL** and **anon** key
4. Paste them into Vercel

### 2.4 Deploy

1. Click **Deploy**
2. Wait for the deployment to complete (usually 2-3 minutes)
3. You'll get a live URL like: `https://yearbook-app.vercel.app`

## Step 3: Verify Deployment

### 3.1 Test the Live App

1. Visit your Vercel URL
2. You should see the yearbook home page
3. Click **Sign Up** to create an account
4. Try uploading a profile photo
5. Verify the photo appears in the preview
6. Save your profile
7. Go back to home to see your photo in the gallery

### 3.2 Test Admin Panel

1. Log out
2. Create another account with your admin email (set in `NEXT_PUBLIC_ADMIN_EMAIL`)
3. Log in with the admin account
4. Visit `/admin` 
5. You should see all profiles and photo management

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain in Vercel

1. Go to your Vercel project settings
2. Click **Domains**
3. Enter your custom domain (e.g., `yearbook.yourdomain.com`)
4. Follow Vercel's instructions to add DNS records to your domain provider

### 4.2 DNS Configuration

After adding the domain in Vercel:
1. Go to your domain provider (GoDaddy, Namecheap, etc.)
2. Add the DNS records Vercel shows you
3. Wait 24-48 hours for propagation
4. Visit your custom domain

## Step 5: After Deployment

### 5.1 Share with Your Class

- Share your live URL with classmates
- They can sign up and add their profiles
- Photos will be uploaded and visible in the gallery

### 5.2 Monitor Usage

In Vercel dashboard, you can see:
- **Deployments**: All version deployments
- **Analytics**: Page views, response times
- **Function Calls**: API usage
- **Storage**: Data usage

### 5.3 Update Your App

When you make changes locally:

```bash
git add .
git commit -m "Your changes description"
git push origin main
```

Vercel will automatically redeploy with your changes!

## Troubleshooting

### Issue: Photos not appearing after upload

**Solution:**
1. Check that the storage bucket is configured correctly
2. Go to Supabase → Storage → yearbook-photos
3. Verify RLS policies are enabled
4. Check that bucket has public access enabled

### Issue: Upload fails with "Access Denied"

**Solution:**
1. Verify you're logged in
2. Check the RLS policies in Supabase Storage
3. Ensure the policy allows authenticated users to upload
4. Check browser console (F12) for detailed error

### Issue: App works locally but not on Vercel

**Solution:**
1. Verify all environment variables are set in Vercel
2. Check Vercel deployment logs for errors
3. Make sure your code was pushed to GitHub
4. Check that your Supabase project is still running

## Performance Tips

1. **Image Optimization**: The app uses Next.js Image component for optimization
2. **Lazy Loading**: Profile cards load as you scroll (on home page)
3. **Caching**: Vercel automatically caches static assets
4. **Database**: Supabase provides built-in indexes for fast queries

## Security

Your app includes:
- User authentication via Supabase Auth
- Row-level security on database
- Storage bucket policies for file access
- Admin-only operations

## Advanced Customization

### Adding More Storage Features

To add more features like:
- Multiple photos per profile
- Photo gallery
- Comments

See the code in `/lib/supabase/storage.ts` for examples.

### Database Backups

Supabase automatically backs up your database. To download:
1. Go to your Supabase project
2. Settings → Backups
3. Click to download

### Scaling

Your app can handle:
- Thousands of student profiles
- Millions of photo views
- Automatic scaling on Vercel and Supabase

## Getting Help

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Open an issue on GitHub if you encounter problems

## Deployment Checklist

Before going live, verify:

- [ ] GitHub repository created and code pushed
- [ ] Vercel project created and connected
- [ ] All environment variables set in Vercel
- [ ] Supabase storage bucket created
- [ ] Storage RLS policies configured
- [ ] App works on live Vercel URL
- [ ] Photos upload and display correctly
- [ ] Admin panel accessible with admin email
- [ ] All students can sign up and create profiles
- [ ] Home page shows all published profiles with photos

Congratulations! Your yearbook app is live! 🎉
