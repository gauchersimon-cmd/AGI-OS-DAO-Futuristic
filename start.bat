@echo off
REM AGI-OS-DAO Start Script for Windows

echo.
echo Starting AGI-OS-DAO Servers...
echo.

REM Start FastAPI backend in new window
echo Starting FastAPI backend on port 8000...
start cmd /k "cd backend && venv\Scripts\activate && python main.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Next.js frontend in new window
echo Starting Next.js frontend on port 3000...
start cmd /k "pnpm dev"

echo.
echo ✅ Both servers are starting!
echo.
echo Access:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo.
