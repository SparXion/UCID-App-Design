# Fix: Quiz Submission Failed - Backend Connection

## Problem
The quiz submission is failing because the backend isn't deployed or connected yet.

## Solution: Deploy Backend First

### Step 1: Deploy Backend (Railway or Render)

Choose one:

#### Option A: Railway (Recommended)

1. Go to https://railway.app
2. **New Project** → **Deploy from GitHub**
3. Select `SparXion/UCID-App-Design`
4. **Settings:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
5. **Add PostgreSQL:**
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`
6. **Set Environment Variables:**
   ```
   DATABASE_URL=<auto-set from PostgreSQL>
   CORS_ORIGIN=https://sparxion.com
   PORT=10000
   NODE_ENV=production
   ```
7. **After first deploy, run migrations:**
   - Go to deployment → Open shell
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```
8. **Copy backend URL** (e.g., `https://ucid-backend-production.up.railway.app`)

#### Option B: Render

1. Go to https://render.com
2. **New** → **Web Service**
3. Connect GitHub → Select repo
4. **Settings:**
   - **Name**: `ucid-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
5. Add PostgreSQL database
6. Set environment variables (same as Railway)
7. Deploy and run migrations
8. Copy backend URL

### Step 2: Update Netlify Configuration

After backend is deployed:

1. **Update Environment Variable in Netlify:**
   - Go to Site Settings → Environment Variables
   - Find `VITE_API_URL`
   - Update value to your backend URL:
     ```
     https://your-backend-url.com
     ```
   - Example: `https://ucid-backend-production.up.railway.app`

2. **Update netlify.toml Redirect:**
   - Edit `netlify.toml` line 19
   - Replace `YOUR-BACKEND-URL-HERE` with actual backend URL:
     ```toml
     to = "https://your-backend-url.com/api/:splat"
     ```
   - Commit and push:
     ```bash
     git add netlify.toml
     git commit -m "Update backend URL"
     git push origin main
     ```

3. **Trigger New Deploy:**
   - Netlify will auto-deploy on push, OR
   - Go to Deploys → Trigger deploy → Deploy site

### Step 3: Update Backend CORS

Make sure backend CORS allows your frontend domain:

In Railway/Render environment variables:
```
CORS_ORIGIN=https://sparxion.com
```

Or if using www:
```
CORS_ORIGIN=https://www.sparxion.com
```

## Quick Test

After backend is deployed:

1. Test backend health:
   ```
   https://your-backend-url.com/health
   ```
   Should return: `{"status":"ok"}`

2. Test quiz submission in browser console:
   - Open browser DevTools → Network tab
   - Submit quiz
   - Check if API call succeeds

## Current Status

- ✅ Frontend deployed to Netlify
- ❌ Backend not deployed yet
- ❌ `VITE_API_URL` not set correctly
- ❌ `netlify.toml` redirect has placeholder URL

Once backend is deployed and URLs are updated, quiz submission will work!

