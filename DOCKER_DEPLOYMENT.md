# Docker Deployment Guide

## Prerequisites

1. Docker installed and running
2. Docker Hub account (or container registry)
3. Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Sign in to Docker

```bash
docker login
```

Enter your Docker Hub username and password.

### 2. Build and Run Locally

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

This will:
- Build backend image
- Build frontend image
- Start PostgreSQL database
- Run migrations automatically (if configured)

### 3. Access the App

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

### 4. Stop Services

```bash
docker-compose down
```

## Production Deployment

### Option A: Docker Compose on Server

1. **Copy files to server**:
   ```bash
   scp -r ucid-app user@server:/path/to/app
   ```

2. **On server, update environment**:
   ```bash
   cd /path/to/app
   # Edit docker-compose.yml with production values
   docker-compose up -d --build
   ```

### Option B: Push to Docker Hub and Deploy

1. **Build and tag images**:
   ```bash
   # Backend
   docker build -f Dockerfile.backend -t sparxion/ucid-backend:latest .
   docker push sparxion/ucid-backend:latest

   # Frontend
   docker build -f Dockerfile.frontend --build-arg VITE_API_URL=https://api.sparxion.com -t sparxion/ucid-frontend:latest .
   docker push sparxion/ucid-frontend:latest
   ```

2. **Deploy to hosting**:
   - Railway, Render, or any Docker-compatible platform
   - Use the pushed images

### Option C: Railway/Render with Docker

Both Railway and Render support Dockerfiles:

1. **Railway**:
   - Connect GitHub repo
   - Railway auto-detects Dockerfile
   - Set environment variables in dashboard

2. **Render**:
   - Create web service
   - Select Docker
   - Point to Dockerfile.backend or Dockerfile.frontend

## Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGIN=https://sparxion.com
PORT=3001
NODE_ENV=production
```

### Frontend
```env
VITE_API_URL=https://api.sparxion.com
```

## Database Migrations

After first deployment, run migrations:

```bash
# Inside backend container
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

## Troubleshooting

### Docker daemon not running
```bash
# macOS: Start Docker Desktop
# Linux: sudo systemctl start docker
```

### Port conflicts
```bash
# Check what's using ports
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

### Build failures
```bash
# Clean build
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### View logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Production Checklist

- [ ] Update `DATABASE_URL` to production database
- [ ] Set `CORS_ORIGIN` to production frontend URL
- [ ] Set `VITE_API_URL` in frontend build
- [ ] Run database migrations
- [ ] Seed database
- [ ] Configure SSL/TLS (via reverse proxy or platform)
- [ ] Set up monitoring/logging
- [ ] Configure backups

