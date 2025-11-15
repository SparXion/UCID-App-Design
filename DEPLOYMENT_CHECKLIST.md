# Deployment Checklist

## Pre-Deployment

- [ ] Code pushed to GitHub: `SparXion/UCID-App-Design`
- [ ] All tests passing locally
- [ ] Environment variables documented

## Backend Deployment (Railway or Render)

### Railway Setup
- [ ] Create Railway account
- [ ] Create new project from GitHub repo
- [ ] Set root directory: `backend`
- [ ] Add PostgreSQL database
- [ ] Set environment variables:
  - [ ] `DATABASE_URL` (auto-set)
  - [ ] `CORS_ORIGIN` = `https://sparxion.com` (or Netlify URL)
  - [ ] `PORT` = `10000`
  - [ ] `NODE_ENV` = `production`
- [ ] Deploy backend
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed database: `npx prisma db seed`
- [ ] Copy backend URL: `https://your-backend-url.com`

### Render Setup
- [ ] Create Render account
- [ ] Create web service from GitHub repo
- [ ] Set root directory: `backend`
- [ ] Add PostgreSQL database
- [ ] Set environment variables (same as Railway)
- [ ] Deploy backend
- [ ] Run migrations & seed
- [ ] Copy backend URL

## Frontend Deployment (Netlify)

- [ ] Go to Netlify dashboard
- [ ] Import project from GitHub: `SparXion/UCID-App-Design`
- [ ] Build settings (auto-detected from `netlify.toml`):
  - [ ] Base directory: (empty)
  - [ ] Build command: `cd frontend && npm install && npm run build`
  - [ ] Publish directory: `frontend/dist`
- [ ] Set environment variable:
  - [ ] `VITE_API_URL` = `https://your-backend-url.com`
- [ ] Update `netlify.toml` line 16 with backend URL
- [ ] Deploy site
- [ ] Copy frontend URL: `https://your-site.netlify.app`

## Post-Deployment

- [ ] Test landing page loads
- [ ] Test navigation to `/ucid`
- [ ] Test quiz submission
- [ ] Test career paths display
- [ ] Check browser console for errors
- [ ] Check backend logs for errors
- [ ] Verify CORS is working

## Custom Domain (Optional)

- [ ] Add `sparxion.com` to Netlify
- [ ] Update DNS records
- [ ] Update backend `CORS_ORIGIN` to `https://sparxion.com`
- [ ] Test custom domain

## Quick Test URLs

- Frontend: `https://your-site.netlify.app`
- Backend health: `https://your-backend-url.com/health`
- API test: `https://your-backend-url.com/api/v1/students/test-id/quiz-status`

