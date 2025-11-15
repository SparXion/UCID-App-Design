# Quick Deploy to sparxion.com

## Similar to AI Tuner Structure

Your AI Tuner app structure:
- GitHub: `SparXion/AI-Tuner`
- Netlify: Files at root, `netlify.toml` config
- Live: `sparxion.github.io/AI-Tuner/` or Netlify domain

## UCID App Deployment Structure

**Frontend (Netlify):**
- GitHub: `SparXion/UCID-App-Design`
- Build: `cd frontend && npm run build`
- Publish: `frontend/dist/`
- Config: `netlify.toml` (already created)

**Backend (Railway/Render):**
- Same GitHub repo
- Root: `backend/`
- Database: PostgreSQL (provided by platform)

---

## Step-by-Step Deployment

### 1. Frontend to Netlify (Like AI Tuner)

1. **Go to Netlify Dashboard**
   - Add new site → Import from Git
   - Connect `SparXion/UCID-App-Design`

2. **Build Settings** (auto-detected from `netlify.toml`)
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Already configured!

3. **Environment Variables**
   - Add: `VITE_API_URL` = `https://ucid-api.sparxion.com`
   - (Update after backend is deployed)

4. **Custom Domain**
   - Add `ucid.sparxion.com` or use subdirectory
   - Netlify handles SSL

### 2. Backend to Railway (Recommended)

1. **Go to railway.app**
   - New Project → Deploy from GitHub
   - Select `SparXion/UCID-App-Design`
   - Root directory: `backend`

2. **Add PostgreSQL**
   - Click "+ New" → Database → PostgreSQL
   - Railway provides `DATABASE_URL` automatically

3. **Environment Variables**
   ```
   DATABASE_URL=<auto-provided>
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://sparxion.com
   ```

4. **Update Prisma Schema**
   - Before deploying, update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from sqlite
     url      = env("DATABASE_URL")
   }
   ```

5. **Deploy**
   - Railway auto-builds and deploys
   - Add custom domain: `ucid-api.sparxion.com`

6. **Run Migrations**
   - Railway terminal: `cd backend && npx prisma migrate deploy`
   - Or add to build command

### 3. Update Frontend API URL

After backend is live:
- Netlify → Site settings → Environment variables
- Update `VITE_API_URL` = `https://ucid-api.sparxion.com`
- Redeploy frontend

---

## File Structure (Like AI Tuner)

```
UCID-App-Design/          # GitHub repo root
├── netlify.toml          # Frontend deployment (like AI Tuner)
├── railway.json          # Backend deployment config
├── render.yaml           # Alternative backend config
├── frontend/
│   ├── dist/             # Built files (Netlify serves this)
│   ├── index.html
│   └── ...
├── backend/              # Backend code (Railway deploys this)
│   ├── src/
│   └── prisma/
└── README.md
```

---

## Key Differences from AI Tuner

**AI Tuner:**
- Static site (HTML/JS/CSS)
- All files at root
- Netlify serves directly

**UCID App:**
- React frontend (needs build)
- Express backend (needs server)
- Database (PostgreSQL)
- Two deployments: Frontend + Backend

---

## Quick Commands

```bash
# Test builds locally
cd frontend && npm run build    # Creates frontend/dist/
cd backend && npm run build     # Creates backend/dist/

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Domain Setup

**DNS Records:**
```
Type    Name        Value
CNAME   ucid        <netlify-site>.netlify.app
CNAME   ucid-api    <railway-domain>
```

Or use subdirectories:
- `sparxion.com/ucid` (frontend)
- `sparxion.com/api` (backend proxy)

---

## Cost

- **Netlify:** Free (100GB bandwidth)
- **Railway:** $5/month (500 hours)
- **Total:** ~$5/month

---

## Next Steps

1. Update Prisma schema to PostgreSQL
2. Deploy backend to Railway
3. Deploy frontend to Netlify
4. Set environment variables
5. Run migrations
6. Test live site

See `DEPLOYMENT.md` for detailed instructions.

