@echo off
echo Starting Carbon Intelligence Platform...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers will keep running)
pause > nul
