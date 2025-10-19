# Fix Gallery Images - Quick Guide

## What's Wrong?

Your production site is missing the `BLOB_READ_WRITE_TOKEN` environment variable needed to access Vercel Blob Storage where your images are stored.

## Fix It in 3 Steps

### Step 1: Set Environment Variable in Vercel (2 minutes)

1. Go to: https://vercel.com
2. Select project: **olliedoesis**
3. Go to: **Settings → Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** `vercel_blob_rw_cmwftDzghQ2dUtiZ_KSBSHBmnRnN3WC7mShsLfTVtfNZCrQ`
   - **Environments:** Check all three (Production, Preview, Development)
6. Click **Save**

### Step 2: Push Code to GitHub (1 minute)

Open terminal in `c:\olliedoesis` and run:

```bash
git push origin chore/strict-types-and-copilot
```

If you need to merge to main first:

```bash
git checkout main
git merge chore/strict-types-and-copilot
git push origin main
```

### Step 3: Verify (2 minutes)

1. Wait 1-2 minutes for Vercel to deploy
2. Visit: https://olliedoesis.dev/gallery
3. You should see images!

## Still Not Working?

### Check Vercel Deployment Status

1. Go to: https://vercel.com/your-project/deployments
2. Latest deployment should show "Ready"
3. Click on it and check "Build Logs" for errors

### Check Environment Variable Was Added

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Confirm `BLOB_READ_WRITE_TOKEN` is listed
3. Confirm it's enabled for "Production"

### Force Redeploy

1. Go to: https://vercel.com/your-project/deployments
2. Click on latest deployment
3. Click "..." menu → "Redeploy"

## Understanding What Happened

Your gallery images are stored in **Vercel Blob Storage** (cloud storage), not in your `public/` folder.

**Architecture:**
```
Gallery Page → API (/api/admin/upload) → Database (metadata) → Vercel Blob (actual images)
```

**What was wrong:**
- ✅ Local had the token → images work
- ❌ Production missing token → images don't work
- ✅ Same database for both
- ❌ Gallery code not committed

**What we fixed:**
1. ✅ Committed gallery code
2. 🔜 You'll add the token to Vercel
3. 🔜 You'll push the code
4. ✅ Images will work!

## Need More Info?

See `DEPLOYMENT_WORKFLOW_GUIDE.md` for the complete development-to-deployment workflow explanation.

---

**Created:** 2024-10-18
**Issue:** Production gallery images not displaying
**Cause:** Missing BLOB_READ_WRITE_TOKEN environment variable
**Fix Time:** ~5 minutes
