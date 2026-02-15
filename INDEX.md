# Documentation Index

Welcome to the Carbon Intelligence Platform! This index will help you find the right documentation for your needs.

## 🚀 Getting Started (Start Here!)

1. **START_HERE.txt** - Quick reference card with 3-step setup
2. **VISUAL_GUIDE.txt** - Visual ASCII art guide with diagrams
3. **INSTALL.md** - Detailed installation instructions

## 📚 Setup Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **INSTALL.md** | Detailed installation guide | Before installing dependencies |
| **SETUP_GUIDE.md** | Comprehensive setup with features | For complete understanding |
| **QUICKSTART.md** | Quick start + troubleshooting | When you need help fast |
| **CHECKLIST.md** | Step-by-step verification | To verify everything works |

## 🛠️ Setup Scripts

### Windows Batch Scripts (CMD)
- **setup.bat** - Install all dependencies automatically
- **start-dev.bat** - Start both backend and frontend servers

### PowerShell Scripts
- **setup.ps1** - Install all dependencies (PowerShell version)
- **start-dev.ps1** - Start both servers (PowerShell version)
- **verify-setup.ps1** - Verify installation and check status

## 📖 Reference Documentation

| Document | Content |
|----------|---------|
| **README.md** | Project overview, API endpoints, structure |
| **SUMMARY.md** | Summary of all changes and setup |
| **CHANGES.md** | List of files created and modifications |
| **INDEX.md** | This file - Documentation navigation |

## 🎯 Quick Navigation by Task

### I want to install the project
→ Read: **START_HERE.txt** or **INSTALL.md**
→ Run: **setup.bat**

### I want to start the servers
→ Run: **start-dev.bat**
→ Open: http://localhost:5173

### I'm having problems
→ Read: **QUICKSTART.md** (Troubleshooting section)
→ Run: **verify-setup.ps1** (Check status)

### I want to understand the project
→ Read: **README.md** (Overview and API)
→ Read: **SETUP_GUIDE.md** (Features and structure)

### I want to verify everything works
→ Read: **CHECKLIST.md**
→ Run: **verify-setup.ps1**

### I want to see what was changed
→ Read: **CHANGES.md** or **SUMMARY.md**

### I want a visual guide
→ Read: **VISUAL_GUIDE.txt**

## 📂 Project Structure Reference

```
Carbon-Intelligence-Platform/
├── 📄 Documentation (You are here!)
│   ├── START_HERE.txt          ← Start here!
│   ├── VISUAL_GUIDE.txt        ← Visual guide
│   ├── INDEX.md                ← This file
│   ├── INSTALL.md              ← Installation
│   ├── SETUP_GUIDE.md          ← Comprehensive guide
│   ├── QUICKSTART.md           ← Quick start
│   ├── CHECKLIST.md            ← Verification
│   ├── README.md               ← Project overview
│   ├── SUMMARY.md              ← Changes summary
│   └── CHANGES.md              ← Detailed changes
│
├── 🔧 Setup Scripts
│   ├── setup.bat               ← Install (CMD)
│   ├── setup.ps1               ← Install (PowerShell)
│   ├── start-dev.bat           ← Start servers (CMD)
│   ├── start-dev.ps1           ← Start servers (PowerShell)
│   └── verify-setup.ps1        ← Verify setup
│
├── 🖥️ Backend
│   ├── server.js               ← Express server
│   ├── routes/                 ← API routes
│   ├── controllers/            ← Request handlers
│   ├── engines/                ← Business logic
│   ├── services/               ← Service layer
│   └── data/                   ← JSON data
│
└── 🎨 Frontend
    └── frontend/
        ├── src/
        │   ├── main.jsx        ← Entry point
        │   ├── App.jsx         ← Root component
        │   ├── components/     ← UI components
        │   ├── pages/          ← Page components
        │   └── api/            ← API client
        └── vite.config.js      ← Vite config
```

## 🎓 Learning Path

### For First-Time Users
1. Read **START_HERE.txt** (2 minutes)
2. Run **setup.bat** (3-5 minutes)
3. Run **start-dev.bat** (30 seconds)
4. Open http://localhost:5173
5. Explore the application!

### For Developers
1. Read **README.md** for project overview
2. Read **SETUP_GUIDE.md** for comprehensive understanding
3. Review the project structure
4. Check **CHECKLIST.md** to verify all features
5. Start developing!

### For Troubleshooting
1. Read **QUICKSTART.md** troubleshooting section
2. Run **verify-setup.ps1** to diagnose issues
3. Check terminal windows for error messages
4. Refer to specific sections in documentation

## 🔗 Quick Links

### URLs (After Starting)
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health Check: http://localhost:3000/api/health
- Demo Analysis: http://localhost:3000/api/demo-analysis

### Commands
```cmd
# Install
setup.bat

# Verify
powershell -File verify-setup.ps1

# Start
start-dev.bat

# Manual start (two terminals)
npm run dev                    # Backend
cd frontend && npm run dev     # Frontend
```

## 📊 Documentation Statistics

- Total documentation files: 9
- Setup scripts: 5
- Configuration files: 2
- Total lines of documentation: ~1000+
- Estimated reading time: 30-45 minutes (all docs)
- Quick start time: 5 minutes

## ✅ System Requirements

- Node.js: v18+ (You have v22.20.0 ✅)
- npm: v8+ (You have v11.6.0 ✅)
- OS: Windows ✅
- Disk space: ~500MB (with dependencies)
- RAM: 2GB minimum, 4GB recommended

## 🆘 Support

If you need help:
1. Check the relevant documentation above
2. Run **verify-setup.ps1** to diagnose issues
3. Review error messages in terminal windows
4. Check browser console (F12) for frontend errors

## 🎉 Ready to Start?

Run this command to begin:
```cmd
setup.bat
```

Then start the servers:
```cmd
start-dev.bat
```

Open your browser to:
```
http://localhost:5173
```

---

**Happy Coding! 🚀**
