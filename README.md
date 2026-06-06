# Yearbook Website

A beautiful digital yearbook application built with Next.js 16 and Supabase. Celebrate your class with profiles, quotes, and memorable moments.

## Features

- **Public Gallery**: Browse all published student profiles with photos
- **Student Profiles**: Upload photos, add quotes, and manage your profile
- **Photo Upload**: Drag-and-drop or click to upload JPG/PNG photos (max 5MB)
- **Photo Preview**: See live preview before saving your profile
- **Authentication**: Secure login and signup with Supabase Auth
- **File Storage**: Photos stored securely in Supabase Storage with public access
- **Admin Dashboard**: Manage profiles, control publishing, and moderate content
- **Responsive Design**: Beautiful interface with Playfair Display and DM Sans typography
- **Color Scheme**: Elegant cream, navy, and gold aesthetic

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (for profile photos)
- **Styling**: Tailwind CSS with custom color system
- **Typography**: Playfair Display (headings) + DM Sans (body)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Go to the project settings and copy your:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 2. Create the Database Schema

In your Supabase project, run this SQL in the SQL editor:

```sql
-- Create profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quote text not null,
  photo_url text,
  published boolean default false,
  user_email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
-- Allow anyone to read published profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (published = true);

-- Allow users to read their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Allow admins to delete profiles
create policy "Admins can delete profiles"
  on public.profiles for delete
  using (auth.jwt() ->> 'email' = 'admin@example.com');
```

### 3. Set Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
   ```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Set Up Photo Storage (Required for Upload)

Follow the instructions in [UPLOAD_SETUP.md](./UPLOAD_SETUP.md) to:
- Create a `yearbook-photos` storage bucket in Supabase
- Configure RLS policies for file uploads
- Enable public access to photos

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your yearbook!

## Pages

- **Home** (`/`): Public gallery of published profiles
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): Create a new account
- **Dashboard** (`/dashboard`): Manage your student profile
- **Admin** (`/admin`): Admin panel (restricted to admin email)

## User Roles

### Student
- Create and edit their profile
- Upload a photo
- Write a yearbook quote
- Choose to publish or keep profile private

### Admin
- View all profiles
- Publish/unpublish profiles
- Delete profiles
- Manage moderation

## Customization

### Colors
Edit the color tokens in `/app/globals.css` to change the theme:
- `--background`: Cream background
- `--primary`: Navy blue
- `--secondary`: Gold accent

### Fonts
Fonts are defined in `/app/layout.tsx`:
- Heading font: Playfair Display
- Body font: DM Sans

### Admin Email
Update `NEXT_PUBLIC_ADMIN_EMAIL` in your environment variables to set who has admin access.

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

## License

MIT
