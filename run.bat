@echo off
echo ============================================================
echo   STARTING ROADVISION AI FULL-STACK (DEV DUAL-TERMINAL MODE)
echo ============================================================
echo.

start "ROADVISION AI Backend Server (Port 8000)" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

start "ROADVISION AI Frontend Server (Port 5173)" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up!
echo - Backend API:  http://localhost:8000
echo - Frontend HUD: http://localhost:5173
echo.
pause
