#!/bin/bash
# Quick deployment script

set -e

echo "🚀 UCID App Production Deployment"
echo "=================================="
echo ""

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Step 1: Pushing to GitHub..."
git add .
git commit -m "Production deployment $(date +%Y-%m-%d)" || echo "No changes to commit"
git push origin main

echo ""
echo "✅ Code pushed to GitHub"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Backend Deployment (Railway/Render):"
echo "   - Go to Railway: https://railway.app"
echo "   - Or Render: https://render.com"
echo "   - Deploy from GitHub repo"
echo "   - Set environment variables (see PRODUCTION_DEPLOY.md)"
echo "   - Run migrations: npx prisma migrate deploy"
echo "   - Seed database: npx prisma db seed"
echo ""
echo "2. Frontend Deployment (Netlify):"
echo "   - Go to: https://app.netlify.com/teams/sparxion/projects"
echo "   - Import from Git"
echo "   - Set VITE_API_URL environment variable"
echo "   - Update netlify.toml line 17 with backend URL"
echo ""
echo "3. See PRODUCTION_DEPLOY.md for detailed instructions"
echo ""
echo "✨ Ready to deploy!"

