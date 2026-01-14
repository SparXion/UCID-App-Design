#!/bin/bash
# Script to set environment variables for Fly.io deployment
# Run this from the backend directory

echo "🚀 Setting environment variables for Fly.io..."
echo ""

# Generate secrets if not provided
if [ -z "$JWT_SECRET" ]; then
  echo "Generating JWT_SECRET..."
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
fi

if [ -z "$JWT_REFRESH_SECRET" ]; then
  echo "Generating JWT_REFRESH_SECRET..."
  JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
fi

echo "Setting secrets..."
fly secrets set JWT_SECRET="$JWT_SECRET"
fly secrets set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
fly secrets set JWT_EXPIRES_IN=15m
fly secrets set JWT_REFRESH_EXPIRES_IN=7d
fly secrets set CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com"
fly secrets set NODE_ENV=production
fly secrets set LOG_LEVEL=info
fly secrets set API_BASE_URL=https://ucid-backend.fly.dev

echo ""
echo "✅ All environment variables set!"
echo ""
echo "Note: DATABASE_URL should already be set by Fly.io"
echo "If not, set it with: fly secrets set DATABASE_URL=<your-database-url>"
echo ""
echo "To view all secrets: fly secrets list"
