# Troubleshooting "Failed to Fetch" Errors

## Common Causes

### 1. Backend Not Running/Deployed
**Symptoms:** "Failed to fetch" or "Unable to connect to server" error

**Solution:**
- **Local Development:** Make sure backend is running on port 3001
  ```bash
  cd backend
  npm run dev
  ```
- **Production:** Ensure backend is deployed on Fly.io
  ```bash
  flyctl status --app ucid-backend
  ```

### 2. CORS Issues
**Symptoms:** Network request fails with CORS error in browser console

**Solution:**
- Check backend CORS configuration in `backend/src/index.ts`
- Ensure `CORS_ORIGIN` environment variable includes your frontend URL
- For Fly.io:
  ```bash
  flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://*.netlify.app" --app ucid-backend
  ```

### 3. Wrong API URL
**Symptoms:** Requests going to wrong endpoint

**Check:**
- Frontend uses `VITE_API_URL` environment variable in production
- Default fallback: `https://ucid-backend.fly.dev`
- In development: `http://127.0.0.1:3001`

**Verify:**
```javascript
// In browser console:
console.log('API URL:', import.meta.env.VITE_API_URL || 'https://ucid-backend.fly.dev');
```

### 4. Network Connectivity
**Symptoms:** Intermittent failures, timeout errors

**Solution:**
- Check internet connection
- Verify backend is accessible:
  ```bash
  curl https://ucid-backend.fly.dev/health
  ```
- Check browser console for detailed error messages

### 5. Authentication Token Issues
**Symptoms:** 401 errors, "Invalid token" messages

**Solution:**
- Clear browser localStorage:
  ```javascript
  localStorage.clear();
  ```
- Sign in again
- Check if JWT_SECRET is set on backend:
  ```bash
  flyctl secrets list --app ucid-backend
  ```

## Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look at Network tab for failed requests
   - Check Console for error messages

2. **Verify Backend Health**
   ```bash
   curl https://ucid-backend.fly.dev/health
   ```
   Should return: `{"status":"ok"}`

3. **Check Backend Logs**
   ```bash
   flyctl logs --app ucid-backend
   ```

4. **Test API Endpoint Directly**
   ```bash
   curl -X POST https://ucid-backend.fly.dev/api/v1/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"email":"test@uc.edu","password":"testpassword123"}'
   ```

5. **Verify Environment Variables**
   - Frontend (Netlify): Check `VITE_API_URL` is set
   - Backend (Fly.io): Check `JWT_SECRET`, `CORS_ORIGIN`, `DATABASE_URL`

## Quick Fixes

### Clear Auth State
If stuck in a bad auth state:
```javascript
// In browser console:
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_student');
location.reload();
```

### Reset Backend
If backend seems broken:
```bash
# Restart backend
flyctl apps restart ucid-backend

# Check status
flyctl status --app ucid-backend
```

## Getting Help

If issues persist:
1. Check browser console for full error messages
2. Check backend logs: `flyctl logs --app ucid-backend`
3. Verify all environment variables are set correctly
4. Test backend endpoints directly with curl

