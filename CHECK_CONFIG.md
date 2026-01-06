# Configuration Check Results

## ✅ Backend Status

**Backend Health Check:** ✅ PASSING
```bash
curl https://ucid-backend.fly.dev/health
# Returns: {"status":"ok"}
```

**Backend URL:** `https://ucid-backend.fly.dev`

## ⚠️ Configuration Checks Needed

### 1. CORS Configuration (Backend)

**Current Code:** `backend/src/index.ts`
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

**Required:** Set `CORS_ORIGIN` environment variable on Fly.io to include:
- `https://sparxion.com`
- `https://www.sparxion.com`
- `https://*.netlify.app` (for Netlify previews)

**To Fix:**
```bash
flyctl auth login
flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com,https://*.netlify.app" --app ucid-backend
```

### 2. Frontend API URL (Netlify)

**Current Config:** `frontend/src/config.ts`
```typescript
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://127.0.0.1:3001' : 'https://ucid-backend.fly.dev');
```

**Required:** Set `VITE_API_URL` environment variable in Netlify:
- Go to Netlify Dashboard → Site Settings → Environment Variables
- Add: `VITE_API_URL` = `https://ucid-backend.fly.dev`

**Fallback:** If not set, defaults to `https://ucid-backend.fly.dev` in production ✅

### 3. Backend Secrets (Fly.io)

**Required Secrets:**
- `JWT_SECRET` - Must be set (authentication will fail without it)
- `CORS_ORIGIN` - Should include your frontend domains
- `DATABASE_URL` - Should be set (from Postgres)

**To Check:**
```bash
flyctl auth login
flyctl secrets list --app ucid-backend
```

**To Set Missing Secrets:**
```bash
# JWT Secret (if missing)
flyctl secrets set JWT_SECRET="your-secret-key-here" --app ucid-backend

# CORS Origin (if missing or incorrect)
flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com,https://*.netlify.app" --app ucid-backend
```

## 🔍 Testing Checklist

### Test Backend Directly:
```bash
# Health check
curl https://ucid-backend.fly.dev/health

# Test sign-in endpoint
curl -X POST https://ucid-backend.fly.dev/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uc.edu","password":"testpassword123"}'
```

### Test CORS:
```bash
# Check CORS headers
curl -H "Origin: https://sparxion.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://ucid-backend.fly.dev/api/v1/auth/signin \
  -v
```

### Test Frontend:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to sign in
4. Check the failed request:
   - Status code?
   - CORS error?
   - Network error?
   - Response body?

## 🐛 Common Issues

### Issue: CORS Error
**Symptom:** Browser console shows "CORS policy" error

**Fix:** 
```bash
flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com,https://*.netlify.app" --app ucid-backend
flyctl apps restart ucid-backend
```

### Issue: 401 Unauthorized
**Symptom:** "Invalid token" or "Authentication required"

**Fix:** 
- Check JWT_SECRET is set: `flyctl secrets list --app ucid-backend`
- If missing: `flyctl secrets set JWT_SECRET="your-secret" --app ucid-backend`
- Restart: `flyctl apps restart ucid-backend`

### Issue: Network Error / Failed to Fetch
**Symptom:** "Unable to connect to server"

**Fix:**
- Verify backend is running: `curl https://ucid-backend.fly.dev/health`
- Check backend logs: `flyctl logs --app ucid-backend`
- Verify frontend API URL is correct (check Netlify env vars)

## 📋 Quick Fix Commands

```bash
# 1. Login to Fly.io
flyctl auth login

# 2. Check backend status
flyctl status --app ucid-backend

# 3. Check secrets
flyctl secrets list --app ucid-backend

# 4. Set CORS (if needed)
flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://www.sparxion.com,https://*.netlify.app" --app ucid-backend

# 5. Set JWT_SECRET (if missing)
flyctl secrets set JWT_SECRET="DfwLCg+xNaETqzUidiTqyxlNMnrlp0DZOmIgJTrrIB8=" --app ucid-backend

# 6. Restart backend
flyctl apps restart ucid-backend

# 7. Check logs
flyctl logs --app ucid-backend
```

