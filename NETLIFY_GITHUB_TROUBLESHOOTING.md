# Netlify GitHub Repository Not Showing - Troubleshooting

## Common Issues & Solutions

### 1. Netlify Needs GitHub Authorization

**Problem:** Netlify can't see your repositories because it doesn't have access.

**Solution:**
1. In Netlify, when you click "Import an existing project"
2. Click "Connect to Git provider" or "Configure the Netlify GitHub App"
3. You'll be redirected to GitHub to authorize Netlify
4. **Important:** If the repo is under an organization (`SparXion`), you need to:
   - Authorize Netlify for your personal account
   - Then authorize Netlify for the `SparXion` organization
   - Grant access to repositories

### 2. Organization Repository Access

**Problem:** Repository is under `SparXion` organization, not your personal account.

**Solution:**
1. When authorizing Netlify on GitHub, look for organization access
2. You'll see a list of organizations you're part of
3. Click "Grant" or "Approve" for the `SparXion` organization
4. Make sure to grant access to **all repositories** or at least `UCID-App-Design`

### 3. Repository is Private

**Problem:** If the repository is private, Netlify needs explicit permission.

**Solution:**
1. Go to GitHub → Settings → Applications → Authorized OAuth Apps
2. Find "Netlify" in the list
3. Click on it
4. Make sure it has access to the `SparXion` organization
5. If not, revoke and re-authorize

### 4. Install Netlify GitHub App (Recommended)

**Better approach:** Install the Netlify GitHub App directly:

1. Go to: https://github.com/apps/netlify
2. Click "Configure" or "Install"
3. Select the `SparXion` organization (or your account)
4. Choose:
   - **All repositories** (easiest)
   - OR **Only select repositories** → Choose `UCID-App-Design`
5. Click "Install"
6. Go back to Netlify and try importing again

### 5. Manual Steps

If automatic import doesn't work:

1. **In Netlify:**
   - Go to Site Settings → Build & Deploy → Continuous Deployment
   - Click "Link to Git provider"
   - Select GitHub
   - Authorize if prompted

2. **In GitHub:**
   - Go to repository settings
   - Go to "Integrations" → "Netlify"
   - Or install Netlify app from GitHub Marketplace

### 6. Check Repository Visibility

Verify the repository exists and is accessible:

1. Go to: https://github.com/SparXion/UCID-App-Design
2. Make sure you can see it
3. Check if it's public or private
4. If private, ensure Netlify has access

### 7. Alternative: Deploy Manually First

If GitHub connection is problematic:

1. Choose **"Deploy manually"** temporarily
2. Build locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. Drag and drop the `frontend/dist` folder to Netlify
4. Set up GitHub connection later in Site Settings

## Step-by-Step: Grant Organization Access

1. Go to Netlify → Team Settings → Git
2. Click "Connect to Git provider"
3. Select GitHub
4. You'll see a GitHub authorization page
5. **Look for organization access section**
6. Find `SparXion` organization
7. Click "Grant" or "Approve"
8. Select repository access level
9. Authorize

## Verify Access

After authorizing, you should see:
- All repositories under `SparXion` organization
- Including `UCID-App-Design`

If you still don't see it:
- Refresh the Netlify page
- Try disconnecting and reconnecting GitHub
- Check GitHub organization settings → Third-party access

## Quick Fix Checklist

- [ ] Authorized Netlify on GitHub (personal account)
- [ ] Authorized Netlify for `SparXion` organization
- [ ] Granted repository access (all repos or specific)
- [ ] Refreshed Netlify page
- [ ] Checked repository is visible on GitHub
- [ ] Verified you have admin access to the repo

