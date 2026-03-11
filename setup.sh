#!/bin/bash

# AGI-OS-DAO Setup Script

echo "🚀 Setting up AGI-OS-DAO with FastAPI Backend..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create backend virtual environment
echo ""
echo "Setting up FastAPI backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install backend dependencies
echo "Installing FastAPI dependencies..."
pip install -r requirements.txt

# Copy environment template
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "⚠️  Created .env.local - please add your RAPIDAPI_KEY"
fi

cd ..

# Install frontend dependencies
echo ""
echo "Installing Next.js dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v npm &> /dev/null; then
    npm install
else
    echo "❌ Neither pnpm nor npm found. Please install Node.js."
    exit 1
fi

# Copy frontend environment template
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "⚠️  Created .env.local - please add your API keys"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add RAPIDAPI_KEY to backend/.env.local"
echo "2. Add API keys to .env.local"
echo "3. Run: ./start.sh (or ./start.bat on Windows)"
echo ""
echo "Or manually start both servers:"
echo "  Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "  Terminal 2: pnpm dev"
