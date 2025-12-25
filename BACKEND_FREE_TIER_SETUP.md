# Free Backend Setup Guide - Render Free Tier

This guide walks you through deploying the UCID backend **completely free** using Render's free tier.

## What You Get (Free)

- ✅ Backend API service (512 MB RAM, 0.5 CPU)
- ✅ PostgreSQL database (1 GB storage)
- ✅ Automatic HTTPS
- ✅ GitHub auto-deploy
- ✅ Free forever (with usage limits)

## Limitations (Free Tier)

- ⚠️ Service spins down after 15 min inactivity (wakes automatically on request)
- ⚠️ Cold starts can take 30-60 seconds after inactivity
- ⚠️ 1 GB database storage limit
- ⚠️ Limited to 1 web service

**For your UCID app:** These limits are fine for demos, testing, and low-traffic production.

---

## Step-by-Step Setup (15 minutes)

### 1. Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub (free)
3. Verify your email

### 2. Create PostgreSQL Database (Free)

1. In Render Dashboard → Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `ucid-database`
   - **Database**: `ucid_db`
   - **User**: `ucid_user`
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **PostgreSQL Version**: `16` (or latest)
   - **Plan**: **Free** (select this!)
3. Click **"Create Database"**
4. **Important**: Copy the **"Internal Database URL"** - you'll need this!
   - Format: `postgresql://ucid_user:password@dpg-xxxxx-a/ucid_db`
   - Keep this secret!

### 3. Deploy Backend Service (Free)

1. In Render Dashboard → Click **"New +"** → **"Web Service"**
2. Connect GitHub:
   - Click **"Connect GitHub"**
   - Authorize Render
   - Select repository: `UC | ID App Design` (or your repo name)
3. Configure Service:
   - **Name**: `ucid-backend`
   - **Region**: Same as database (e.g., `Oregon`)
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `ucid-app/backend`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npx prisma generate
     ```
   - **Start Command**: 
     ```bash
     npm run start
     ```
   - **Plan**: **Free** (select this!)
4. **Set Environment Variables**:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add these:
     ```
     DATABASE_URL = <paste Internal Database URL from step 2>
     CORS_ORIGIN = https://sparxion.com
     PORT = 10000
     NODE_ENV = production
     ```
5. Click **"Create Web Service"**
6. Render will start building (takes 3-5 minutes)

### 4. Run Database Migrations & Seed

After the first deployment completes:

1. In Render Dashboard → Click on your `ucid-backend` service
2. Click **"Shell"** tab (opens terminal)
3. Run these commands:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. You should see: "Database seeded successfully"

### 5. Get Your Backend URL

1. In Render Dashboard → Click on `ucid-backend` service
2. Copy the URL at the top (e.g., `https://ucid-backend.onrender.com`)
3. Test it: Visit `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"ok"}`

### 6. Configure Frontend (Netlify)

1. Go to Netlify Dashboard → Your Site → **Site Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```
   (Replace with your actual Render URL)
3. **Trigger Redeploy**:
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

---

## Testing Your Setup

1. **Backend Health Check**:
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"ok"}`

2. **Test Quiz Submission**:
   - Go to your Netlify site (sparxion.com)
   - Click "Explore UCID App"
   - Fill out quiz and submit
   - Should work without errors!

---

## Understanding Free Tier Limitations

### Cold Starts
- After 15 minutes of inactivity, Render spins down your service
- First request after inactivity takes 30-60 seconds to wake up
- Subsequent requests are fast
- **Solution**: For demos, just wait for the first request to wake it up

### Database Storage
- 1 GB limit (plenty for your UCID app)
- If you exceed, you'll need to upgrade ($7/month for 10 GB)

### Scaling
- Free tier handles low-to-medium traffic fine
- If you get lots of users, consider upgrading ($7/month for better performance)

---

## Cost Summary

| Service | Cost | What You Get |
|---------|------|--------------|
| **Render Backend** | **FREE** | API service |
| **Render Database** | **FREE** | PostgreSQL (1 GB) |
| **Netlify Frontend** | **FREE** | Frontend hosting |
| **Total** | **$0/month** | Full-stack app! |

---

## Upgrading Later (If Needed)

If you need better performance:

1. **Render Starter Plan**: $7/month
   - No cold starts
   - More resources
   - Better performance

2. **Railway**: $5/month
   - Similar to Render paid tier
   - Good alternative

---

## Troubleshooting

### Backend won't start
- Check build logs in Render dashboard
- Verify `DATABASE_URL` is set correctly
- Check Node version (should be 18+)

### Database connection errors
- Verify `DATABASE_URL` uses "Internal Database URL" (not external)
- Check database is running (should be automatic)

### CORS errors
- Verify `CORS_ORIGIN` matches your frontend URL exactly
- Include `https://` in the URL

### Cold start delays
- Normal for free tier
- First request after inactivity will be slow
- Subsequent requests are fast

---

## Next Steps

1. ✅ Deploy backend to Render (free)
2. ✅ Deploy database to Render (free)
3. ✅ Set `VITE_API_URL` in Netlify
4. ✅ Test quiz submission
5. ✅ Share your app!

**Total Cost: $0/month** 🎉

