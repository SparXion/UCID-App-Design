#!/bin/bash

echo "Launching UCID App..."
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Setup Prisma
echo "Setting up database..."
cd backend
if [ ! -f "prisma/dev.db" ]; then
  echo "  Generating Prisma client..."
  npx prisma generate
  echo "  Running migrations..."
  npx prisma migrate dev --name init
  echo "  Seeding database..."
  npm run prisma:seed
fi
cd ..

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "App launched!"
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

