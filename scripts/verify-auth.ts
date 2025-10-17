// scripts/verify-auth.ts
/**
 * Auth Configuration Verification Script
 *
 * Run this to verify your authentication setup is correct
 * Usage: npx ts-node scripts/verify-auth.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EnvCheck {
  key: string;
  required: boolean;
  description: string;
}

const envChecks: EnvCheck[] = [
  { key: 'NEXTAUTH_URL', required: true, description: 'NextAuth base URL (should be https://olliedoesis.dev)' },
  { key: 'NEXTAUTH_SECRET', required: true, description: 'NextAuth secret key' },
  { key: 'POSTGRES_DATABASE_URL', required: true, description: 'PostgreSQL database connection' },
  { key: 'GITHUB_ID', required: true, description: 'GitHub OAuth client ID' },
  { key: 'GITHUB_SECRET', required: true, description: 'GitHub OAuth client secret' },
  { key: 'RESEND_API_KEY', required: false, description: 'Resend API key for email auth' },
  { key: 'EMAIL_FROM', required: false, description: 'Email sender address' },
  { key: 'GOOGLE_CLIENT_ID', required: false, description: 'Google OAuth client ID' },
  { key: 'GOOGLE_CLIENT_SECRET', required: false, description: 'Google OAuth client secret' },
];

async function verifyAuth() {
  console.log('🔍 Verifying Authentication Configuration\n');
  console.log('=' . repeat(60));

  let hasErrors = false;
  let hasWarnings = false;

  // Check environment variables
  console.log('\n📋 Environment Variables:\n');

  for (const check of envChecks) {
    const value = process.env[check.key];
    const status = value ? '✅' : (check.required ? '❌' : '⚠️ ');

    console.log(`${status} ${check.key}`);
    console.log(`   ${check.description}`);

    if (value) {
      // Show partial value (hide secrets)
      if (check.key.includes('SECRET') || check.key.includes('KEY')) {
        console.log(`   Value: ${value.substring(0, 10)}...`);
      } else {
        console.log(`   Value: ${value}`);
      }
    } else {
      if (check.required) {
        console.log(`   ⚠️  MISSING - This is required!`);
        hasErrors = true;
      } else {
        console.log(`   ⓘ  Optional - Not configured`);
        hasWarnings = true;
      }
    }
    console.log('');
  }

  // Verify NEXTAUTH_URL
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) {
    console.log('🌐 NEXTAUTH_URL Verification:\n');

    if (nextAuthUrl === 'https://olliedoesis.dev') {
      console.log('✅ Correctly set to production URL');
    } else if (nextAuthUrl === 'http://localhost:3000') {
      console.log('⚠️  Set to development URL (okay for local testing)');
      hasWarnings = true;
    } else {
      console.log(`❌ Unexpected URL: ${nextAuthUrl}`);
      console.log('   Should be: https://olliedoesis.dev (production)');
      console.log('   Or: http://localhost:3000 (development)');
      hasErrors = true;
    }
    console.log('');
  }

  // Check database connection
  console.log('💾 Database Connection:\n');

  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to database');

    // Check users table
    const userCount = await prisma.user.count();
    console.log(`   Total users: ${userCount}`);

    if (userCount > 0) {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      console.log(`   Admin users: ${adminCount}`);

      if (adminCount === 0) {
        console.log('   ⚠️  No admin users found!');
        console.log('   The first user to sign in will become admin automatically.');
        hasWarnings = true;
      } else {
        console.log('   ✅ Admin users configured');

        // Show admin users
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { email: true, name: true },
        });

        console.log('\n   Admin users:');
        admins.forEach(admin => {
          console.log(`   - ${admin.email || 'No email'} (${admin.name || 'No name'})`);
        });
      }
    } else {
      console.log('   ℹ️  No users in database yet');
      console.log('   The first user to sign in will become admin automatically.');
    }

  } catch (error) {
    console.log('❌ Database connection failed!');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    hasErrors = true;
  } finally {
    await prisma.$disconnect();
  }

  console.log('');

  // Check auth files exist
  console.log('📁 Auth Files:\n');

  const fs = require('fs');
  const authFiles = [
    { path: 'src/lib/auth.ts', description: 'NextAuth configuration' },
    { path: 'middleware.ts', description: 'Route protection middleware' },
    { path: 'src/app/api/auth/[...nextauth]/route.ts', description: 'Auth API route' },
    { path: 'src/app/auth/signin/page.tsx', description: 'Sign in page' },
  ];

  for (const file of authFiles) {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.path}`);
      console.log(`   ${file.description}`);
    } else {
      console.log(`❌ ${file.path} - MISSING!`);
      hasErrors = true;
    }
  }

  console.log('');
  console.log('=' . repeat(60));
  console.log('\n📊 Summary:\n');

  if (hasErrors) {
    console.log('❌ ERRORS FOUND - Fix required environment variables and configuration');
    console.log('\nNext steps:');
    console.log('1. Update .env with missing required variables');
    console.log('2. Verify NEXTAUTH_URL matches your domain');
    console.log('3. Check database connection string');
    console.log('4. Run this script again to verify');
  } else if (hasWarnings) {
    console.log('⚠️  WARNINGS - Configuration is functional but has some issues');
    console.log('\nOptional improvements:');
    console.log('- Consider adding optional auth providers (Google, Email)');
    console.log('- Verify you&apos;re using production URL if deploying');
  } else {
    console.log('✅ ALL CHECKS PASSED - Auth configuration looks good!');
    console.log('\nNext steps:');
    console.log('1. Deploy your site');
    console.log('2. Visit https://olliedoesis.dev/auth/signin');
    console.log('3. Sign in with GitHub');
    console.log('4. Access admin panel at https://olliedoesis.dev/admin');
  }

  console.log('\n📚 For more info, see: ADMIN_LOGIN_SETUP.md');
  console.log('');
}

// Run verification
verifyAuth()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
