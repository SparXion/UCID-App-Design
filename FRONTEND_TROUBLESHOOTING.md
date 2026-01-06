# Frontend Connection Troubleshooting

## Quick Checks

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check:
- **Console tab**: Look for errors
- **Network tab**: Check if requests to `/api/v1/auth/signup` or `/api/v1/auth/signin` are failing
- Look for CORS errors or "Failed to fetch" errors

### 2. Verify Frontend Environment Variable

**In Netlify:**
1. Go to Site Settings → Environment Variables
2. Check if `VITE_API_URL` is set to: `https://ucid-backend.fly.dev`
3. If not set, add it and **redeploy** the site

**To redeploy:**
- Go to Deploys tab
- Click "Trigger deploy" → "Deploy site"

### 3. Test Backend Directly

Open browser console and run:
```javascript
fetch('https://ucid-backend.fly.dev/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{status: "ok"}`

### 4. Test Sign-Up from Browser Console

```javascript
fetch('https://ucid-backend.fly.dev/api/v1/auth/signup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123',
    year: 2
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### 5. Check What API URL Frontend is Using

In browser console:
```javascript
// Check what API URL is configured
console.log('API URL:', import.meta.env.VITE_API_URL || 'https://ucid-backend.fly.dev')
```

## Common Issues

### Issue: "Failed to fetch" or Network Error
**Possible causes:**
1. Frontend not deployed with latest code
2. `VITE_API_URL` not set in Netlify
3. Backend not running (but we verified it is)

**Fix:**
- Set `VITE_API_URL` in Netlify environment variables
- Redeploy frontend

### Issue: CORS Error
**Symptom:** Browser console shows "CORS policy" error

**Fix:** Already fixed - CORS_ORIGIN is set correctly

### Issue: 404 on API calls
**Symptom:** API calls return 404

**Possible causes:**
1. Netlify redirect not working
2. Frontend using wrong API URL

**Fix:**
- Check `netlify.toml` redirect is correct (should point to `https://ucid-backend.fly.dev`)
- Verify `VITE_API_URL` is set

## Current Backend Status

✅ **Backend is working:**
- URL: `https://ucid-backend.fly.dev`
- Health check: ✅ Working
- Sign-up endpoint: ✅ Working
- Sign-in endpoint: ✅ Working
- CORS: ✅ Configured for sparxion.com and Netlify

## Next Steps

1. **Check Netlify Environment Variables**
   - Go to your Netlify site settings
   - Verify `VITE_API_URL` = `https://ucid-backend.fly.dev`
   - If missing, add it and redeploy

2. **Redeploy Frontend**
   - In Netlify, go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for build to complete

3. **Test Again**
   - Try signing up from the frontend
   - Check browser console for errors
   - Check Network tab to see what URL is being called

## Still Not Working?

Share:
1. Browser console errors (screenshot or copy/paste)
2. Network tab - what URL is being called?
3. What error message you see on the frontend

