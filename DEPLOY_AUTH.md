# Authentication Deployment Steps

Run these commands in order to deploy the authentication system:

## 1. Login to Fly.io (if not already logged in)
```bash
flyctl auth login
```

## 2. Deploy Database Migration
```bash
flyctl ssh console --app ucid-backend --command "npx prisma db push --skip-generate"
```

## 3. Set JWT Secret
```bash
flyctl secrets set JWT_SECRET="DfwLCg+xNaETqzUidiTqyxlNMnrlp0DZOmIgJTrrIB8=" --app ucid-backend
```

## 4. Deploy Backend Code
```bash
cd backend
flyctl deploy --app ucid-backend
```

## 5. Re-seed Database (creates test user)
```bash
flyctl ssh console --app ucid-backend --command "npx tsx prisma/seed.ts"
```

## 6. Verify Backend is Running
```bash
curl https://ucid-backend.fly.dev/health
```

## 7. Test Authentication Endpoints

### Test Sign Up:
```bash
curl -X POST https://ucid-backend.fly.dev/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@uc.edu",
    "password": "testpassword123",
    "year": 2
  }'
```

### Test Sign In:
```bash
curl -X POST https://ucid-backend.fly.dev/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@uc.edu",
    "password": "testpassword123"
  }'
```

## 8. Frontend Deployment

The frontend will automatically rebuild on Netlify when you push to GitHub (already done).

Make sure Netlify has the environment variable:
- `VITE_API_URL` = `https://ucid-backend.fly.dev`

## Test Credentials (after seeding)

- **Email**: `test@uc.edu`
- **Password**: `testpassword123`

## Troubleshooting

If you get errors:
1. Check backend logs: `flyctl logs --app ucid-backend`
2. Verify secrets: `flyctl secrets list --app ucid-backend`
3. Check database connection: `flyctl ssh console --app ucid-backend --command "npx prisma db push"`

