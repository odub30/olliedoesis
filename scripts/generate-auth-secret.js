// scripts/generate-auth-secret.js
// Generates a secure random secret for NEXTAUTH_SECRET

const crypto = require('crypto');

console.log('\n🔐 NextAuth Secret Generator\n');
console.log('Copy this secret and add it to your .env.local file:\n');

const secret = crypto.randomBytes(32).toString('base64');

console.log('NEXTAUTH_SECRET="' + secret + '"\n');

console.log('📋 Add this to your .env.local file along with:');
console.log('   NEXTAUTH_URL="http://localhost:3000"');
console.log('   GITHUB_ID="your-github-oauth-client-id"');
console.log('   GITHUB_SECRET="your-github-oauth-client-secret"\n');

console.log('💡 See DIAGNOSTIC_REPORT.md for full setup instructions\n');
