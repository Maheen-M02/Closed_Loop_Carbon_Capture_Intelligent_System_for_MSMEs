# 🚀 Carbon Intelligence Platform - Setup Guide

## ✅ Prerequisites Check

Your system has:
- ✅ Node.js v22.20.0
- ✅ npm v11.6.0
- ✅ Windows OS

You're all set!

---

## 📦 Installation (Choose One Method)

### Method 1: Automated Setup (Recommended)

```cmd
setup.bat
```

This will automatically install all dependencies for both backend and frontend.

### Method 2: PowerShell

```powershell
.\setup.ps1
```

### Method 3: Manual

```cmd
npm install
cd frontend
npm install
cd ..
```

---

## 🎯 Starting the Application

### Method 1: Automated Start (Recommended)

```cmd
start-dev.bat
```

This opens two terminal windows:
- Backend server on port 3000
- Frontend dev server on port 5173

### Method 2: PowerShell

```powershell
.\start-dev.ps1
```

### Method 3: Manual (Two Terminals)

**Terminal 1 - Backend:**
```cmd
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm run dev
```

---

## 🌐 Access the Application

Once both servers are running:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application UI |
| Backend | http://localhost:3000 | API server |
| Health Check | http://localhost:3000/api/health | Server status |

---

## 🔍 Verify Your Setup

Run the verification script:

```powershell
.\verify-setup.ps1
```

This checks:
- Node.js and npm installation
- Backend dependencies
- Frontend dependencies
- Critical project files

---

## 📂 Project Structure

```
Carbon-Intelligence-Platform/
├── 📄 server.js              # Express backend server
├── 📁 routes/                # API route definitions
├── 📁 controllers/           # Request handlers
├── 📁 engines/               # Business logic (13 engines)
├── 📁 services/              # Service layer
├── 📁 data/                  # JSON data files
│   ├── demoFactoryData.json
│   └── carbonLedger.json
└── 📁 frontend/              # React application
    ├── 📄 vite.config.js     # Vite configuration
    ├── 📁 src/
    │   ├── 📄 main.jsx       # Entry point
    │   ├── 📄 App.jsx        # Root component
    │   ├── 📁 components/    # React components (10 files)
    │   ├── 📁 pages/         # Page components (9 files)
    │   ├── 📁 api/           # API client
    │   └── 📁 hooks/         # Custom React hooks
    └── 📄 package.json       # Frontend dependencies
```

---

## 🎨 Features

The platform includes:

- 📊 Dashboard with carbon analytics
- 🔮 What-if scenario simulator
- 📈 Optimization recommendations
- 📋 Compliance tracking
- 🌱 Micro carbon capture analysis
- 📄 ESG report generation (PDF)
- 🔐 Blockchain certificate generation (PDF)
- 💰 ROI calculations
- 🎯 Risk breakdown analysis

---

## 🛠️ Available Scripts

### Backend
```cmd
npm start          # Start production server
npm run dev        # Start with auto-reload (nodemon)
```

### Frontend
```cmd
cd frontend
npm run dev        # Start dev server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Find and kill process:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Or change the port:**
- Backend: Edit `server.js` → Change `PORT` variable
- Frontend: Edit `frontend/vite.config.js` → Change `server.port`

### Dependencies Not Installing

```cmd
npm cache clean --force
rmdir /s /q node_modules
rmdir /s /q frontend\node_modules
npm install
cd frontend
npm install
```

### PowerShell Script Execution Error

Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found

Ensure dependencies are installed in BOTH directories:
```cmd
npm install              # Root directory
cd frontend
npm install              # Frontend directory
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `START_HERE.txt` | Quick reference card |
| `INSTALL.md` | Detailed installation guide |
| `QUICKSTART.md` | Quick start with troubleshooting |
| `README.md` | Project overview and API docs |
| `SETUP_GUIDE.md` | This file - comprehensive setup |

---

## 🎓 Next Steps

1. ✅ Run `setup.bat` to install dependencies
2. ✅ Run `start-dev.bat` to start servers
3. ✅ Open http://localhost:5173 in browser
4. ✅ Explore the demo data and features
5. ✅ Check the API at http://localhost:3000/api/health

---

## 💡 Tips

- Backend auto-reloads when you save files (nodemon)
- Frontend hot-reloads instantly (Vite HMR)
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- Use the demo analysis to explore features

---

## 🆘 Need Help?

1. Run `.\verify-setup.ps1` to check your setup
2. Check `QUICKSTART.md` for common issues
3. Ensure both servers are running
4. Check firewall isn't blocking ports 3000 or 5173

---

**Happy Coding! 🎉**
