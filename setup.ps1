# Carbon Intelligence Platform Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Carbon Intelligence Platform Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Install backend dependencies
Write-Host "[1/4] Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "[2/4] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend installation failed" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Verify installation
Write-Host "[3/4] Verifying installation..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: Backend node_modules not found" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "ERROR: Frontend node_modules not found" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[4/4] Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "  Option 1: Run .\start-dev.ps1 (starts both servers)" -ForegroundColor White
Write-Host "  Option 2: Manual start:" -ForegroundColor White
Write-Host "    - Backend: npm run dev" -ForegroundColor White
Write-Host "    - Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
