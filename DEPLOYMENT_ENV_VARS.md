# Environment Variables Required for Deployment

## Backend (Fly.io / Railway / Render)

### Required Variables

```env
# Database
DATABASE_URL=<provided-by-platform>

# JWT Configuration (REQUIRED - generate secure random strings)
JWT_SECRET=<generate-a-secure-random-string>
JWT_REFRESH_SECRET=<generate-a-different-secure-random-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://sparxion.com,https://www.sparxion.com

# Server
PORT=3001
NODE_ENV=production

# Logging
LOG_LEVEL=info

# API Base URL (for Swagger docs)
API_BASE_URL=https://ucid-backend.fly.dev
```

### How to Generate Secure Secrets

```bash
# Generate JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (different from JWT_SECRET)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Frontend (Netlify)

### Required Variables

```env
VITE_API_URL=https://ucid-backend.fly.dev
```

## Deployment Steps

### 1. Backend Deployment (Fly.io)

If using Fly.io:

```bash
cd backend
fly secrets set JWT_SECRET=<your-secret>
fly secrets set JWT_REFRESH_SECRET=<your-refresh-secret>
fly secrets set JWT_EXPIRES_IN=15m
fly secrets set JWT_REFRESH_EXPIRES_IN=7d
fly secrets set CORS_ORIGIN=https://sparxion.com,https://www.sparxion.com
fly secrets set NODE_ENV=production
fly secrets set LOG_LEVEL=info
fly secrets set API_BASE_URL=https://ucid-backend.fly.dev

# Deploy
fly deploy
```

### 2. Backend Deployment (Railway)

1. Go to Railway dashboard
2. Select your backend service
3. Go to "Variables" tab
4. Add all environment variables listed above
5. Railway will auto-deploy on git push

### 3. Backend Deployment (Render)

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add all environment variables listed above
5. Render will auto-deploy on git push

### 4. Frontend Deployment (Netlify)

1. Go to Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Add `VITE_API_URL` = `https://ucid-backend.fly.dev`
5. Trigger a new deploy or wait for auto-deploy

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Health check endpoint works: `https://ucid-backend.fly.dev/health`
- [ ] API docs accessible: `https://ucid-backend.fly.dev/api-docs`
- [ ] Frontend can connect to backend
- [ ] Authentication works (sign up/sign in)
- [ ] Refresh token mechanism works
- [ ] Rate limiting is active (test by making many requests)
- [ ] Caching is working (check response times)
- [ ] Pagination works on recommendations endpoint
- [ ] Error handling returns proper format

## Testing Endpoints

```bash
# Health check
curl https://ucid-backend.fly.dev/health

# API Documentation
open https://ucid-backend.fly.dev/api-docs

# Test rate limiting (should fail after 5 attempts)
for i in {1..6}; do
  curl -X POST https://ucid-backend.fly.dev/api/v1/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

# Optional (Analytics Admin Access)

```env
# If set, analytics export/KPI endpoints require this header: x-admin-key
ADMIN_KEY=<generate-a-secure-random-string>
```
