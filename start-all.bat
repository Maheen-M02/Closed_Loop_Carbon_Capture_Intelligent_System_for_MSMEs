@echo off
echo ========================================
echo Starting Carbon Intelligence Platform
echo ========================================
echo.

echo [1/3] Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend (Port 5173)...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Calculator & Marketplace (Port 3001)...
start "Calculator & Marketplace" cmd /k "cd carbon-intelligence-system && http-server public -p 3001"
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo All servers are starting...
echo ========================================
echo.
echo Main Platform:     http://localhost:5173
echo Backend API:       http://localhost:3000
echo Calculator:        http://localhost:3001
echo.
echo Three terminal windows have opened.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this window...
pause > nul
