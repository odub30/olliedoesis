# Complete Development-to-Deployment Workflow Guide

## Table of Contents
1. [Understanding Your Architecture](#understanding-your-architecture)
2. [Root Cause of Gallery Issue](#root-cause-of-gallery-issue)
3. [Fix Steps (Do This Now)](#fix-steps-do-this-now)
4. [Complete Development Workflow](#complete-development-workflow)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Best Practices](#best-practices)

---

## Understanding Your Architecture

### Your Tech Stack
```
┌─────────────────────────────────────────────────────┐
│              YOUR APPLICATION                        │
├─────────────────────────────────────────────────────┤
│ Frontend:                                           │
│ • Next.js 15.5.4 (React 19)                        │
│ • Tailwind CSS for styling                          │
│ • Framer Motion for animations                      │
│ • Lucide React for icons                            │
│ • Radix UI for components                           │
│                                                     │
│ Backend:                                            │
│ • Next.js API Routes                                │
│ • Prisma ORM (PostgreSQL)                           │
│ • NextAuth.js for authentication                    │
│                                                     │
│ Storage:                                            │
│ • Vercel Blob Storage (for images)                  │
│ • PostgreSQL database (for metadata)                │
│                                                     │
│ Deployment:                                         │
│ • Vercel (hosting + deployment)                     │
│ • GitHub (version control)                          │
└─────────────────────────────────────────────────────┘
```

### How Gallery Images Work

**IMPORTANT:** Your gallery does NOT use static images from the `public/` folder!

```
Local Development                    Production
┌──────────────────┐                ┌──────────────────┐
│                  │                │                  │
│  Your Browser    │                │  User's Browser  │
│                  │                │                  │
└────────┬─────────┘                └────────┬─────────┘
         │                                   │
         │ /gallery page request             │
         │                                   │
         ▼                                   ▼
┌──────────────────┐                ┌──────────────────┐
│   Next.js App    │                │   Next.js App    │
│   (localhost)    │                │   (Vercel)       │
└────────┬─────────┘                └────────┬─────────┘
         │                                   │
         │ Fetch /api/admin/upload           │
         │                                   │
         ▼                                   ▼
┌──────────────────┐                ┌──────────────────┐
│  API Route       │                │  API Route       │
│  (Auth Check)    │                │  (Auth Check)    │
└────────┬─────────┘                └────────┬─────────┘
         │                                   │
         │ Query database                    │
         │                                   │
         ▼                                   ▼
┌──────────────────┐                ┌──────────────────┐
│  PostgreSQL DB   │ ◄───SAME DB───►│  PostgreSQL DB   │
│  (Prisma Cloud)  │                │  (Prisma Cloud)  │
└────────┬─────────┘                └────────┬─────────┘
         │                                   │
         │ Return image URLs                 │
         │                                   │
         ▼                                   ▼
┌──────────────────┐                ┌──────────────────┐
│  Vercel Blob     │                │  Vercel Blob     │
│  (Local Token)   │                │  (NEEDS TOKEN!)  │
│  ✅ Working      │                │  ❌ Not Working  │
└──────────────────┘                └──────────────────┘
```

**Key Insight:** Both local and production use the SAME database, but production is missing the Vercel Blob token!

---

## Root Cause of Gallery Issue

### The Problem

Your **production environment on Vercel** is missing the `BLOB_READ_WRITE_TOKEN` environment variable.

**Evidence:**

File: `.env.production` (this file is NOT used by Vercel!)
```bash
BLOB_READ_WRITE_TOKEN="your_production_blob_token_here"  # ❌ Placeholder
```

File: `.env.local` (your local working environment)
```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_cmwftDzghQ2dUtiZ_..."  # ✅ Real token
```

### Why This Causes the Issue

1. **Local Development:** When you upload images via the admin panel, they are stored in Vercel Blob Storage using your local token
2. **Database Records:** Image metadata (URL, alt text, etc.) is saved to your PostgreSQL database
3. **Production Problem:** When production queries the database, it gets the image records, but the Blob Storage URLs are inaccessible without the token
4. **Result:** Gallery structure loads, but images don't display

### Secondary Issue

The `src/app/gallery/` folder was not committed to Git, so even after fixing the token, production wouldn't have the gallery page code.

**Status:** ✅ Fixed (we just committed it)

---

## Fix Steps (Do This Now)

### Step 1: Configure Vercel Blob Token

1. **Go to your Vercel Dashboard:**
   - Visit: https://vercel.com
   - Select your project: `olliedoesis`

2. **Navigate to Environment Variables:**
   ```
   Project Settings → Environment Variables
   ```

3. **Add the Blob Token:**

   Click "Add New" and enter:

   | Field | Value |
   |-------|-------|
   | **Name** | `BLOB_READ_WRITE_TOKEN` |
   | **Value** | `vercel_blob_rw_cmwftDzghQ2dUtiZ_KSBSHBmnRnN3WC7mShsLfTVtfNZCrQ` |
   | **Environment** | ✅ Production<br>✅ Preview<br>✅ Development |

4. **Save the variable**

### Step 2: Push Code to GitHub

Your gallery code has been committed but not pushed yet:

```bash
# From c:\olliedoesis directory
git push origin chore/strict-types-and-copilot
```

### Step 3: Merge to Main (if needed)

If your main branch is what's deployed to production:

```bash
# Switch to main branch
git checkout main

# Merge your feature branch
git merge chore/strict-types-and-copilot

# Push to GitHub
git push origin main
```

OR use GitHub's Pull Request interface to merge the branch.

### Step 4: Trigger Deployment

Vercel automatically deploys when you push to your production branch, but you can also:

1. **Automatic:** Just wait 1-2 minutes after pushing
2. **Manual:** Go to Vercel Dashboard → Deployments → Click "Redeploy"

### Step 5: Verify the Fix

1. **Wait for deployment to complete** (check Vercel dashboard)
2. **Visit:** https://olliedoesis.vercel.app/gallery OR https://olliedoesis.dev/gallery
3. **You should see:** Images displaying correctly

---

## Complete Development Workflow

### Phase 1: Local Development

#### Setup Your Environment

1. **Clone the repository** (if starting fresh)
   ```bash
   git clone https://github.com/yourusername/olliedoesis.git
   cd olliedoesis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` with:
   ```bash
   # Database (Prisma Accelerate)
   DATABASE_URL="your_database_url"

   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="your_blob_token"

   # NextAuth
   AUTH_SECRET="your_auth_secret"
   NEXTAUTH_URL="http://localhost:3000"

   # ... other variables
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Visit: http://localhost:3000

#### Development Best Practices

**File Organization:**
```
c:\olliedoesis
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # Reusable React components
│   ├── lib/             # Utility functions and configs
│   └── styles/          # Global styles
├── public/              # Static assets (icons, fonts)
│   ├── images/          # Static images (NOT gallery images)
│   ├── icons/
│   └── vectors/
├── prisma/
│   └── schema.prisma    # Database schema
├── .env.local          # Local environment variables
└── package.json        # Dependencies
```

**What Goes Where:**

| Type | Location | Git Tracked? |
|------|----------|--------------|
| **Source code** | `src/` | ✅ Yes |
| **Static assets** (favicon, logos) | `public/` | ✅ Yes |
| **Gallery images** | Vercel Blob Storage | ❌ No (in cloud) |
| **Image metadata** | PostgreSQL database | ❌ No (in cloud) |
| **Environment variables** | `.env.local` | ❌ No (gitignored) |
| **Dependencies** | `node_modules/` | ❌ No (gitignored) |
| **Build output** | `.next/` | ❌ No (gitignored) |

### Phase 2: Git Workflow

#### Before Committing

1. **Check what changed:**
   ```bash
   git status
   git diff
   ```

2. **Test your changes:**
   ```bash
   npm run build      # Test production build
   npm run lint       # Check for linting errors
   npm run type-check # TypeScript validation
   ```

#### Committing Code

1. **Stage your changes:**
   ```bash
   # Stage specific files
   git add src/components/MyComponent.tsx

   # OR stage all changes (be careful!)
   git add .
   ```

2. **Commit with a clear message:**
   ```bash
   git commit -m "Add gallery filtering feature with tag support"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin your-branch-name
   ```

#### What NOT to Commit

Your `.gitignore` file prevents these from being committed:

```gitignore
# Never commit these:
.env*                    # Environment variables (SECRETS!)
!.env.example           # But DO commit example files
node_modules/           # Dependencies (too large)
.next/                  # Build output (regenerated)
*.log                   # Log files
.vercel/               # Vercel build cache
*.tsbuildinfo          # TypeScript cache
```

**Why?**
- `.env*` files contain **secrets** (database passwords, API keys)
- `node_modules/` can be regenerated with `npm install`
- `.next/` is rebuilt on every deployment

### Phase 3: Deployment Process

#### How Vercel Deploys Your Site

```
┌─────────────────────────────────────────────────────┐
│ Step 1: You push code to GitHub                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 2: GitHub webhook triggers Vercel             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 3: Vercel clones your repository              │
│         • Downloads code from GitHub                │
│         • Checks out the branch you pushed          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 4: Install dependencies                        │
│         • Runs: npm install                         │
│         • Downloads all packages from package.json  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 5: Set environment variables                   │
│         • Injects env vars from Vercel dashboard    │
│         • NOT from .env.production!                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 6: Run build command                           │
│         • Runs: npm run build                       │
│         • Compiles TypeScript                       │
│         • Generates Tailwind CSS                    │
│         • Optimizes assets                          │
│         • Runs Prisma generate                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 7: Deploy to CDN                               │
│         • Uploads build to Vercel's edge network    │
│         • Generates unique deployment URL           │
│         • Updates production domain                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 8: Your site is live!                          │
│         • olliedoesis.vercel.app                    │
│         • olliedoesis.dev                           │
└─────────────────────────────────────────────────────┘
```

#### Environment Variables in Deployment

**CRITICAL:** Vercel does NOT use `.env.production` or `.env.local` files!

```
❌ WRONG: Vercel reads .env.production
✅ RIGHT: Vercel reads environment variables from dashboard
```

**How to set environment variables on Vercel:**

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add each variable manually:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - etc.

3. Choose which environments get each variable:
   - **Production:** Live site (olliedoesis.dev)
   - **Preview:** Pull request previews
   - **Development:** Local development (via `vercel dev`)

**Best Practice:**

Keep a `.env.example` file in your repo (safe to commit):

```bash
# .env.example
# Copy this to .env.local and fill in your values

DATABASE_URL="your_database_url_here"
BLOB_READ_WRITE_TOKEN="your_blob_token_here"
AUTH_SECRET="your_auth_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

This helps you remember which variables are needed without exposing secrets.

#### Static Assets vs. Dynamic Content

**Static Assets** (in `public/` folder):
```
public/
├── favicon.ico          ✅ Deployed with code
├── icons/logo.svg       ✅ Deployed with code
└── images/
    └── avatar.jpg       ✅ Deployed with code
```
- These files are committed to Git
- Included in your deployment
- Served from Vercel's CDN
- Good for: logos, icons, fonts, fixed images

**Dynamic Content** (Vercel Blob Storage):
```
Vercel Blob Storage
├── gallery-image-1.jpg  ❌ NOT in Git
├── gallery-image-2.jpg  ❌ NOT in Git
└── blog-hero.png        ❌ NOT in Git
```
- NOT committed to Git
- Uploaded via your admin panel
- Stored in cloud storage
- Metadata in database
- Good for: user uploads, gallery images, blog images

**Why the distinction?**
- **Static assets:** Change rarely, part of your design
- **Dynamic content:** Changes frequently, managed by CMS/admin

### Phase 4: Verification

#### After Each Deployment

1. **Check build status:**
   - Visit: Vercel Dashboard → Deployments
   - Wait for "Ready" status (usually 1-2 minutes)

2. **Review build logs:**
   - Click on the deployment
   - Check "Build Logs" tab
   - Look for errors or warnings

3. **Test the live site:**
   ```
   ✅ Homepage loads
   ✅ Navigation works
   ✅ Gallery displays images
   ✅ Admin panel accessible
   ✅ No console errors (F12 → Console)
   ```

4. **Check environment variables are working:**
   - Database connections working?
   - Authentication working?
   - Image uploads working?

---

## Troubleshooting Guide

### Issue 1: Local Works, Production Doesn't

**Symptoms:**
- Feature works on localhost
- Same feature broken on production

**Diagnosis:**

1. **Check environment variables:**
   ```bash
   # Are they set in Vercel dashboard?
   # Do they match your local .env.local?
   ```

2. **Check build logs:**
   - Look for errors during build
   - Missing dependencies?
   - TypeScript errors?

3. **Check browser console:**
   - Visit production site
   - Press F12 → Console tab
   - Any errors?

**Common Causes:**
- ❌ Missing environment variable on Vercel
- ❌ Database connection issue
- ❌ API route not committed
- ❌ Hardcoded `localhost` URL in code

**Solution:**
1. Add missing env vars to Vercel
2. Redeploy

### Issue 2: Images Not Showing

**Symptoms:**
- Gallery structure loads
- Images don't display
- Broken image icons

**Diagnosis:**

1. **Check network tab:**
   - F12 → Network tab
   - Try loading gallery
   - Are image URLs returning 403 or 404?

2. **Check image URLs:**
   - Right-click broken image → Inspect
   - Look at `src` attribute
   - Does URL look correct?

3. **Check API response:**
   - Visit: `/api/admin/upload`
   - Are images being returned?
   - Are URLs valid?

**Common Causes:**
- ❌ Missing `BLOB_READ_WRITE_TOKEN`
- ❌ Images not uploaded to blob storage
- ❌ Database empty (no image records)
- ❌ Authentication failing on API route

**Solution:**
1. Set `BLOB_READ_WRITE_TOKEN` in Vercel
2. Upload images via admin panel
3. Ensure you're logged in as ADMIN

### Issue 3: Build Fails on Vercel

**Symptoms:**
- Deployment fails
- Build logs show errors

**Common Errors:**

**TypeScript Error:**
```
Type error: Property 'foo' does not exist on type 'Bar'
```
**Solution:**
- Fix TypeScript errors locally first
- Run `npm run type-check`
- Commit fixes and push

**Module Not Found:**
```
Error: Cannot find module 'some-package'
```
**Solution:**
- Install missing dependency: `npm install some-package`
- Commit `package.json` and `package-lock.json`
- Push to GitHub

**Environment Variable Missing:**
```
Error: DATABASE_URL is not defined
```
**Solution:**
- Add `DATABASE_URL` to Vercel environment variables
- Redeploy

**Out of Memory:**
```
JavaScript heap out of memory
```
**Solution:**
- Your `next.config.mjs` already has optimizations
- May need to simplify build or upgrade Vercel plan

### Issue 4: 404 Page Not Found

**Symptoms:**
- Specific page returns 404 on production
- Works locally

**Common Causes:**
- ❌ Page file not committed to Git
- ❌ File in wrong directory
- ❌ Dynamic route not working

**Solution:**
1. Check file is in Git:
   ```bash
   git ls-files | grep "your-page.tsx"
   ```

2. If missing, add and commit:
   ```bash
   git add src/app/your-page/page.tsx
   git commit -m "Add missing page"
   git push
   ```

### Issue 5: Styles Not Loading

**Symptoms:**
- Site loads but looks unstyled
- Tailwind classes not working

**Common Causes:**
- ❌ Tailwind config not committed
- ❌ PostCSS config missing
- ❌ CSS file not imported
- ❌ Build cache issue

**Solution:**
1. Ensure these files are committed:
   - `tailwind.config.js`
   - `postcss.config.mjs`
   - `src/app/globals.css`

2. Clear build cache:
   - Vercel Dashboard → Settings → Clear Build Cache
   - Redeploy

---

## Best Practices

### Development

**1. Always test locally before committing:**
```bash
npm run dev        # Start dev server
npm run build      # Test production build
npm run lint       # Check code quality
npm run type-check # Validate TypeScript
```

**2. Use meaningful commit messages:**
```bash
❌ git commit -m "fix stuff"
✅ git commit -m "Fix gallery image loading with proper blob token handling"
```

**3. Keep dependencies up to date:**
```bash
npm outdated       # Check for updates
npm update        # Update packages
```

**4. Use environment variables for secrets:**
```typescript
❌ const apiKey = "sk_live_123456789"  // Never hardcode!
✅ const apiKey = process.env.API_KEY   // Always use env vars
```

### Git Workflow

**1. Create feature branches:**
```bash
git checkout -b feature/gallery-filters
# ... make changes ...
git add .
git commit -m "Add tag filtering to gallery"
git push origin feature/gallery-filters
```

**2. Use pull requests:**
- Create PR on GitHub
- Review changes
- Merge to main
- Delete feature branch

**3. Keep main branch clean:**
- Only merge tested code
- Always review before merging
- Use branch protection rules

### Deployment

**1. Monitor deployments:**
- Check Vercel dashboard after each push
- Review build logs
- Test live site

**2. Use preview deployments:**
- Each PR gets a preview URL
- Test before merging to main
- Share with others for feedback

**3. Rollback if needed:**
- Vercel Dashboard → Deployments
- Find previous working deployment
- Click "..." → "Promote to Production"

### Security

**1. Never commit secrets:**
```bash
❌ .env.local          # Contains secrets
❌ .env.production     # Contains secrets
✅ .env.example       # Safe template
```

**2. Rotate secrets regularly:**
- Change API keys periodically
- Update AUTH_SECRET
- Regenerate database passwords

**3. Use environment-specific values:**
```bash
# Development
NEXTAUTH_URL="http://localhost:3000"

# Production
NEXTAUTH_URL="https://olliedoesis.dev"
```

### Performance

**1. Optimize images:**
```bash
npm run optimize:image  # Your custom script
```

**2. Use Next.js Image component:**
```tsx
❌ <img src="/image.jpg" />
✅ <Image src="/image.jpg" width={500} height={300} />
```

**3. Monitor Core Web Vitals:**
- Use Vercel Analytics
- Check Lighthouse scores
- Optimize based on metrics

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Run production build locally
npm run lint            # Check code quality
npm run type-check      # Validate TypeScript

# Git
git status              # Check what changed
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
git pull                # Get latest changes

# Prisma
npx prisma generate     # Generate Prisma client
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Run migrations

# Deployment
git push origin main    # Triggers auto-deploy
# OR use Vercel dashboard to manually redeploy
```

### File Checklist

Before deploying a new feature, ensure these are committed:

```bash
✅ Source code (src/)
✅ Configuration files (next.config.mjs, tailwind.config.js)
✅ Package files (package.json, package-lock.json)
✅ Environment variable template (.env.example)
❌ Environment variables (.env.local, .env.production)
❌ Dependencies (node_modules/)
❌ Build output (.next/)
```

### Environment Variable Checklist

Ensure these are set in Vercel dashboard:

```bash
✅ DATABASE_URL
✅ BLOB_READ_WRITE_TOKEN
✅ AUTH_SECRET
✅ NEXTAUTH_URL
✅ Any third-party API keys
```

---

## Summary

### What You Learned

1. **Architecture:** Your app uses Vercel Blob for images, not the public folder
2. **Environment Variables:** Must be set in Vercel dashboard, not in `.env.production`
3. **Git Workflow:** Code must be committed and pushed to deploy
4. **Deployment Process:** GitHub → Vercel → Build → Deploy
5. **Troubleshooting:** How to diagnose and fix common issues

### Key Takeaways

- ✅ **Local ≠ Production:** Different environments, same codebase
- ✅ **Secrets in Vercel:** Environment variables go in dashboard
- ✅ **Test Before Deploy:** Always build and test locally first
- ✅ **Monitor Deployments:** Check logs and live site after each deploy
- ✅ **Document Everything:** Keep this guide updated as you learn

### Next Steps

1. ✅ Set `BLOB_READ_WRITE_TOKEN` in Vercel dashboard
2. ✅ Push gallery code to GitHub
3. ✅ Verify deployment succeeded
4. ✅ Test gallery on production
5. 🎉 Celebrate - you now understand the full workflow!

---

**Last Updated:** 2024-10-18
**Author:** Claude Code
**Project:** olliedoesis (Next.js Portfolio)
