# Free Docker Hosting Guide - Deploy Your Docker Containers for Free

You already have Dockerfiles set up! Here's how to deploy them **completely free**.

## Understanding Docker Hosting

- ✅ **Docker Desktop**: Free (for local development)
- ✅ **Docker Hub**: Free (for storing images)
- ❌ **Hosting Docker containers**: Requires a service (but many have free tiers!)

---

## Option 1: Fly.io (Recommended - Free Docker Hosting)

Fly.io is perfect for Docker containers and has a generous free tier.

### What You Get (Free)
- ✅ 3 shared-cpu VMs (perfect for backend + database)
- ✅ 3 GB persistent volume storage
- ✅ 160 GB outbound data transfer/month
- ✅ Automatic HTTPS
- ✅ No cold starts

### Setup Steps

1. **Install Fly CLI**:
   ```bash
   # macOS
   curl -L https://fly.io/install.sh | sh
   
   # Or via Homebrew
   brew install flyctl
   ```

2. **Sign up**:
   ```bash
   fly auth signup
   ```

3. **Create Fly App for Backend**:
   ```bash
   cd ucid-app
   fly launch --name ucid-backend --dockerfile Dockerfile.backend
   ```
   
   When prompted:
   - **Region**: Choose closest (e.g., `iad` for Virginia)
   - **PostgreSQL**: Yes, create one (free!)
   - **Redis**: No
   - **Deploy now**: Yes

4. **Set Environment Variables**:
   ```bash
   fly secrets set DATABASE_URL="<from-fly-postgres>"
   fly secrets set CORS_ORIGIN="https://sparxion.com"
   fly secrets set PORT="3001"
   fly secrets set NODE_ENV="production"
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

6. **Run Migrations**:
   ```bash
   fly ssh console
   cd /app
   npx prisma migrate deploy
   npx prisma db seed
   exit
   ```

7. **Get Your Backend URL**:
   ```bash
   fly status
   # Will show: https://ucid-backend.fly.dev
   ```

### Cost: **FREE** (up to 3 VMs, 3 GB storage)

---

## Option 2: Render (Free Docker Hosting)

Render supports Dockerfiles and has a free tier.

### Setup Steps

1. **Go to Render**: https://render.com
2. **Create New** → **"Web Service"**
3. **Connect GitHub**: Select your repo
4. **Configure**:
   - **Name**: `ucid-backend`
   - **Environment**: **Docker** (select this!)
   - **Dockerfile Path**: `ucid-app/Dockerfile.backend`
   - **Docker Context**: `ucid-app`
   - **Plan**: **Free**
5. **Set Environment Variables**:
   ```
   DATABASE_URL = <from-render-postgres>
   CORS_ORIGIN = https://sparxion.com
   PORT = 3001
   NODE_ENV = production
   ```
6. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Plan: **Free**
   - Copy Internal Database URL
7. **Deploy**

### Cost: **FREE** (with cold starts after inactivity)

---

## Option 3: Railway ($5/month - Better Performance)

Railway supports Dockerfiles and has better performance than free tiers.

### Setup Steps

1. **Go to Railway**: https://railway.app
2. **New Project** → **"Deploy from GitHub repo"**
3. **Select Repository**: Your repo
4. **Railway auto-detects Dockerfile.backend**
5. **Add PostgreSQL**: New → Database → PostgreSQL
6. **Set Environment Variables**:
   ```
   DATABASE_URL = <auto-set>
   CORS_ORIGIN = https://sparxion.com
   PORT = 10000
   NODE_ENV = production
   ```
7. **Deploy**

### Cost: **$5/month** (no cold starts, better performance)

---

## Using Your Existing Docker Compose (Local Only)

Your `docker-compose.yml` is perfect for **local development**, but for production, you need to deploy each service separately:

- **Backend**: Deploy `Dockerfile.backend` to Fly.io/Render/Railway
- **Frontend**: Already on Netlify (free)
- **Database**: Use managed PostgreSQL from Fly.io/Render/Railway

---

## Recommended Setup (Free)

1. **Backend**: Fly.io (free, uses `Dockerfile.backend`)
2. **Database**: Fly.io PostgreSQL (free, included)
3. **Frontend**: Netlify (free, already set up)

**Total Cost: $0/month**

---

## Quick Deploy to Fly.io (5 minutes)

```bash
# 1. Install Fly CLI
brew install flyctl

# 2. Sign up
fly auth signup

# 3. Navigate to project
cd "/Users/johnviolette/UC | ID App Design/ucid-app"

# 4. Launch backend
fly launch --name ucid-backend --dockerfile Dockerfile.backend

# 5. Set secrets
fly secrets set DATABASE_URL="<from-fly>"
fly secrets set CORS_ORIGIN="https://sparxion.com"
fly secrets set PORT="3001"
fly secrets set NODE_ENV="production"

# 6. Deploy
fly deploy

# 7. Run migrations
fly ssh console
npx prisma migrate deploy
npx prisma db seed
exit

# 8. Get URL
fly status
```

Then update Netlify:
- Set `VITE_API_URL` = `https://ucid-backend.fly.dev`

---

## Why Not Docker Compose in Production?

`docker-compose.yml` is great for local development, but for production:
- ❌ You'd need a VPS/server ($5-20/month)
- ❌ You'd manage SSL certificates yourself
- ❌ You'd handle backups and monitoring
- ✅ Managed services (Fly.io/Render) handle all this for free!

---

## Summary

| Service | Docker Support | Cost | Best For |
|---------|---------------|------|----------|
| **Fly.io** | ✅ Yes | **FREE** | Production apps |
| **Render** | ✅ Yes | **FREE** | Demos, testing |
| **Railway** | ✅ Yes | $5/month | Better performance |
| **Docker Compose** | ✅ Yes | VPS costs | Local dev only |

**Recommendation**: Use **Fly.io** - it's free, supports Docker, and has no cold starts!

