#!/usr/bin/env pwsh
# Deploy Environment Variables to Vercel Production
# This script adds all required environment variables to Vercel

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Deploying Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "ERROR: Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Navigate to project directory
$projectPath = "c:/olliedoesis"
Set-Location $projectPath
Write-Host "Working directory: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Define environment variables
$envVars = @{
    "DATABASE_URL" = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19UQ3VpZmhReU5YZUlRbEdDQ0ZsX2EiLCJhcGlfa2V5IjoiMDFLNzdKTk1TODFHQzg1TlFTMVdWRlI3VjkiLCJ0ZW5hbnRfaWQiOiIzMDhiMDM5NjZiMDQ0MWVkZDM5ZmM0MWNkYWMwYmE2YzdiM2IxMTU4OGJlYWI3MDM5NjE1OGI5N2M3ZDU3NTk5IiwiaW50ZXJuYWxfc2VjcmV0IjoiYmU4Zjk4NjYtNTE0Yi00YWM1LTg2M2YtYTRjOWE5N2I4ZDkyIn0._WBUwwlDfJknnxlhvo87bCbJRqMD7JX6cqBwcfds7Sk"
    "NEXTAUTH_URL" = "https://olliedoesis.dev"
    "NEXTAUTH_SECRET" = "eqhnmxGyPtYcAy4h+o7GHQ/ER+2mnyg2xwINMmnmkTY="
    "GITHUB_ID" = "Ov23liYpevHBPMJS03Kv"
    "GITHUB_SECRET" = "9d408b1eb71f293eee13a3e6f37cb88f991a37de"
}

Write-Host "Adding environment variables to Vercel Production..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($key in $envVars.Keys) {
    Write-Host "Adding: $key" -ForegroundColor Cyan

    # Create a temporary file with the value
    $tempFile = New-TemporaryFile
    $envVars[$key] | Out-File -FilePath $tempFile.FullName -Encoding utf8 -NoNewline

    # Add to Vercel using the file
    $result = Get-Content $tempFile.FullName | vercel env add $key production 2>&1

    # Clean up temp file
    Remove-Item $tempFile.FullName -Force

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Successfully added $key" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  ✗ Failed to add $key" -ForegroundColor Red
        Write-Host "  Error: $result" -ForegroundColor Red
        $failCount++
    }
    Write-Host ""
}

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "All environment variables added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Redeploy your application: vercel --prod" -ForegroundColor White
    Write-Host "2. Or push to GitHub to trigger auto-deploy" -ForegroundColor White
    Write-Host "3. Test login at: https://olliedoesis.dev/auth/signin" -ForegroundColor White
} else {
    Write-Host "Some variables failed to add. Please check errors above." -ForegroundColor Red
    Write-Host "You may need to add them manually at:" -ForegroundColor Yellow
    Write-Host "https://vercel.com/odub30/olliedoesis/settings/environment-variables" -ForegroundColor White
}
