#!/bin/bash

# ==============================================
# Git Push to GitHub & Auto-Deploy to Vercel
# ==============================================
# This script stages all changes, commits, and pushes to GitHub
# Vercel will automatically deploy once GitHub receives the push

echo "🚀 Starting deployment process..."
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Please run 'git init' first."
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Show current status
echo "📊 Current git status:"
git status --short
echo ""

# Ask for confirmation
read -p "Do you want to add all changes? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

# Stage all changes
echo "📦 Staging all changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit"
    echo "🔄 Checking if we need to push existing commits..."
    
    # Check if there are unpushed commits
    UNPUSHED=$(git log origin/$CURRENT_BRANCH..$CURRENT_BRANCH --oneline 2>/dev/null | wc -l)
    if [ "$UNPUSHED" -eq 0 ]; then
        echo "✅ Everything is up to date. Nothing to push."
        exit 0
    else
        echo "📤 Found $UNPUSHED unpushed commit(s)"
    fi
else
    # Show what will be committed
    echo ""
    echo "📝 Files to be committed:"
    git diff --staged --name-status
    echo ""
    
    # Get commit message
    read -p "Enter commit message: " COMMIT_MESSAGE
    
    # Use default message if none provided
    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="Update blog content and configurations"
        echo "Using default message: $COMMIT_MESSAGE"
    fi
    
    # Commit changes
    echo ""
    echo "💾 Committing changes..."
    git commit -m "$COMMIT_MESSAGE"
    
    if [ $? -ne 0 ]; then
        echo "❌ Commit failed"
        exit 1
    fi
    echo "✅ Commit successful"
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub ($CURRENT_BRANCH)..."
git push origin $CURRENT_BRANCH

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Push failed. Common solutions:"
    echo "   1. Check your internet connection"
    echo "   2. Verify GitHub credentials"
    echo "   3. Pull latest changes first: git pull origin $CURRENT_BRANCH"
    echo "   4. If new repo, set upstream: git push -u origin $CURRENT_BRANCH"
    exit 1
fi

echo "✅ Successfully pushed to GitHub!"
echo ""

# Vercel auto-deploys from GitHub
echo "🎉 All done!"
echo ""
echo "📊 Deployment Status:"
echo "   ✅ Code pushed to GitHub"
echo "   🔄 Vercel will automatically detect the push and start deployment"
echo ""
echo "🔗 Next steps:"
echo "   1. Go to https://vercel.com/dashboard"
echo "   2. Check your project's deployment status"
echo "   3. View deployment logs if needed"
echo ""
echo "⏱️  Typical deployment time: 1-3 minutes"
echo ""

# Optional: Open Vercel dashboard
read -p "Open Vercel dashboard in browser? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Try to open browser (works on Windows, Mac, and Linux)
    if command -v start &> /dev/null; then
        # Windows
        start https://vercel.com/dashboard
    elif command -v open &> /dev/null; then
        # Mac
        open https://vercel.com/dashboard
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open https://vercel.com/dashboard
    else
        echo "Please manually open: https://vercel.com/dashboard"
    fi
fi

echo "🎊 Deployment process complete!"