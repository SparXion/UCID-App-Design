# Production Deployment Guide

## Quick Deploy Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Deploy Backend (Railway or Render)

#### Option A: Railway (Recommended)

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `SparXion/UCID-App-Design`
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
5. Add PostgreSQL:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`
6. Set Environment Variables:
   ```
   DATABASE_URL=<auto-set from PostgreSQL>
   CORS_ORIGIN=https://sparxion.com
   PORT=10000
   NODE_ENV=production
   ```
7. After first deploy, run migrations:
   ```bash
   # In Railway shell or via CLI
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```
8. Copy backend URL (e.g., `https://ucid-backend-production.up.railway.app`)

#### Option B: Render

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub → Select repo
4. Settings:
   - **Name**: `ucid-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
5. Add PostgreSQL database
6. Set environment variables (same as Railway)
7. Deploy and run migrations

### 3. Deploy Frontend (Netlify)

1. Go to https://app.netlify.com/teams/sparxion/projects
2. Add New Site → Import from Git
3. Select `SparXion/UCID-App-Design`
4. Build Settings (auto-detected from `netlify.toml`):
   - **Base directory**: (empty)
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
   (Use the backend URL from Step 2)
6. Update `netlify.toml`:
   - Edit line 17: Replace `YOUR-BACKEND-URL-HERE` with actual backend URL
   - Commit and push
7. Deploy

### 4. Custom Domain Setup

#### Netlify (Frontend)
1. Site Settings → Domain Management
2. Add custom domain: `sparxion.com`
3. Follow DNS instructions
4. Update backend `CORS_ORIGIN` to `https://sparxion.com`

#### Backend Domain (Optional)
- Railway: Project Settings → Domains → Add custom domain
- Render: Service Settings → Custom Domains → Add domain

### 5. Verify Deployment

- ✅ Frontend: https://sparxion.com
- ✅ Backend health: https://your-backend-url.com/health
- ✅ Test quiz submission
- ✅ Test career paths display

## Docker Alternative

If deploying with Docker:

```bash
# Build and push images
docker build -f Dockerfile.backend -t jvdesign/ucid-backend:latest .
docker push jvdesign/ucid-backend:latest

docker build -f Dockerfile.frontend --build-arg VITE_API_URL=https://your-backend-url.com -t jvdesign/ucid-frontend:latest .
docker push jvdesign/ucid-frontend:latest
```

Then deploy to any Docker-compatible platform.

## Environment Variables Summary

### Backend
```
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://sparxion.com
PORT=10000
NODE_ENV=production
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend-url.com
```

## Post-Deployment Checklist

- [ ] Backend deployed and healthy
- [ ] Database migrations run
- [ ] Database seeded
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] CORS updated
- [ ] Test full user flow
- [ ] Monitor logs for errors

