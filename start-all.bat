@echo off
title ResumeCraft Launcher
echo ===================================================
echo             Starting ResumeCraft Services
echo ===================================================
echo.

echo [1/3] Starting Backend (Port 5000)...
start "ResumeCraft Backend (Port 5000)" cmd /c "cd backend && npm run dev"
timeout /t 2 /nobreak >nul

echo [2/3] Starting AI Service (Port 8000)...
start "ResumeCraft AI Service (Port 8000)" cmd /c "cd ai-service && call venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (Port 3000)...
start "ResumeCraft Frontend (Port 3000)" cmd /c "cd frontend && npm run dev"

echo.
echo ===================================================
echo  All services launched in separate windows!
echo  Close the respective windows to stop the services.
echo ===================================================
timeout /t 5
