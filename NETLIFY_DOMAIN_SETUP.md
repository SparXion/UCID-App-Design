# Netlify Domain Setup for sparxion.com

## Step-by-Step Domain Configuration

### 1. Deploy Site to Netlify

1. Go to https://app.netlify.com/teams/sparxion/projects
2. **Add New Site** → **Import an existing project**
3. Connect to Git → Select `SparXion/UCID-App-Design`
4. Build settings (auto-detected from `netlify.toml`):
   - **Base directory**: (leave empty)
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **Deploy site**

### 2. Set Environment Variables

Before deploying, set environment variables:

1. Go to **Site Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
   (Update this with your actual backend URL after backend deployment)

### 3. Configure Custom Domain

#### Option A: Using www.sparxion.com (Recommended)

1. Go to **Site Settings** → **Domain Management**
2. Click **Add custom domain**
3. Enter: `www.sparxion.com`
4. Click **Verify**
5. Netlify will show DNS configuration options

#### Option B: Using sparxion.com (Root Domain)

1. Add custom domain: `sparxion.com`
2. Netlify will automatically configure `www.sparxion.com` as well
3. Choose your primary domain

### 4. DNS Configuration

You'll need to update your DNS records. Netlify will show you exactly what to add:

#### If using Netlify DNS (Easiest)

1. In Netlify, go to **Domain Settings** → **DNS**
2. Click **Add DNS provider**
3. Follow instructions to point your domain to Netlify nameservers
4. Netlify will handle all DNS automatically

#### If using External DNS Provider

Add these DNS records:

**For www.sparxion.com:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

**For sparxion.com (root domain):**
```
Type: A
Name: @
Value: 75.2.60.5
```

Or use ALIAS/ANAME if your provider supports it:
```
Type: ALIAS
Name: @
Value: your-site-name.netlify.app
```

### 5. SSL Certificate

Netlify automatically provisions SSL certificates via Let's Encrypt:
- Certificate will be issued automatically after DNS is configured
- Usually takes 5-10 minutes
- You'll see "Provisioning certificate" status

### 6. Update Backend CORS

After domain is set up, update backend CORS:

1. Go to your backend (Railway/Render)
2. Update environment variable:
   ```
   CORS_ORIGIN=https://www.sparxion.com
   ```
   Or if using root domain:
   ```
   CORS_ORIGIN=https://sparxion.com
   ```

### 7. Update Frontend API URL

Update the `VITE_API_URL` environment variable in Netlify:
```
VITE_API_URL=https://your-backend-url.com
```

### 8. Update netlify.toml Redirect

Update line 17 in `netlify.toml` with your backend URL:
```toml
to = "https://your-backend-url.com/api/:splat"
```

Then commit and push:
```bash
git add netlify.toml
git commit -m "Update backend URL"
git push origin main
```

## Verification

After setup, verify:

1. ✅ `https://www.sparxion.com` loads correctly
2. ✅ `https://sparxion.com` redirects to www (if configured)
3. ✅ SSL certificate is active (green lock icon)
4. ✅ Landing page displays
5. ✅ Navigation to `/ucid` works
6. ✅ API calls work (check browser console)

## Troubleshooting

### Domain not resolving
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Verify nameservers if using Netlify DNS

### SSL certificate not provisioning
- Ensure DNS is correctly configured
- Wait 10-15 minutes
- Check domain verification status in Netlify

### CORS errors
- Verify `CORS_ORIGIN` in backend matches frontend domain exactly
- Include `https://` and `www` if using www subdomain
- Check backend logs for CORS errors

### API calls failing
- Verify `VITE_API_URL` is set correctly in Netlify
- Check `netlify.toml` redirect rule
- Ensure backend is deployed and accessible

## Quick Checklist

- [ ] Site deployed to Netlify
- [ ] Custom domain added (`www.sparxion.com`)
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Environment variables set (`VITE_API_URL`)
- [ ] Backend CORS updated
- [ ] `netlify.toml` backend URL updated
- [ ] Test full flow end-to-end

