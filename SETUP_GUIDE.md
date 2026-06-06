# Yearbook App - Complete Setup & Deployment Guide

This guide walks you through every step to get your yearbook application running locally, connected to GitHub, and deployed on Vercel.

---

## Table of Contents

1. [Part 1: Supabase Configuration](#part-1-supabase-configuration)
2. [Part 2: Download & Run Locally](#part-2-download--run-locally)
3. [Part 3: Connect to GitHub](#part-3-connect-to-github)
4. [Part 4: Deploy to Vercel](#part-4-deploy-to-vercel)

---

## Part 1: Supabase Configuration

### Step 1.1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Sign Up"** in the top right corner
3. Sign up using your email address or GitHub account
4. Verify your email address by clicking the link in your inbox
5. Log in to your Supabase dashboard

### Step 1.2: Create a New Project

1. In your Supabase dashboard, click **"New project"** or the **"+"** button
2. Enter a **Project Name** (e.g., "yearbook-app")
3. Enter a strong **Database Password** (you'll need this)
4. Select your **Region** (closest to your users is best)
5. Click **"Create new project"**
6. Wait 1-2 minutes for the project to initialize

### Step 1.3: Create the Profiles Table

Once your project is created:

1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button
3. Copy and paste the following SQL code into the editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quote TEXT,
  photo_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  UNIQUE(user_id)
);

-- Create index for faster queries
CREATE INDEX profiles_user_id_idx ON profiles(user_id);
CREATE INDEX profiles_published_idx ON profiles(published);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view published profiles
CREATE POLICY "Published profiles are viewable by anyone"
  ON profiles FOR SELECT
  USING (published = true);

-- Policy 2: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 5: Admin can delete profiles (you'll restrict this to admin email)
CREATE POLICY "Admins can delete any profile"
  ON profiles FOR DELETE
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', TRUE));
```

4. Click the **"Run"** button (or press `Ctrl+Enter`)
5. You should see a success message: "Query successful"

### Step 1.4: Get Your Supabase Credentials

1. Go to **Settings** (gear icon) in the left sidebar
2. Click **"API"** under the Project section
3. Under the **"Project API keys"** section, you'll see:
   - **Project URL** - Copy this value
   - **Anon key** (under "anon public") - Copy this value
4. Save these values in a safe place - you'll need them soon

### Step 1.5: Decide Your Admin Email

Choose which email address will be the **admin** for your yearbook app. This email address will have access to the `/admin` page to manage all student profiles.

Examples:
- `teacher@school.edu` (if a teacher is managing the yearbook)
- `yearbook@school.edu` (a dedicated admin email)

Save this email address - you'll need it when running the app locally.

---

## Part 2: Download & Run Locally

### Step 2.1: Download the Project

#### Option A: Using Git (Recommended)

1. Open your terminal/command prompt
2. Navigate to where you want to save the project:
   ```bash
   cd ~/Documents
   # or cd C:\Users\YourName\Documents on Windows
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/yearbook-app.git
   cd yearbook-app
   ```

#### Option B: Download as ZIP

1. Go to your GitHub repository (after you've created it - see Part 3)
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to your desired location
5. Open terminal and navigate to the extracted folder:
   ```bash
   cd path/to/yearbook-app
   ```

### Step 2.2: Install Node.js (If Not Already Installed)

Check if you have Node.js installed:
```bash
node --version
npm --version
```

If you see version numbers, skip to Step 2.3.

If not, install Node.js:
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the prompts
4. Restart your terminal

### Step 2.3: Install Project Dependencies

In your terminal (in the project folder):

```bash
npm install
# or if you prefer yarn
yarn install
# or if you prefer pnpm
pnpm install
```

This will install all required packages and may take 1-2 minutes.

### Step 2.4: Create Environment Variables File

1. In the project root folder, create a new file named `.env.local`
2. Open the file in a text editor (VS Code, Notepad, etc.)
3. Copy and paste the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

4. Replace the values with your actual Supabase credentials:
   - Replace `your_supabase_url_here` with your **Project URL** from Step 1.4
   - Replace `your_supabase_anon_key_here` with your **Anon key** from Step 1.4
   - Replace `admin@example.com` with your chosen **Admin Email** from Step 1.5

5. Save the file

Example of completed `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://abc123xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_EMAIL=teacher@myschool.edu
```

### Step 2.5: Start the Development Server

In your terminal (make sure you're in the project folder):

```bash
npm run dev
```

You should see output like:
```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

### Step 2.6: Open the App in Your Browser

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: `http://localhost:3000`
3. You should see the yearbook homepage!

### Step 2.7: Test the Application

#### Test Public Gallery (Home Page)
- You should see "Class Yearbook" heading
- The page shows "Please set up Supabase to view profiles" (this is normal - no profiles exist yet)

#### Test Signup
1. Click **"Sign Up"** in the navigation bar
2. Enter an email (e.g., `student1@example.com`)
3. Enter a password (min 6 characters)
4. Confirm the password
5. Click **"Sign Up"**
6. You should be redirected to the dashboard

#### Test Dashboard
1. You should see your profile form on the dashboard
2. Enter your name (e.g., "John Smith")
3. Enter a quote (e.g., "Great memories with everyone!")
4. Leave photo URL empty for now
5. Toggle **"Publish Profile"** to ON
6. Click **"Save Profile"**
7. You should see "Profile saved successfully!" message

#### Test Admin Panel
1. Log out by clicking **"Logout"** in the navbar
2. Log in with your **Admin Email** (the email you set in `.env.local`)
3. If you haven't created an admin account yet:
   - Go to Sign Up
   - Use your admin email
   - Create the account
   - Log in
4. Click **"Admin Dashboard"** in the navbar (only visible to admin)
5. You should see all profiles and controls to publish/delete them

#### Test Public Gallery Again
1. Log out
2. Go back to home page (`http://localhost:3000`)
3. You should now see your published profile card!

### Step 2.8: Stop the Server

To stop the development server:
- In your terminal, press `Ctrl+C`

To restart it later:
```bash
npm run dev
```

---

## Part 3: Connect to GitHub

### Step 3.1: Create a GitHub Account (If Needed)

1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Follow the steps to create your account
4. Verify your email

### Step 3.2: Create a New GitHub Repository

1. Log in to GitHub
2. Click the **"+"** icon in the top right corner
3. Click **"New repository"**
4. Enter a repository name (e.g., `yearbook-app`)
5. Add a description (e.g., "A digital yearbook web application")
6. Select **"Public"** or **"Private"** (your choice)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **"Create repository"**

### Step 3.3: Push Your Code to GitHub

You'll see instructions on the GitHub page. Follow these steps in your terminal:

#### If this is your first time using Git, configure it:
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

#### Initialize and push your code:
```bash
# Navigate to your project folder (if not already there)
cd ~/path/to/yearbook-app

# Initialize git (if not already a git repository)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Yearbook app setup"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/yearbook-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3.4: Verify on GitHub

1. Go to your GitHub repository URL: `https://github.com/YOUR_USERNAME/yearbook-app`
2. You should see all your project files
3. Your code is now safely backed up on GitHub!

---

## Part 4: Deploy to Vercel

### Step 4.1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. Complete the sign-up process

### Step 4.2: Import Your GitHub Repository

1. In your Vercel dashboard, click **"Add New"** button
2. Click **"Project"**
3. You should see your GitHub repositories listed
4. Find **"yearbook-app"** and click **"Import"**

If you don't see it:
1. Click **"Adjust GitHub App Permissions"**
2. Select your yearbook-app repository
3. Click "Install"
4. Go back to Vercel and try again

### Step 4.3: Configure Environment Variables

1. After clicking Import, you'll see a **"Configure Project"** page
2. Scroll down to **"Environment Variables"** section
3. Add the following variables (same as your `.env.local`):

   **Variable Name:** `NEXT_PUBLIC_SUPABASE_URL`
   **Value:** Your Supabase URL (from Step 1.4)
   
   **Variable Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   **Value:** Your Supabase Anon Key (from Step 1.4)
   
   **Variable Name:** `NEXT_PUBLIC_ADMIN_EMAIL`
   **Value:** Your admin email (from Step 1.5)

4. Make sure to add all three variables
5. Click **"Deploy"**

### Step 4.4: Wait for Deployment

1. Vercel will build and deploy your app (this takes 2-5 minutes)
2. You'll see a progress bar and build logs
3. Once complete, you'll see a success message and a preview link
4. Click the preview link to see your live app!

### Step 4.5: Get Your Production URL

1. After deployment succeeds, you'll see a URL like: `https://yearbook-app-abc123.vercel.app`
2. This is your live website! Share this URL with your classmates
3. You can also add a custom domain by going to **Settings** > **Domains**

### Step 4.6: Update Supabase Auth Settings

To allow users to sign up via your Vercel deployment:

1. Go to your Supabase project dashboard
2. Click **"Authentication"** in the left sidebar
3. Click **"Providers"** 
4. Click **"Email"** provider
5. Make sure it's enabled (toggle should be ON)
6. Go to **Settings** > **URL Configuration**
7. Add your Vercel URL to the **"Authorized redirect URLs"**:
   ```
   https://yearbook-app-abc123.vercel.app/**
   ```
   (Replace with your actual Vercel URL)
8. Click **"Save"**

Now users can sign up and log in from your live Vercel site!

### Step 4.7: Test Your Live App

1. Go to your Vercel URL: `https://yearbook-app-abc123.vercel.app`
2. Test all features:
   - View the homepage
   - Create a new account (sign up)
   - Create/edit your profile
   - Publish your profile
   - View published profiles on home page
   - Access admin panel (if you're logged in as admin)

### Step 4.8: Share Your App

Your yearbook is now live! Share the Vercel URL with your classmates:
- Text the link
- Post on social media
- Email it to your class
- Add it to your school's website

---

## Updating Your App

### Make Changes Locally

After deploying, you might want to make changes. Here's the workflow:

1. Make changes to files in your project folder
2. Test locally with `npm run dev`
3. When satisfied, commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. Vercel will automatically redeploy your app! (watch your Vercel dashboard for the build progress)

---

## Troubleshooting

### Issue: "Environment variables not found" error

**Solution:**
1. Make sure you added all three variables in Vercel
2. Restart the deployment: Go to Vercel dashboard > Your project > Redeploy
3. Check that variable names are spelled exactly: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_EMAIL`

### Issue: Can't log in on live site

**Solution:**
1. Make sure you created a user account with sign up first
2. Check that your Supabase URL is configured correctly in environment variables
3. Verify Supabase auth is enabled in your Supabase dashboard
4. Check "URL Configuration" in Supabase and verify your Vercel URL is authorized

### Issue: "Invalid path specified in request URL" error on signup/login

**Solution:**
This error means the Supabase environment variables are not configured. Follow these steps:

1. **Verify environment variables are set in .env.local:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
   ```

2. **Make sure all three variables are present** - if even one is missing, you'll get this error

3. **Restart the dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   pnpm dev
   ```

4. **Clear your browser cache** - sometimes browsers cache old errors

5. **Check the console for a clearer error message** - Open Developer Tools (F12) and look at the Console tab

### Issue: Photos don't upload

**Solution:**
- The current version doesn't have file upload. To add this:
  1. Modify the dashboard form to accept file uploads
  2. Use Supabase Storage to store photos
  3. Save the storage URL to the database
  - This would require additional code changes (beyond this setup guide)

### Issue: "Cannot find module" errors

**Solution:**
1. Make sure you ran `npm install` (not just `npm` or `yarn`)
2. Delete `node_modules` folder: `rm -rf node_modules`
3. Delete `package-lock.json` file
4. Run again: `npm install`

### Issue: Port 3000 already in use

**Solution:**
```bash
# On Mac/Linux, find what's using port 3000
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

---

## Advanced: Custom Domain (Optional)

If you want a custom domain (e.g., `yearbook.myschool.edu`):

1. Purchase a domain from a registrar (GoDaddy, Namecheap, etc.)
2. In Vercel dashboard, go to **Settings** > **Domains**
3. Click **"Add Domain"**
4. Enter your domain name
5. Follow Vercel's instructions to update your domain's DNS settings
6. Wait 24-48 hours for DNS to propagate

---

## Next Steps

- Invite students to create profiles
- Set their quotes and personalize their entries
- Admins can manage which profiles appear publicly
- Keep the app live for your class to enjoy memories!

---

## Support

If you get stuck:
1. Check the troubleshooting section above
2. Re-read the specific section of this guide
3. Search Google for the exact error message
4. Ask in the Vercel or Supabase community forums

Good luck with your yearbook app! 🎉
