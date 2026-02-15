# Installation Instructions

## ✅ System Requirements Check

Your system:
- ✅ Node.js: v22.20.0 (Required: v18+)
- ✅ npm: v11.6.0 (Required: v8+)
- ✅ OS: Windows

## 🚀 Installation Steps

### 1. Install All Dependencies

Run ONE of these commands in the project root:

**Option A - Batch Script (CMD):**
```cmd
setup.bat
```

**Option B - PowerShell:**
```powershell
.\setup.ps1
```

**Option C - Manual:**
```cmd
npm install
cd frontend
npm install
cd ..
```

This will install:
- Backend dependencies (Express, CORS, PDFKit, etc.)
- Frontend dependencies (React, Vite, React Router, etc.)

### 2. Start Development Servers

**Option A - Automated (Recommended):**

Batch:
```cmd
start-dev.bat
```

PowerShell:
```powershell
.\start-dev.ps1
```

**Option B - Manual (Two Terminals):**

Terminal 1:
```cmd
npm run dev
```

Terminal 2:
```cmd
cd frontend
npm run dev
```

### 3. Verify Installation

Open your browser:
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3000/api/health

You should see the Carbon Intelligence Platform dashboard.

## 📁 What Gets Installed

### Backend (Root)
- express: Web server framework
- cors: Cross-origin resource sharing
- pdfkit: PDF generation
- nodemon: Auto-reload during development

### Frontend (frontend/)
- react: UI library
- react-dom: React DOM rendering
- react-router-dom: Client-side routing
- vite: Build tool and dev server
- @vitejs/plugin-react: React plugin for Vite

## 🔧 Configuration Files Created

- `README.md` - Project documentation
- `QUICKSTART.md` - Quick start guide
- `setup.bat` - Windows batch setup script
- `setup.ps1` - PowerShell setup script
- `start-dev.bat` - Batch script to start both servers
- `start-dev.ps1` - PowerShell script to start both servers
- `.env.example` - Environment variables template

## ⚠️ Common Issues

### Issue: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Cannot run scripts"
**Solution (PowerShell):** Run as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port already in use
**Solution:** Kill the process or change ports in configuration files

### Issue: Module not found
**Solution:** Ensure dependencies are installed in both root and frontend:
```cmd
npm install
cd frontend
npm install
```

## 📝 Next Steps

1. Read `README.md` for project overview
2. Read `QUICKSTART.md` for usage instructions
3. Explore the codebase structure
4. Start developing!

## 🆘 Need Help?

Check the troubleshooting section in `QUICKSTART.md`
