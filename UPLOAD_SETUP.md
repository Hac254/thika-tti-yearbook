# Photo Upload Setup Guide

This guide covers setting up file upload functionality for the Yearbook app. Students will be able to upload profile photos that are stored in Supabase Storage.

## Phase 1: Supabase Storage Configuration

### Step 1: Create a Storage Bucket in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the bucket name to: `yearbook-photos`
5. **Enable public file access** (toggle the switch ON)
6. Click **Create bucket**

### Step 2: Set Up Storage Bucket Policies

After creating the bucket, you need to configure RLS (Row Level Security) policies:

1. Click on the `yearbook-photos` bucket
2. Click on the **Policies** tab
3. Click **New Policy** and select **For SELECT (public access)**
4. Set these parameters:
   - Name: `Allow public read access`
   - Template: `For public buckets`
   - Click **Review** and then **Create policy**

5. Click **New Policy** again and select **For INSERT**
6. Set these parameters:
   - Name: `Allow authenticated users to upload`
   - Template: `For authenticated users`
   - Paste this policy:
     ```sql
     (auth.role() = 'authenticated'::text)
     AND (bucket_id = 'yearbook-photos'::text)
     AND ((storage.foldername(name))[1] = auth.uid()::text)
     ```
   - Click **Review** and then **Create policy**

7. Click **New Policy** again and select **For UPDATE**
8. Set these parameters:
   - Name: `Allow users to update own files`
   - Template: `For authenticated users`
   - Paste this policy:
     ```sql
     (auth.role() = 'authenticated'::text)
     AND (bucket_id = 'yearbook-photos'::text)
     AND ((storage.foldername(name))[1] = auth.uid()::text)
     ```
   - Click **Review** and then **Create policy**

9. Click **New Policy** again and select **For DELETE**
10. Set these parameters:
    - Name: `Allow users to delete own files`
    - Template: `For authenticated users`
    - Paste this policy:
        ```sql
        (auth.role() = 'authenticated'::text)
        AND (bucket_id = 'yearbook-photos'::text)
        AND ((storage.foldername(name))[1] = auth.uid()::text)
        ```
    - Click **Review** and then **Create policy**

### Step 3: Update Database Schema

The profiles table already has a `photo_url` column, so no schema changes are needed. Files will be organized in the bucket under user IDs.

### Step 4: Verify Storage is Working

1. The app is now ready to upload files
2. Files will be stored at: `yearbook-photos/{user-id}/filename.jpg`
3. Public URLs will be: `https://your-supabase-url/storage/v1/object/public/yearbook-photos/{user-id}/filename.jpg`

## Testing the Upload Feature

Once the dashboard is updated with the file upload form:

1. Go to http://localhost:3000/dashboard (or your deployed URL)
2. Log in with your test account
3. You should see a new "Upload Photo" input in the profile form
4. Select a JPG or PNG image (max 5MB)
5. Click "Save Profile"
6. The photo should appear in the preview
7. Go to the home page to see your profile card with the photo

## Troubleshooting

### Issue: "Access Denied" when uploading

- Verify the RLS policies are set correctly
- Make sure you're logged in
- Check that the bucket is named exactly `yearbook-photos`
- Ensure the bucket has public access enabled

### Issue: Photo URL shows 404

- Verify the file was actually uploaded by checking Supabase Storage dashboard
- Make sure your NEXT_PUBLIC_SUPABASE_URL environment variable is correct
- Clear your browser cache

### Issue: File won't upload

- Check file size (must be under 5MB)
- Check file format (must be JPG or PNG)
- Check browser console for error messages
- Verify Supabase credentials are correct

## Environment Variables

No new environment variables needed! The app uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Next Steps

After completing this setup:
1. The updated dashboard will have file upload functionality
2. Students can upload profile photos
3. Photos appear on the home page gallery
4. Admin can see uploaded photos in the admin panel
