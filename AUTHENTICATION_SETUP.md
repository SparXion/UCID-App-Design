# Authentication Setup Guide

This guide covers the complete authentication system implementation for the UCID app.

## Overview

The app now includes:
- **User sign-up** with email and password
- **User sign-in** with JWT token authentication
- **Protected routes** - users must be authenticated to access the UCID app
- **Session persistence** - tokens stored in localStorage
- **Secure API calls** - all student endpoints require authentication

## Backend Changes

### Database Schema
- Added `password` field to `Student` model (hashed with bcrypt)
- Made `year` and `embedding` optional for new users

### New Files
- `backend/src/auth/auth.service.ts` - Authentication service with JWT
- `backend/src/auth/auth.controller.ts` - Auth endpoints (signup, signin, me)
- `backend/src/auth/auth.middleware.ts` - Authentication middleware

### API Endpoints

#### Public Endpoints
- `POST /api/v1/auth/signup` - Create new account
- `POST /api/v1/auth/signin` - Sign in with email/password

#### Protected Endpoints (require Authorization header)
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/students/:id/quiz` - Submit quiz (only for own account)
- `GET /api/v1/students/:id/quiz-status` - Check quiz status (only for own account)
- `GET /api/v1/recommendations/students/:id/paths` - Get recommendations (only for own account)

## Frontend Changes

### New Components
- `frontend/src/contexts/AuthContext.tsx` - Auth state management
- `frontend/src/components/auth/SignUp.tsx` - Sign up form
- `frontend/src/components/auth/SignIn.tsx` - Sign in form
- `frontend/src/components/ProtectedRoute.tsx` - Route protection wrapper

### Updated Components
- `App.tsx` - Added AuthProvider and auth routes
- `UCIDApp.tsx` - Uses authenticated user ID
- `StudentQuiz.tsx` - Includes auth token in API calls
- `SkillTreeExplorer.tsx` - Includes auth token in API calls
- `LandingPage.tsx` - Links to sign-in instead of direct app access

## Deployment Steps

### 1. Database Migration

Run the migration on Fly.io to add the password field:

```bash
cd backend
flyctl ssh console --app ucid-backend --command "npx prisma db push"
```

### 2. Set Environment Variables

Set JWT secret on Fly.io backend:

```bash
flyctl secrets set JWT_SECRET="your-super-secret-jwt-key-change-this" --app ucid-backend
```

**Important**: Use a strong, random secret key in production!

### 3. Update Seed Data

The seed file now creates a test user with password. After migration, re-seed:

```bash
flyctl ssh console --app ucid-backend --command "npx tsx prisma/seed.ts"
```

Test credentials:
- Email: `test@uc.edu`
- Password: `testpassword123`

### 4. Update CORS

Ensure CORS allows your frontend domain:

```bash
flyctl secrets set CORS_ORIGIN="https://sparxion.com,https://*.netlify.app" --app ucid-backend
```

### 5. Rebuild and Deploy

1. **Backend**: Already deployed, just needs migration and secrets
2. **Frontend**: Push changes to trigger Netlify rebuild

```bash
git add .
git commit -m "Add authentication system"
git push
```

## Testing

### Sign Up Flow
1. Visit `/signup`
2. Fill in name, email, password
3. Optionally select year
4. Submit form
5. Should redirect to `/ucid` and show quiz

### Sign In Flow
1. Visit `/signin`
2. Enter email and password
3. Submit form
4. Should redirect to `/ucid`

### Protected Routes
1. Try accessing `/ucid` without signing in
2. Should redirect to `/signin`
3. After signing in, should access `/ucid` successfully

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds
2. **JWT Tokens**: Stateless authentication with expiration
3. **Route Protection**: Middleware ensures users can only access their own data
4. **Token Storage**: Stored in localStorage (consider httpOnly cookies for production)
5. **CORS**: Configured to only allow frontend domains

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me option
- [ ] Social login (Google, etc.)
- [ ] Profile editing
- [ ] Account deletion
- [ ] Session management dashboard

