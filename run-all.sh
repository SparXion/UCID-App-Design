#!/bin/bash
# Run All UCID App Services
# This script starts the backend, frontend, and database

set -e

echo "=========================================="
echo "UCID App - Starting All Services"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start all services
echo ""
echo "Building and starting all services..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up --build -d

echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check service status
echo ""
echo "=========================================="
echo "Service Status:"
echo "=========================================="
docker-compose ps

echo ""
echo "=========================================="
echo "Services are starting!"
echo "=========================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3002"
echo "Database:  localhost:5433"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop all services:"
echo "  docker-compose down"
echo ""
echo "To run debug script:"
echo "  BACKEND_URL=http://localhost:3002 node debug-quiz-submission.js"
echo ""

# Wait a bit and check health
echo "Checking backend health..."
sleep 3

if curl -s http://localhost:3002/health > /dev/null 2>&1; then
    echo "✓ Backend is healthy!"
else
    echo "⚠ Backend may still be starting. Check logs with: docker-compose logs backend"
fi

echo ""
echo "=========================================="

