# File Upload Feature - Implementation Checklist

Follow this checklist to get the photo upload feature live on your deployed app.

## Phase 1: Code is Ready (DONE)

Your codebase has been updated with:

- [x] Storage utility functions (`/lib/supabase/storage.ts`)
- [x] Dashboard file upload UI (`/app/dashboard/page.tsx`)
- [x] Profile card image display (`/components/profile-card.tsx`)
- [x] Drag-and-drop interface
- [x] File validation (type, size)
- [x] Image preview
- [x] Upload progress indicator
- [x] Error handling

## Phase 2: Local Testing (Before Deploying)

Do this on your local machine before pushing to GitHub:

1. **Start Local Server**
   ```bash
   pnpm dev
   ```

2. **Create Test Account**
   - Go to http://localhost:3000/signup
   - Create an account with your test email
   - Fill in all fields

3. **Test Photo Upload**
   - Go to http://localhost:3000/dashboard
   - Try uploading a JPG photo
   - See preview appear
   - Try uploading a PNG photo
   - Try uploading a file larger than 5MB (should fail)
   - Try uploading a .gif file (should fail)

4. **Test Save and Display**
   - Upload a valid photo
   - Click "Save Profile"
   - Should show success message
   - Go to http://localhost:3000
   - Your profile should appear with the photo

5. **Test Drag-and-Drop**
   - On dashboard, try dragging a photo to the upload zone
   - Should work just like clicking

6. **Test Remove**
   - Upload a photo
   - Click the X button on preview
   - Photo should be removed
   - Save profile

## Phase 3: Update Supabase Storage (Required)

MUST do this before deploying. Follow [UPLOAD_SETUP.md](./UPLOAD_SETUP.md):

1. **Create Storage Bucket**
   - Go to your Supabase project
   - Create bucket named: `yearbook-photos`
   - Enable public access

2. **Configure RLS Policies**
   - Add SELECT policy (public read)
   - Add INSERT policy (authenticated users)
   - Add UPDATE policy (authenticated users)
   - Add DELETE policy (authenticated users)

3. **Test Storage**
   - Go back to local dashboard
   - Try uploading a photo
   - Check if file appears in Supabase Storage dashboard

## Phase 4: Push Code to GitHub

Once local testing passes:

```bash
git add .
git commit -m "Add photo upload feature"
git push origin main
```

## Phase 5: Redeploy to Vercel

1. Go to your Vercel dashboard
2. Your project should auto-redeploy when code is pushed
3. Wait for deployment to complete
4. Check the deployment status

## Phase 6: Test Live App

Test on your deployed Vercel URL:

1. **Test Live Signup**
   - Go to your Vercel URL
   - Create new account
   - Use a different email than local testing

2. **Test Photo Upload on Live**
   - Go to `/dashboard`
   - Upload a photo
   - Should work just like local

3. **Verify Storage**
   - Go to Supabase Storage dashboard
   - Check `yearbook-photos` bucket
   - Should see file with path: `user-id/profile-*.jpg`

4. **Check Gallery**
   - Publish your profile on dashboard
   - Go to home page (`/`)
   - Your profile with photo should appear

5. **Test Admin Functions**
   - Create another account with admin email
   - Go to `/admin`
   - Should see all profiles
   - Should see photos in admin panel

## Phase 7: Share with Students

Once everything works:

1. **Create Instructions**
   - Write simple guide for students
   - Include your app URL
   - Explain how to upload photos

2. **Share URL**
   - Send students your Vercel URL
   - They can sign up and add photos

3. **Monitor Activity**
   - Check admin panel for new profiles
   - Verify photos appear in gallery
   - Moderate if needed

## Troubleshooting

### Problem: Photos upload locally but not on Vercel

**Solution:**
- Check environment variables in Vercel are set correctly
- Verify Supabase credentials match deployed app
- Check Vercel logs for errors

### Problem: Storage bucket not found

**Solution:**
- Create `yearbook-photos` bucket in Supabase
- Enable public access
- Verify bucket name is exact

### Problem: Photos don't appear in gallery

**Solution:**
- Verify profile is marked as "published"
- Check that `photo_url` was saved to database
- Verify photo file exists in Supabase Storage
- Check Supabase RLS policies

### Problem: File upload fails silently

**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify Supabase credentials
- Check file size (under 5MB)
- Check file type (JPG or PNG)

## Quick Reference

### Important URLs
- Local app: http://localhost:3000
- Your Vercel app: https://your-app-name.vercel.app
- Supabase dashboard: https://app.supabase.com
- Vercel dashboard: https://vercel.com/dashboard

### Key Files Modified
- `/lib/supabase/storage.ts` - Upload functions
- `/app/dashboard/page.tsx` - Upload UI
- `/components/profile-card.tsx` - Display images

### Key Files to Reference
- `UPLOAD_SETUP.md` - Storage setup guide
- `DEPLOY_WITH_UPLOADS.md` - Deployment guide
- `FILE_UPLOAD_SUMMARY.md` - Feature overview

## Success Criteria

Your photo upload feature is successful when:

- [x] Users can drag-drop photos
- [x] Users get instant preview
- [x] Photos are stored in Supabase
- [x] Photos appear in gallery
- [x] Admin can manage photos
- [x] Everything works on live Vercel URL
- [x] No console errors
- [x] Storage quota not exceeded

## Next Steps

After photo upload is working:

1. **Gather Feedback**
   - Ask students what works/what doesn't
   - Look for issues

2. **Potential Future Features**
   - Multiple photos per profile
   - Photo gallery
   - Comments on profiles
   - Ratings/reactions

3. **Monitor Usage**
   - Check storage usage
   - Monitor bandwidth
   - Review admin logs

4. **Optimize**
   - Add image compression if needed
   - Optimize photo sizes
   - Add caching if needed

## Getting Help

If you get stuck:

1. Check the error message in browser console (F12)
2. Review [FILE_UPLOAD_SUMMARY.md](./FILE_UPLOAD_SUMMARY.md)
3. Check [UPLOAD_SETUP.md](./UPLOAD_SETUP.md) for storage issues
4. Review [DEPLOY_WITH_UPLOADS.md](./DEPLOY_WITH_UPLOADS.md) for deployment issues

## Deployment Timeline

Typical timeline to get photos working:

- **Local Testing**: 15-30 minutes
- **Supabase Setup**: 10-15 minutes
- **Code Push**: 5 minutes
- **Vercel Redeploy**: 2-5 minutes
- **Live Testing**: 10-15 minutes
- **Total**: About 1 hour

Ready to get photos working? Start with Phase 2 above! 🎉
