# Verification Script for Carbon Intelligence Platform
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm not found" -ForegroundColor Red
    $allGood = $false
}

# Check backend dependencies
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend dependencies NOT installed" -ForegroundColor Red
    Write-Host "    Run: npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend dependencies NOT installed" -ForegroundColor Red
    Write-Host "    Run: cd frontend; npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check critical files
Write-Host "Checking critical files..." -ForegroundColor Yellow
$criticalFiles = @(
    "server.js",
    "package.json",
    "routes\routes.js",
    "controllers\carbonController.js",
    "data\demoFactoryData.json",
    "frontend\package.json",
    "frontend\src\main.jsx",
    "frontend\src\App.jsx",
    "frontend\vite.config.js"
)

$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  ✓ All critical files present" -ForegroundColor Green
} else {
    Write-Host "  ✗ Missing files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "    - $file" -ForegroundColor Red
    }
    $allGood = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ Setup verification PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You're ready to start!" -ForegroundColor Cyan
    Write-Host "Run: .\start-dev.ps1" -ForegroundColor White
} else {
    Write-Host "✗ Setup verification FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above and run this script again." -ForegroundColor Yellow
    Write-Host "Or run: .\setup.ps1" -ForegroundColor White
}

Write-Host "========================================" -ForegroundColor Cyan
