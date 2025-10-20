# Admin Login Setup Guide

This guide explains how to configure and use the admin login functionality for https://olliedoesis.dev

## How Authentication Works

Your site uses **NextAuth.js v5** with the following authentication flow:

```
User visits /admin → Middleware checks auth → Redirects to /auth/signin if not logged in
User signs in via GitHub/Email → NextAuth creates session → User redirected back to /admin
First user to sign in automatically gets ADMIN role
```

## Admin Login URL

**Production**: https://olliedoesis.dev/auth/signin
**Development**: http://localhost:3000/auth/signin

## API Auth Endpoints

NextAuth automatically creates these endpoints at `/api/auth/*`:

- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin/:provider` - Initiate OAuth sign in
- `GET /api/auth/callback/:provider` - OAuth callback (GitHub, Google)
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token
- `GET /api/auth/providers` - List available auth providers

## Step-by-Step Setup

### 1. Environment Variables

Update your `.env` or `.env.local` file with production values:

```bash
# Core NextAuth Configuration
NEXTAUTH_URL=https://olliedoesis.dev
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Database (Required)
POSTGRES_DATABASE_URL=<your-production-database-url>

# GitHub OAuth (Required for admin login)
GITHUB_ID=<your-github-oauth-app-client-id>
GITHUB_SECRET=<your-github-oauth-app-client-secret>

# Email Authentication (Optional)
RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=noreply@olliedoesis.dev

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 2. Configure GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Ollie Does Is Portfolio
   - **Homepage URL**: https://olliedoesis.dev
   - **Authorization callback URL**: https://olliedoesis.dev/api/auth/callback/github
4. Click "Register application"
5. Copy the **Client ID** to `GITHUB_ID` in `.env`
6. Generate a new client secret and copy to `GITHUB_SECRET` in `.env`

**Important**: For development, create a separate OAuth app with callback URL: `http://localhost:3000/api/auth/callback/github`

### 3. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in your `.env` file.

### 4. Deploy and Test

1. Deploy your site with the updated environment variables
2. Visit https://olliedoesis.dev/auth/signin
3. Sign in with GitHub
4. **The first user to sign in automatically becomes an admin**
5. After signing in, you should be able to access https://olliedoesis.dev/admin

## How Admin Access Works

### First User Becomes Admin

The system automatically grants ADMIN role to the first user who signs in. This happens in `src/lib/auth.ts`:

```typescript
// Check if this is the first user - make them ADMIN
if (trigger === "signIn" && user) {
  const userCount = await prisma.user.count();

  if (userCount === 1) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    token.role = "ADMIN";
  }
}
```

### Protected Routes

The middleware (`middleware.ts`) protects these routes:

- `/admin/*` - Requires ADMIN role
- `/api/admin/*` - Requires ADMIN role
- `/api/blogs/*` (POST/PUT/DELETE) - Requires ADMIN role
- `/api/projects/*` (POST/PUT/DELETE) - Requires ADMIN role
- `/api/tags/*` (POST/PUT/DELETE) - Requires ADMIN role
- `/api/upload/*` - Requires ADMIN role

### Admin Panel Access

Once logged in as admin, you can access:

- https://olliedoesis.dev/admin - Dashboard
- https://olliedoesis.dev/admin/blogs - Manage blog posts
- https://olliedoesis.dev/admin/projects - Manage projects
- https://olliedoesis.dev/admin/tags - Manage tags
- https://olliedoesis.dev/admin/media - Manage media
- https://olliedoesis.dev/admin/analytics - View analytics

## Troubleshooting

### "Access Denied" Error

**Cause**: User doesn't have ADMIN role
**Solution**: Check database to verify user role:

```sql
SELECT id, email, role FROM "User";
```

If needed, manually grant admin access:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### "Configuration" Error

**Cause**: Missing environment variables
**Solution**: Verify all required env vars are set:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `POSTGRES_DATABASE_URL`

### Sign In Loop (Redirects back to sign in)

**Cause**: Session not being created properly
**Solutions**:
1. Check that `NEXTAUTH_URL` matches your actual domain
2. Verify `NEXTAUTH_SECRET` is set
3. Clear browser cookies and try again
4. Check database connection is working

### OAuth Callback Error

**Cause**: GitHub OAuth callback URL mismatch
**Solution**:
1. Go to GitHub OAuth app settings
2. Verify callback URL is exactly: `https://olliedoesis.dev/api/auth/callback/github`
3. No trailing slashes, must match exactly

### Database Connection Issues

**Cause**: Prisma can't connect to database
**Solution**:
1. Verify `POSTGRES_DATABASE_URL` is correct
2. Check database is accessible from your hosting provider
3. Run migrations: `npx prisma migrate deploy`

## Security Best Practices

1. **Never commit `.env` files** - They contain secrets
2. **Use strong NEXTAUTH_SECRET** - Generate with OpenSSL
3. **Enable 2FA on GitHub** - Protects your OAuth app
4. **Rotate secrets regularly** - Especially if compromised
5. **Monitor admin access** - Check analytics for suspicious activity
6. **Use HTTPS only** - Never use HTTP in production

## Additional Users

To add more admin users:

1. Have them sign in at https://olliedoesis.dev/auth/signin
2. They will be created with PUBLIC role
3. Manually upgrade them to ADMIN via database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'new-admin@example.com';
```

Or create a user management UI in the admin panel (recommended for future enhancement).

## Quick Reference

| What | URL |
|------|-----|
| Admin Login | https://olliedoesis.dev/auth/signin |
| Admin Dashboard | https://olliedoesis.dev/admin |
| Auth API | https://olliedoesis.dev/api/auth/* |
| Sign Out | https://olliedoesis.dev/api/auth/signout |

## Need Help?

Check these files for auth configuration:
- `src/lib/auth.ts` - NextAuth configuration
- `middleware.ts` - Route protection
- `src/app/api/auth/[...nextauth]/route.ts` - API route handler
- `src/app/auth/signin/page.tsx` - Sign in UI
