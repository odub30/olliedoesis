#!/bin/bash
# Deploy Environment Variables to Vercel Production
# This script adds all required environment variables to Vercel

echo "====================================================="
echo "  Deploying Environment Variables to Vercel"
echo "====================================================="
echo ""

# Check if vercel CLI is installed
echo "Checking Vercel CLI installation..."
if ! command -v vercel &> /dev/null; then
    echo "ERROR: Vercel CLI not found!"
    echo "Install it with: npm install -g vercel"
    exit 1
fi
echo "✓ Vercel CLI found"
echo ""

# Navigate to project directory
cd c:/olliedoesis || exit 1
echo "Working directory: $(pwd)"
echo ""

# Define environment variables
declare -A envVars=(
    ["DATABASE_URL"]="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19UQ3VpZmhReU5YZUlRbEdDQ0ZsX2EiLCJhcGlfa2V5IjoiMDFLNzdKTk1TODFHQzg1TlFTMVdWRlI3VjkiLCJ0ZW5hbnRfaWQiOiIzMDhiMDM5NjZiMDQ0MWVkZDM5ZmM0MWNkYWMwYmE2YzdiM2IxMTU4OGJlYWI3MDM5NjE1OGI5N2M3ZDU3NTk5IiwiaW50ZXJuYWxfc2VjcmV0IjoiYmU4Zjk4NjYtNTE0Yi00YWM1LTg2M2YtYTRjOWE5N2I4ZDkyIn0._WBUwwlDfJknnxlhvo87bCbJRqMD7JX6cqBwcfds7Sk"
    ["NEXTAUTH_URL"]="https://olliedoesis.dev"
    ["NEXTAUTH_SECRET"]="eqhnmxGyPtYcAy4h+o7GHQ/ER+2mnyg2xwINMmnmkTY="
    ["GITHUB_ID"]="Ov23liYpevHBPMJS03Kv"
    ["GITHUB_SECRET"]="9d408b1eb71f293eee13a3e6f37cb88f991a37de"
)

echo "Adding environment variables to Vercel Production..."
echo ""

successCount=0
failCount=0

for key in "${!envVars[@]}"; do
    echo "Adding: $key"

    # Add to Vercel by piping the value
    if echo "${envVars[$key]}" | vercel env add "$key" production > /dev/null 2>&1; then
        echo "  ✓ Successfully added $key"
        ((successCount++))
    else
        echo "  ✗ Failed to add $key"
        ((failCount++))
    fi
    echo ""
done

echo "====================================================="
echo "Summary:"
echo "  Success: $successCount"
echo "  Failed: $failCount"
echo "====================================================="
echo ""

if [ $failCount -eq 0 ]; then
    echo "All environment variables added successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Redeploy your application: vercel --prod"
    echo "2. Or push to GitHub to trigger auto-deploy"
    echo "3. Test login at: https://olliedoesis.dev/auth/signin"
else
    echo "Some variables failed to add. Please check errors above."
    echo "You may need to add them manually at:"
    echo "https://vercel.com/odub30/olliedoesis/settings/environment-variables"
fi
