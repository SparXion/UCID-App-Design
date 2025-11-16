# Netlify Build Settings Configuration

## Build Settings for UCID App

### Branch to deploy
```
main
```
✅ Already set correctly

### Base directory
```
(leave empty)
```
The `netlify.toml` file handles the directory structure. Leave this blank.

### Build command
```
cd frontend && npm install && npm run build
```
This will:
1. Navigate to the frontend directory
2. Install dependencies
3. Build the React/Vite app

### Publish directory
```
frontend/dist
```
This is where Vite outputs the built files.

### Functions directory
```
(leave empty)
```
No serverless functions needed.

### Environment variables

Click "Add environment variable" and add:

**Variable name:**
```
VITE_API_URL
```

**Value:**
```
https://YOUR-BACKEND-URL-HERE
```

**Important:** Replace `YOUR-BACKEND-URL-HERE` with your actual backend URL after you deploy the backend (Railway/Render).

For now, you can use a placeholder like:
```
https://placeholder-backend-url.com
```

Then update it later in Site Settings → Environment Variables after backend is deployed.

## After Configuration

1. Click **"Deploy site"**
2. Netlify will build and deploy
3. You'll get a `.netlify.app` URL
4. Then add custom domain `www.sparxion.com`

