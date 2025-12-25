# Quiz Submission Debug Guide

## Common Issues and Solutions

### Issue 1: "Failed to submit quiz" Error

**Symptoms:**
- Users see "Failed to submit quiz" alert
- Console shows 404, 500, or network errors

**Root Causes:**

1. **Student doesn't exist in database**
   - **Fix:** The backend now auto-creates students if they don't exist
   - **Check:** Verify student ID is valid

2. **Backend not running or unreachable**
   - **Fix:** Ensure backend is running: `cd backend && npm run dev`
   - **Check:** Visit `http://localhost:3001/health` in browser

3. **CORS errors**
   - **Fix:** Check `CORS_ORIGIN` environment variable matches frontend URL
   - **Check:** Look for CORS errors in browser console

4. **Database connection issues**
   - **Fix:** Verify `DATABASE_URL` is set correctly
   - **Check:** Run `cd backend && npx prisma migrate deploy`

5. **Network/proxy issues**
   - **Fix:** Check Netlify redirects in `netlify.toml`
   - **Check:** Verify `VITE_API_URL` environment variable in Netlify

### Issue 2: Validation Errors

**Symptoms:**
- 400 Bad Request errors
- "Talents array is required" or "Interests array is required"

**Root Causes:**

1. **Empty arrays sent**
   - **Fix:** Frontend validates before submission, but check payload structure

2. **Invalid data format**
   - **Fix:** Ensure talents/interests match DTO structure

### Issue 3: Database Errors

**Symptoms:**
- 500 Internal Server Error
- Prisma errors in backend logs

**Root Causes:**

1. **Student foreign key constraint**
   - **Fix:** Auto-create student (now implemented)

2. **Database migration not run**
   - **Fix:** Run `npx prisma migrate deploy` in production

3. **Database connection string incorrect**
   - **Fix:** Verify `DATABASE_URL` format

## Debugging Steps

### Step 1: Run Debug Script

```bash
cd ucid-app
BACKEND_URL=http://localhost:3001 FRONTEND_URL=http://localhost:3000 node debug-quiz-submission.js
```

This will test:
- Backend connectivity
- CORS configuration
- Quiz submission endpoint
- Error handling
- Environment variables

### Step 2: Check Backend Logs

Look for:
- `[Quiz Submission]` prefixed logs
- Error stack traces
- Database connection errors

### Step 3: Check Frontend Console

Look for:
- Network request failures
- CORS errors
- Response status codes
- Error messages

### Step 4: Test API Directly

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test quiz submission
curl -X POST http://localhost:3001/api/v1/students/test-student-id/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "talents": [{"type": "Visual/Artistic", "name": "Drawing", "measuredScore": 8, "confidence": "High"}],
    "interests": [{"topic": "Art", "strength": 7, "confidence": "Medium"}]
  }'
```

### Step 5: Check Environment Variables

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Frontend URL (or `*` for all)
- `PORT` - Backend port (default: 3001)

**Frontend (Netlify):**
- `VITE_API_URL` - Backend API URL

**Netlify Redirects:**
- Check `netlify.toml` redirect rule points to correct backend URL

## Recent Fixes Applied

1. **Auto-create student if doesn't exist**
   - Quiz submission now creates student record if missing
   - Prevents foreign key constraint errors

2. **Enhanced error logging**
   - Backend logs detailed error information
   - Frontend logs request/response details

3. **Better error messages**
   - More descriptive error messages for users
   - Console logs include full error context

4. **Improved validation**
   - Validates at least one talent or interest
   - Better error messages for validation failures

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] `DATABASE_URL` set correctly
- [ ] `CORS_ORIGIN` set to frontend domain
- [ ] `VITE_API_URL` set in Netlify environment variables
- [ ] Netlify redirects configured in `netlify.toml`
- [ ] Backend health check endpoint accessible
- [ ] Test quiz submission with real student ID

## Monitoring

Watch for these in production:
- High 500 error rates on `/api/v1/students/:id/quiz`
- Database connection errors
- CORS errors in browser console
- Student creation failures

