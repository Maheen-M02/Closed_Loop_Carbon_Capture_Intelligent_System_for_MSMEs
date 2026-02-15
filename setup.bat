@echo off
echo ========================================
echo Carbon Intelligence Platform Setup
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Verifying installation...
if not exist "node_modules" (
    echo ERROR: Backend node_modules not found
    pause
    exit /b 1
)
if not exist "frontend\node_modules" (
    echo ERROR: Frontend node_modules not found
    pause
    exit /b 1
)
echo.

echo [4/4] Setup complete!
echo ========================================
echo.
echo To start the application:
echo   Option 1: Run start-dev.bat (starts both servers)
echo   Option 2: Manual start:
echo     - Backend: npm run dev
echo     - Frontend: cd frontend ^&^& npm run dev
echo.
echo ========================================
pause
