# Setup Checklist ✅

## Pre-Installation Verification

- [x] Node.js installed (v22.20.0) ✅
- [x] npm installed (v11.6.0) ✅
- [x] Windows OS ✅
- [x] Project files present ✅

## Installation Steps

### Step 1: Install Dependencies
- [ ] Open Command Prompt in project folder
- [ ] Run `setup.bat`
- [ ] Wait for "Setup complete!" message
- [ ] Verify no error messages appeared

### Step 2: Verify Installation
- [ ] Run `powershell -File verify-setup.ps1`
- [ ] Check all items show ✓ (green checkmarks)
- [ ] Confirm "Setup verification PASSED!" message

### Step 3: Start Servers
- [ ] Run `start-dev.bat`
- [ ] Verify two new windows opened
- [ ] Backend window shows "Carbon Intelligence Platform running on port 3000"
- [ ] Frontend window shows "Local: http://localhost:5173"

### Step 4: Test Application
- [ ] Open browser
- [ ] Navigate to http://localhost:5173
- [ ] Landing page loads successfully
- [ ] Click to enter the dashboard
- [ ] Dashboard displays demo data

### Step 5: Test API
- [ ] Open http://localhost:3000/api/health in browser
- [ ] Should see: `{"status":"ok","timestamp":"..."}`
- [ ] Try demo analysis: http://localhost:3000/api/demo-analysis

## Troubleshooting Checklist

If something doesn't work:

### Dependencies Not Installing
- [ ] Check internet connection
- [ ] Run `npm cache clean --force`
- [ ] Delete node_modules folders
- [ ] Run setup.bat again

### Servers Not Starting
- [ ] Check if ports 3000 or 5173 are in use
- [ ] Run `netstat -ano | findstr :3000`
- [ ] Run `netstat -ano | findstr :5173`
- [ ] Kill processes if needed: `taskkill /PID <PID> /F`

### Frontend Not Loading
- [ ] Check backend is running (http://localhost:3000/api/health)
- [ ] Check frontend terminal for errors
- [ ] Check browser console (F12) for errors
- [ ] Verify frontend dependencies installed: `cd frontend && npm list`

### Backend Errors
- [ ] Check backend terminal for error messages
- [ ] Verify data files exist: `data/demoFactoryData.json`
- [ ] Verify routes file exists: `routes/routes.js`
- [ ] Check backend dependencies: `npm list`

## Features to Test

Once running, verify these features work:

### Dashboard
- [ ] Overview cards display metrics
- [ ] Charts render correctly
- [ ] Navigation sidebar works

### Simulator
- [ ] What-if simulator loads
- [ ] Can adjust parameters
- [ ] Simulation runs and shows results

### Recommendations
- [ ] Recommendations panel displays
- [ ] Shows optimization suggestions
- [ ] ROI calculations visible

### Reports
- [ ] ESG report download button works
- [ ] Blockchain certificate download works
- [ ] PDFs generate successfully

### Compliance
- [ ] Compliance panel displays
- [ ] Risk breakdown shows
- [ ] Compliance status visible

### Optimization
- [ ] Optimization suggestions display
- [ ] Recommendations are actionable
- [ ] Metrics show improvements

### Carbon Capture
- [ ] Micro capture panel loads
- [ ] Capture data displays
- [ ] Analysis shows results

## Documentation Review

Familiarize yourself with:

- [ ] README.md - Project overview
- [ ] QUICKSTART.md - Quick start guide
- [ ] SETUP_GUIDE.md - Comprehensive setup
- [ ] INSTALL.md - Installation details
- [ ] CHANGES.md - What was modified

## Development Workflow

- [ ] Backend auto-reloads on file changes (nodemon)
- [ ] Frontend hot-reloads on file changes (Vite HMR)
- [ ] Can make changes and see them immediately
- [ ] Know how to stop servers (close terminal windows)
- [ ] Know how to restart servers (run start-dev.bat)

## Success Criteria

You're ready to develop when:

- [x] All dependencies installed
- [ ] Both servers start without errors
- [ ] Frontend loads in browser
- [ ] API responds to requests
- [ ] Demo data displays correctly
- [ ] All features are accessible
- [ ] No console errors
- [ ] Can make and test changes

## Next Steps

After completing this checklist:

1. Explore the codebase structure
2. Review the engines/ folder (business logic)
3. Check the components/ folder (UI components)
4. Understand the API endpoints
5. Start developing new features!

---

**Status: Ready to develop! 🚀**
