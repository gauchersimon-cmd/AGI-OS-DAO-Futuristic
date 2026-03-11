#!/bin/bash

# AGI-OS-DAO Start Script

echo ""
echo "🚀 Starting AGI-OS-DAO Services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start backend
echo -e "${BLUE}Starting FastAPI backend on port 8000...${NC}"
cd backend

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Start FastAPI in background
python main.py &
BACKEND_PID=$!

cd ..

# Wait for backend to start
sleep 2

# Start frontend
echo -e "${BLUE}Starting Next.js frontend on port 3000...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm dev &
else
    npm run dev &
fi
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Both services are running!${NC}"
echo ""
echo "Access:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services..."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
