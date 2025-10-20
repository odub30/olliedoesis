// scripts/test-auth-config.js
// Test if auth environment variables are loaded correctly

console.log('\n🔍 Auth Configuration Diagnostic\n');
console.log('=' .repeat(60));

// Load environment variables like Next.js does
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env' });

console.log('\n📋 Environment Variables Status:\n');

const requiredVars = {
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'GITHUB_ID': process.env.GITHUB_ID,
  'GITHUB_SECRET': process.env.GITHUB_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL,
};

let hasAllRequired = true;

for (const [key, value] of Object.entries(requiredVars)) {
  const status = value ? '✅' : '❌';
  const displayValue = value
    ? (key.includes('SECRET') ? '***' + value.slice(-8) : value.slice(0, 30) + '...')
    : 'NOT SET';

  console.log(`${status} ${key}: ${displayValue}`);

  if (!value) {
    hasAllRequired = false;
  }
}

console.log('\n' + '=' .repeat(60));

if (!hasAllRequired) {
  console.log('\n❌ PROBLEM: Missing required environment variables!');
  console.log('\nAdd the missing variables to .env.local or .env.development.local\n');
} else {
  console.log('\n✅ All required auth variables are set!');

  // Additional checks
  console.log('\n🔍 Additional Checks:\n');

  // Check NEXTAUTH_URL format
  const nextauthUrl = process.env.NEXTAUTH_URL;
  if (nextauthUrl && nextauthUrl.startsWith('http://localhost')) {
    console.log('✅ NEXTAUTH_URL points to localhost (correct for local dev)');
  } else if (nextauthUrl && nextauthUrl.startsWith('https://')) {
    console.log('⚠️  NEXTAUTH_URL points to production URL (may cause issues in local dev)');
    console.log('   Current value:', nextauthUrl);
    console.log('   Should be: http://localhost:3000');
  }

  // Check GitHub OAuth format
  const githubId = process.env.GITHUB_ID;
  if (githubId && githubId.length > 10) {
    console.log('✅ GITHUB_ID format looks correct');
  } else {
    console.log('⚠️  GITHUB_ID seems too short, verify it\'s correct');
  }

  console.log('\n📝 Next Steps:');
  console.log('   1. Make sure your GitHub OAuth app callback URL is set to:');
  console.log('      http://localhost:3000/api/auth/callback/github');
  console.log('   2. Restart your dev server after env changes');
  console.log('   3. Try signing in at: http://localhost:3000/auth/signin');
  console.log('   4. Check browser console (F12) for any errors');
  console.log('   5. Check terminal for server errors\n');
}
