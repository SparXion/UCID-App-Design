# Fix Netlify Environment Variable

## The Problem

Your frontend is trying to connect to: `https://placeholder-backend-url.com`

This is a placeholder URL that needs to be updated to your actual backend URL.

## Quick Fix

### Step 1: Update Environment Variable in Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Select your **UCID App** site
3. Go to **Site Settings** → **Environment Variables**
4. Find `VITE_API_URL` in the list
5. Click **Edit** (or **Add** if it doesn't exist)
6. Change the value to:
   ```
   https://ucid-backend.fly.dev
   ```
7. Click **Save**

### Step 2: Redeploy Frontend

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (usually 1-2 minutes)

### Step 3: Test

1. Open your frontend site
2. Try to sign up
3. It should now connect to the real backend!

## Alternative: Check Current Value

If you want to see what's currently set:

1. In Netlify, go to **Site Settings** → **Environment Variables**
2. Look for `VITE_API_URL`
3. Current value is probably: `https://placeholder-backend-url.com`
4. Change it to: `https://ucid-backend.fly.dev`

## Why This Happened

The placeholder URL was set during initial setup and never updated to the actual backend URL after deployment.

## After Fixing

Once you update and redeploy:
- Frontend will use: `https://ucid-backend.fly.dev`
- Sign-up and sign-in will work
- All API calls will go to the correct backend

