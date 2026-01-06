# Backend Deployment Guide

## Quick Deploy

Run the automated deployment script:

```bash
cd ucid-app
./deploy-backend.sh
```

The script will:
1. ✅ Check authentication
2. ✅ Verify TypeScript compilation
3. ✅ Set JWT_SECRET (if missing)
4. ✅ Set CORS_ORIGIN (if missing)
5. ✅ Deploy backend code
6. ✅ Run database migration
7. ✅ Seed database (optional)
8. ✅ Verify deployment

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Login to Fly.io
```bash
flyctl auth login
```

### 2. Navigate to Backend Directory
```bash
cd ucid-app/backend
```

### 3. Build and Verify
```bash
npm run build
```

### 4. Set Environment Variables

**JWT_SECRET** (required):
```bash
flyctl secrets set JWT_SECRET="$(openssl rand -base64 32)" --app ucid-backend
```

**CORS_ORIGIN** (required):
```bash
flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com,https://*.netlify.app" --app ucid-backend
```

### 5. Deploy Backend
```bash
flyctl deploy --app ucid-backend
```

### 6. Run Database Migration
```bash
flyctl ssh console --app ucid-backend --command "cd /app && npx prisma db push --skip-generate"
```

### 7. Seed Database (Optional)
```bash
flyctl ssh console --app ucid-backend --command "cd /app && npx tsx prisma/seed.ts"
```

### 8. Verify Deployment
```bash
# Health check
curl https://ucid-backend.fly.dev/health

# Test auth endpoint
curl -X POST https://ucid-backend.fly.dev/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uc.edu","password":"testpassword123"}'
```

## Troubleshooting

### Check Backend Status
```bash
flyctl status --app ucid-backend
```

### View Logs
```bash
flyctl logs --app ucid-backend
```

### Check Secrets
```bash
flyctl secrets list --app ucid-backend
```

### Restart Backend
```bash
flyctl apps restart ucid-backend
```

### SSH into Container
```bash
flyctl ssh console --app ucid-backend
```

## Frontend Configuration

After backend is deployed, ensure Netlify has:

**Environment Variable:**
- `VITE_API_URL` = `https://ucid-backend.fly.dev`

**To set in Netlify:**
1. Go to Site Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://ucid-backend.fly.dev`
3. Redeploy site

## Test Credentials

After seeding:
- **Email:** `test@uc.edu`
- **Password:** `testpassword123`

## Common Issues

### "Cannot POST /api/v1/auth/signin"
- **Cause:** Backend not deployed with auth routes
- **Fix:** Run deployment script or deploy manually

### CORS Errors
- **Cause:** CORS_ORIGIN not set correctly
- **Fix:** Set CORS_ORIGIN secret with your frontend domains

### 401 Unauthorized
- **Cause:** JWT_SECRET not set or invalid
- **Fix:** Set JWT_SECRET secret

### Database Errors
- **Cause:** Migration not run
- **Fix:** Run `npx prisma db push --skip-generate` in backend container

