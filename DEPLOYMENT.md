# Deployment Guide - UCID App

This guide walks you through deploying the UCID app to production.

## Architecture

- **Frontend**: Netlify (sparxion.com)
- **Backend**: Railway or Render (ucid-api.sparxion.com)
- **Database**: PostgreSQL (provided by Railway/Render)

---

## Step 1: Deploy Backend (Railway or Render)

### Option A: Railway (Recommended)

1. **Go to Railway**: https://railway.app
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select Repository**: `SparXion/UCID-App-Design`
4. **Configure Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run start`
5. **Add PostgreSQL Database**:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway will auto-generate `DATABASE_URL`
6. **Set Environment Variables**:
   - `DATABASE_URL` (auto-set from PostgreSQL)
   - `CORS_ORIGIN` = `https://sparxion.com` (or your Netlify URL)
   - `PORT` = `10000` (or Railway's assigned port)
   - `NODE_ENV` = `production`
7. **Run Migrations & Seed**:
   - Go to "Deployments" → Click on the latest deployment
   - Open "Deploy Logs" → Click "Open Shell"
   - Run:
     ```bash
     cd backend
     npx prisma migrate deploy
     npx prisma db seed
     ```
8. **Get Backend URL**:
   - Railway will provide a URL like: `https://ucid-backend-production.up.railway.app`
   - Copy this URL (you'll need it for Netlify)

### Option B: Render

1. **Go to Render**: https://render.com
2. **Create New** → "Web Service"
3. **Connect GitHub**: Select `SparXion/UCID-App-Design`
4. **Configure**:
   - **Name**: `ucid-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run start`
5. **Add PostgreSQL Database**:
   - Create New → "PostgreSQL"
   - Copy the `Internal Database URL`
6. **Set Environment Variables**:
   - `DATABASE_URL` = (from PostgreSQL)
   - `CORS_ORIGIN` = `https://sparxion.com`
   - `PORT` = `10000`
   - `NODE_ENV` = `production`
7. **Run Migrations & Seed**:
   - After first deploy, use Render's "Shell" feature:
     ```bash
     cd backend
     npx prisma migrate deploy
     npx prisma db seed
     ```
8. **Get Backend URL**: Render provides: `https://ucid-backend.onrender.com`

---

## Step 2: Deploy Frontend (Netlify)

1. **Go to Netlify**: https://app.netlify.com/teams/sparxion/projects
2. **Add New Site** → "Import an existing project"
3. **Connect to Git** → Select `SparXion/UCID-App-Design`
4. **Configure Build Settings**:
   - **Base directory**: (leave empty - Netlify will use `netlify.toml`)
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
5. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add:
     - `VITE_API_URL` = `https://your-backend-url.com` (from Step 1)
     - Example: `VITE_API_URL` = `https://ucid-backend-production.up.railway.app`
6. **Update netlify.toml** (if needed):
   - The redirect rule points to `/api/*` → backend
   - Update line 16 in `netlify.toml` with your actual backend URL:
     ```toml
     to = "https://your-backend-url.com/api/:splat"
     ```
7. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy automatically

---

## Step 3: Configure Custom Domain (Optional)

### Netlify Domain Setup

1. **In Netlify Dashboard**:
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter: `sparxion.com`
   - Follow DNS instructions

2. **Update Backend CORS**:
   - Update `CORS_ORIGIN` in Railway/Render to: `https://sparxion.com`

### Backend Domain Setup (Optional)

If you want `ucid-api.sparxion.com`:

1. **Railway**: Add custom domain in project settings
2. **Render**: Add custom domain in service settings
3. **Update Netlify redirect**: Update `netlify.toml` line 16

---

## Step 4: Verify Deployment

1. **Frontend**: Visit `https://sparxion.com` (or your Netlify URL)
2. **Backend Health**: Visit `https://your-backend-url.com/health`
3. **Test Flow**:
   - Landing page loads
   - Click "Explore UCID App"
   - Quiz loads and submits
   - Career paths display

---

## Troubleshooting

### Frontend can't reach backend

- Check `VITE_API_URL` in Netlify environment variables
- Verify backend URL is accessible (no CORS errors)
- Check browser console for API errors

### Backend database errors

- Ensure migrations ran: `npx prisma migrate deploy`
- Ensure seed ran: `npx prisma db seed`
- Check `DATABASE_URL` is set correctly

### CORS errors

- Verify `CORS_ORIGIN` in backend matches frontend URL exactly
- Check backend logs for CORS errors
- Ensure backend is accepting requests from frontend domain

### Build failures

- Check Node version (should be 18+)
- Verify all dependencies install correctly
- Check build logs in Netlify/Railway/Render

---

## Environment Variables Summary

### Backend (Railway/Render)
```
DATABASE_URL=<postgres-url>
CORS_ORIGIN=https://sparxion.com
PORT=10000
NODE_ENV=production
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend-url.com
```

---

## Quick Commands Reference

### Backend (after deployment)
```bash
# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Check logs
# Railway: View in dashboard
# Render: View in dashboard
```

### Frontend (local testing)
```bash
cd frontend
VITE_API_URL=https://your-backend-url.com npm run dev
```

---

## Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Deploy frontend to Netlify
3. ✅ Set environment variables
4. ✅ Run database migrations & seed
5. ✅ Test the full flow
6. ✅ Configure custom domains (optional)
