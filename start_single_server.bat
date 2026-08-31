@echo off
echo ============================================================
echo   UNIFIED SINGLE-SERVER MODE — ROADVISION AI
echo ============================================================
echo.
echo Building frontend production assets...
cd frontend
call npm run build
cd ..

echo.
echo Launching unified FastAPI server on http://localhost:8000 ...
cd backend
venv\Scripts\python.exe -m uvicorn main:app --port 8000
pause
