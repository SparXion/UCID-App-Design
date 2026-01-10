# 🚀 Deploy Now - Quick Guide

## ✅ Code is Pushed to GitHub

All improvements have been committed and pushed to `main` branch.

## 🔧 Required Actions

### 1. Backend Environment Variables

**If using Fly.io:**
```bash
cd backend
fly secrets set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
fly secrets set JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
fly secrets set JWT_EXPIRES_IN=15m
fly secrets set JWT_REFRESH_EXPIRES_IN=7d
fly secrets set CORS_ORIGIN=https://sparxion.com,https://www.sparxion.com
fly secrets set NODE_ENV=production
fly secrets set LOG_LEVEL=info
fly secrets set API_BASE_URL=https://ucid-backend.fly.dev
```

**If using Railway:**
1. Go to Railway dashboard → Your backend service
2. Click "Variables" tab
3. Add these variables:
   - `JWT_SECRET` = (generate secure random string)
   - `JWT_REFRESH_SECRET` = (generate different secure random string)
   - `JWT_EXPIRES_IN` = `15m`
   - `JWT_REFRESH_EXPIRES_IN` = `7d`
   - `CORS_ORIGIN` = `https://sparxion.com,https://www.sparxion.com`
   - `NODE_ENV` = `production`
   - `LOG_LEVEL` = `info`
   - `API_BASE_URL` = `https://your-backend-url.com`

**If using Render:**
1. Go to Render dashboard → Your backend service
2. Click "Environment" tab
3. Add the same variables as Railway

### 2. Deploy Backend

**Fly.io:**
```bash
cd backend
fly deploy
```

**Railway/Render:**
- Auto-deploys on git push (already done!)
- If not auto-deploying, trigger manual deploy

### 3. Run Database Migrations

After backend is deployed:

**Fly.io:**
```bash
fly ssh console
cd backend
npx prisma migrate deploy
npx prisma db seed
```

**Railway:**
- Go to deployment → Open shell
- Run: `cd backend && npx prisma migrate deploy && npx prisma db seed`

**Render:**
- Go to service → Shell
- Run: `cd backend && npx prisma migrate deploy && npx prisma db seed`

### 4. Frontend Environment Variables

**Netlify:**
1. Go to Netlify dashboard → Your site
2. Site settings → Environment variables
3. Add/Update:
   - `VITE_API_URL` = `https://ucid-backend.fly.dev` (or your backend URL)

### 5. Trigger Frontend Deploy

**Netlify:**
- Auto-deploys on git push (already done!)
- Or trigger manual deploy from dashboard

## ✅ Verification

After deployment, verify:

1. **Backend Health Check:**
   ```bash
   curl https://ucid-backend.fly.dev/health
   ```
   Should return: `{"status":"ok","timestamp":"...","database":"connected"}`

2. **API Documentation:**
   Visit: `https://ucid-backend.fly.dev/api-docs`
   Should show Swagger UI

3. **Frontend:**
   Visit your Netlify URL
   Should load and connect to backend

4. **Test Authentication:**
   - Sign up a new user
   - Sign in
   - Check browser console for errors

## 🐛 Troubleshooting

### Backend won't start
- Check environment variables are set
- Check logs: `fly logs` or Railway/Render logs
- Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check CORS settings match frontend URL
- Check browser console for errors

### Database errors
- Run migrations: `npx prisma migrate deploy`
- Check `DATABASE_URL` is set correctly

## 📊 New Features Available

After deployment, you'll have:

- ✅ Rate limiting (test by making 6+ auth requests quickly)
- ✅ Request validation (test by sending invalid data)
- ✅ Caching (check response times - second request should be faster)
- ✅ Pagination (add `?page=1&limit=5` to recommendations)
- ✅ Refresh tokens (check localStorage for `auth_refresh_token`)
- ✅ API documentation (`/api-docs`)
- ✅ Structured logging (check logs directory or platform logs)
- ✅ Error handling (all errors return consistent format)

## 🎉 Done!

Your app is now deployed with all improvements!
