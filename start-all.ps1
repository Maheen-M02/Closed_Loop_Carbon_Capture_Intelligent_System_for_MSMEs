# Start All Carbon Intelligence Platform Servers
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Carbon Intelligence Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend
Write-Host "[1/3] Starting Backend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Sleep -Seconds 3

# Start frontend
Write-Host "[2/3] Starting Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Start-Sleep -Seconds 3

# Start calculator
Write-Host "[3/3] Starting Calculator & Marketplace (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd carbon-intelligence-system; http-server public -p 3001"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All servers are starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Main Platform:     http://localhost:5173" -ForegroundColor White
Write-Host "Backend API:       http://localhost:3000" -ForegroundColor White
Write-Host "Calculator:        http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Three PowerShell windows have opened for the servers." -ForegroundColor Cyan
Write-Host "Close those windows to stop the servers." -ForegroundColor Cyan
