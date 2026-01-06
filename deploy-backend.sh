#!/bin/bash

# UCID Backend Deployment Script
# This script deploys the backend to Fly.io with authentication support

set -e  # Exit on error

APP_NAME="ucid-backend"
BACKEND_DIR="backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}UCID Backend Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${RED}Error: flyctl is not installed${NC}"
    echo "Install it from: https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Check if logged in
echo -e "${YELLOW}Checking Fly.io authentication...${NC}"
if ! flyctl auth whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Please login...${NC}"
    flyctl auth login
fi

echo -e "${GREEN}✓ Authenticated as $(flyctl auth whoami)${NC}"
echo ""

# Check backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

# Step 1: Build check
echo -e "${YELLOW}Step 1: Checking TypeScript compilation...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi
echo ""

# Step 2: Check/Set JWT_SECRET
echo -e "${YELLOW}Step 2: Checking JWT_SECRET...${NC}"
JWT_SECRET=$(flyctl secrets list --app "$APP_NAME" 2>/dev/null | grep JWT_SECRET | awk '{print $2}' || echo "")

if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}JWT_SECRET not found. Generating new secret...${NC}"
    JWT_SECRET=$(openssl rand -base64 32)
    echo -e "${BLUE}Setting JWT_SECRET...${NC}"
    flyctl secrets set JWT_SECRET="$JWT_SECRET" --app "$APP_NAME"
    echo -e "${GREEN}✓ JWT_SECRET set${NC}"
else
    echo -e "${GREEN}✓ JWT_SECRET already set${NC}"
fi
echo ""

# Step 3: Check/Set CORS_ORIGIN
echo -e "${YELLOW}Step 3: Checking CORS_ORIGIN...${NC}"
CORS_ORIGIN=$(flyctl secrets list --app "$APP_NAME" 2>/dev/null | grep CORS_ORIGIN | awk '{print $2}' || echo "")

if [ -z "$CORS_ORIGIN" ]; then
    echo -e "${YELLOW}CORS_ORIGIN not found. Setting default...${NC}"
    CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com,https://*.netlify.app"
    flyctl secrets set CORS_ORIGIN="$CORS_ORIGIN" --app "$APP_NAME"
    echo -e "${GREEN}✓ CORS_ORIGIN set to: $CORS_ORIGIN${NC}"
else
    echo -e "${GREEN}✓ CORS_ORIGIN already set: $CORS_ORIGIN${NC}"
fi
echo ""

# Step 4: Deploy backend
echo -e "${YELLOW}Step 4: Deploying backend to Fly.io...${NC}"
echo -e "${BLUE}This may take a few minutes...${NC}"
if flyctl deploy --app "$APP_NAME"; then
    echo -e "${GREEN}✓ Deployment successful${NC}"
else
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
fi
echo ""

# Step 5: Wait for deployment to be ready
echo -e "${YELLOW}Step 5: Waiting for backend to be ready...${NC}"
sleep 5
for i in {1..30}; do
    if curl -s "https://$APP_NAME.fly.dev/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Backend not responding after 30 seconds${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""

# Step 6: Database migration
echo -e "${YELLOW}Step 6: Running database migration...${NC}"
if flyctl ssh console --app "$APP_NAME" --command "cd /app && npx prisma db push --skip-generate"; then
    echo -e "${GREEN}✓ Database migration successful${NC}"
else
    echo -e "${RED}✗ Database migration failed${NC}"
    echo -e "${YELLOW}You may need to run this manually:${NC}"
    echo "  flyctl ssh console --app $APP_NAME --command 'cd /app && npx prisma db push --skip-generate'"
fi
echo ""

# Step 7: Seed database
echo -e "${YELLOW}Step 7: Seeding database...${NC}"
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if flyctl ssh console --app "$APP_NAME" --command "cd /app && npx tsx prisma/seed.ts"; then
        echo -e "${GREEN}✓ Database seeded successfully${NC}"
        echo -e "${BLUE}Test credentials:${NC}"
        echo -e "  Email: ${GREEN}test@uc.edu${NC}"
        echo -e "  Password: ${GREEN}testpassword123${NC}"
    else
        echo -e "${RED}✗ Database seeding failed${NC}"
        echo -e "${YELLOW}You may need to run this manually:${NC}"
        echo "  flyctl ssh console --app $APP_NAME --command 'cd /app && npx tsx prisma/seed.ts'"
    fi
else
    echo -e "${YELLOW}Skipping database seed${NC}"
fi
echo ""

# Step 8: Verify deployment
echo -e "${YELLOW}Step 8: Verifying deployment...${NC}"

# Test health endpoint
if curl -s "https://$APP_NAME.fly.dev/health" | grep -q "ok"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi

# Test auth endpoint exists
AUTH_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://$APP_NAME.fly.dev/api/v1/auth/signin" -X POST -H "Content-Type: application/json" -d '{}')
if [ "$AUTH_TEST" != "404" ] && [ "$AUTH_TEST" != "000" ]; then
    echo -e "${GREEN}✓ Auth endpoints are available${NC}"
else
    echo -e "${RED}✗ Auth endpoints not found (got HTTP $AUTH_TEST)${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Backend URL: ${BLUE}https://$APP_NAME.fly.dev${NC}"
echo -e "Health Check: ${BLUE}https://$APP_NAME.fly.dev/health${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Verify frontend has VITE_API_URL set in Netlify"
echo "2. Test sign-in at your frontend URL"
echo "3. Check logs if issues: flyctl logs --app $APP_NAME"
echo ""

