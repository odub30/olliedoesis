# 🚀 Portfolio Setup Guide

Complete setup guide for the Next.js portfolio application with admin dashboard, authentication, and analytics.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Authentication Setup](#authentication-setup)
- [First Admin User](#first-admin-user)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** database (local or cloud)
- **Git** (for version control)

---

## Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd olliedoesis

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Edit .env.local with your credentials
# See "Environment Variables" section below

# 5. Run database migrations
npx prisma migrate dev

# 6. (Optional) Seed the database
npm run db:seed:blog

# 7. Start the development server
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

---

## Environment Variables

### Required Variables

Edit your `.env.local` file with the following **required** variables:

#### 1. Database

```env
POSTGRES_DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?sslmode=require"
```

**Where to get it:**
- **Local PostgreSQL:** `postgresql://postgres:password@localhost:5432/portfolio`
- **Vercel Postgres:** Copy from Vercel project dashboard
- **Supabase:** Go to Settings → Database → Connection String
- **Railway:** Copy from Railway project variables
- **Neon:** Copy from Neon console

#### 2. NextAuth Configuration

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

**Generate secret:**
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET`.

#### 3. GitHub OAuth

```env
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

**Setup steps:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** `My Portfolio`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** to `GITHUB_ID`
6. Click "Generate a new client secret" and copy it to `GITHUB_SECRET`

#### 4. Email Provider (Resend)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

**Setup steps:**
1. Sign up at [Resend](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys)
3. Click "Create API Key"
4. Copy the key to `RESEND_API_KEY`
5. Set `EMAIL_FROM` to an email you've verified in Resend

### Optional Variables

#### Google OAuth (Optional)

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Setup steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret

#### GitHub API Token (Optional)

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
```

Used for enhanced repository data. Create at [GitHub Tokens](https://github.com/settings/tokens).

---

## Database Setup

### 1. Run Migrations

This creates all necessary database tables:

```bash
npx prisma migrate dev
```

You should see output confirming table creation for:
- User
- Account
- Session
- VerificationToken
- Project
- Blog
- Tag
- Image
- SearchHistory
- SearchAnalytics

### 2. (Optional) Seed Sample Data

Add a sample blog post:

```bash
npm run db:seed:blog
```

### 3. Verify Database

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your data.

---

## Authentication Setup

The application uses **NextAuth.js v5** with three authentication methods:

### 1. GitHub OAuth (Primary)
- Best for developer portfolios
- No password needed
- Users can sign in with their GitHub account

### 2. Email Magic Links
- Passwordless authentication
- Users receive a login link via email
- Powered by Resend

### 3. Google OAuth (Optional)
- Requires Google Cloud setup
- Good for broader audience

### Testing Authentication

1. Start the development server: `npm run dev`
2. Visit: `http://localhost:3000/auth/signin`
3. Try signing in with GitHub
4. Or enter an email to receive a magic link

---

## First Admin User

**Important:** The first user to sign in automatically becomes an admin!

### Setup Steps

1. Start your application: `npm run dev`
2. Navigate to: `http://localhost:3000/auth/signin`
3. Sign in using **any** authentication method
4. You'll be assigned the `ADMIN` role automatically
5. Access the admin dashboard at: `http://localhost:3000/admin`

### Verify Admin Access

After signing in, check if you can access:

- ✅ `/admin` - Admin dashboard
- ✅ `/admin/projects` - Project management
- ✅ `/admin/blogs` - Blog management
- ✅ `/admin/media` - Media library
- ✅ `/admin/analytics` - Analytics dashboard
- ✅ `/admin/tags` - Tag management

### Making Additional Users Admins

Use Prisma Studio or run a direct database query:

```bash
npx prisma studio
```

1. Open the `User` table
2. Find the user
3. Change their `role` field from `PUBLIC` to `ADMIN`

---

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run type-check       # Run TypeScript compiler

# Database
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma Client

# Utilities
npm run clean            # Remove build artifacts
```

### Project Structure

```
olliedoesis/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── blogs/              # Blog pages
│   │   └── projects/           # Project pages
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   ├── features/           # Feature components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── prisma.ts           # Prisma client
│   │   └── admin.ts            # Admin utilities
│   ├── data/                   # Static data
│   │   └── projects/           # Markdown project files
│   └── types/                  # TypeScript types
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain
   - Set up Vercel Postgres for database

4. **Deploy:**
   - Vercel automatically deploys on every push
   - First deployment may take 2-3 minutes

### Environment Variables for Production

Update these for production:

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-new-secret-for-production>
POSTGRES_DATABASE_URL=<your-production-database-url>
```

**Security Notes:**
- Generate a **new** `NEXTAUTH_SECRET` for production
- Use a production-grade database (Vercel Postgres, Supabase, etc.)
- Update OAuth callback URLs in GitHub/Google to use your production domain

---

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solutions:**
1. Verify `POSTGRES_DATABASE_URL` is correct
2. Check if PostgreSQL is running: `pg_isready`
3. Ensure database exists: `createdb portfolio`
4. Check firewall settings for cloud databases

### Authentication Not Working

**Error:** `Configuration error`

**Solutions:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your current URL
3. Verify OAuth credentials (GitHub/Google)
4. Check Resend API key is valid
5. Restart the development server

### Prisma Client Issues

**Error:** `PrismaClient is unable to run in the browser`

**Solutions:**
1. Make sure you're importing from `@/lib/prisma`
2. Don't use Prisma Client in client components
3. Run `npx prisma generate` after schema changes

### Build Errors

**Error:** `Module not found` or type errors

**Solutions:**
1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Run type check: `npm run type-check`

### First User Not Getting Admin Role

**Problem:** Signed in but can't access `/admin`

**Solutions:**
1. Check database - should have exactly 1 user
2. Run this in Prisma Studio:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
3. Sign out and sign in again

### View Tracking Not Working

**Problem:** Analytics shows 0 views

**Solutions:**
1. Ensure database migrations are up to date
2. Check if projects/blogs exist in database (not just markdown files)
3. For projects: Create database entries via admin panel to enable tracking
4. View console logs for tracking errors

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js v5 Guide](https://authjs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages in the console
3. Check the [Next.js Discord](https://discord.gg/nextjs)
4. Open an issue on GitHub

---

## Next Steps

After setup is complete:

1. ✅ **Customize your portfolio:**
   - Update site name and contact info in `.env.local`
   - Add your projects via the admin panel
   - Write blog posts

2. ✅ **Add content:**
   - Go to `/admin/projects/new` to create projects
   - Go to `/admin/blogs/new` to write blog posts
   - Upload images at `/admin/media`

3. ✅ **Configure branding:**
   - Update colors in `tailwind.config.js`
   - Add your logo to `public/`
   - Customize metadata in `src/app/layout.tsx`

4. ✅ **Deploy to production:**
   - Follow the Vercel deployment guide above
   - Set up a custom domain
   - Enable analytics

---

**Happy coding! 🎉**
