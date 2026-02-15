# Quick Start Guide - Windows

## Step 1: Install Dependencies

Choose one method:

### Method A: Using Batch Script (Recommended for CMD)
```cmd
setup.bat
```

### Method B: Using PowerShell Script
```powershell
.\setup.ps1
```

### Method C: Manual Installation
```cmd
npm install
cd frontend
npm install
cd ..
```

## Step 2: Start the Application

### Method A: Automated Start (Recommended)

Using Batch:
```cmd
start-dev.bat
```

Using PowerShell:
```powershell
.\start-dev.ps1
```

### Method B: Manual Start

Open TWO separate terminal windows:

Terminal 1 (Backend):
```cmd
npm run dev
```

Terminal 2 (Frontend):
```cmd
cd frontend
npm run dev
```

## Step 3: Access the Application

Once both servers are running:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/api/health

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

1. Find and kill the process:
```powershell
# Find process on port 3000
netstat -ano | findstr :3000
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

2. Or change the port:
   - Backend: Edit `server.js` and change `PORT`
   - Frontend: Edit `frontend/vite.config.js` and change `server.port`

### Dependencies Installation Failed

1. Clear npm cache:
```cmd
npm cache clean --force
```

2. Delete node_modules and reinstall:
```cmd
rmdir /s /q node_modules
rmdir /s /q frontend\node_modules
npm install
cd frontend
npm install
cd ..
```

### Module Not Found Errors

Make sure you've installed dependencies in both root and frontend directories.

## Next Steps

1. Open http://localhost:5173 in your browser
2. Explore the demo analysis data
3. Try the what-if simulator
4. Download ESG reports and blockchain certificates

## Development Tips

- Backend auto-reloads with nodemon when files change
- Frontend hot-reloads with Vite when files change
- Check browser console for any frontend errors
- Check terminal for backend errors
