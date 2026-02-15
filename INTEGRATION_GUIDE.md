# Calculator and Marketplace Integration Guide

## Overview

The "Calculator and Marketplace" feature has been integrated into the main Carbon Intelligence Platform. This feature redirects users to a separate carbon-intelligence-system application that provides:

- Carbon emissions calculator for different industries (Textile, Steel, Other)
- Carbon credit marketplace for buying and selling credits
- Leaderboard system
- User profiles and notifications
- Blockchain-based verification

## Architecture

### Three Running Servers

1. **Main Backend** (Port 3000)
   - Express server
   - API endpoints for main platform
   - URL: http://localhost:3000

2. **Main Frontend** (Port 5173)
   - React + Vite application
   - Main dashboard and analytics
   - URL: http://localhost:5173

3. **Calculator & Marketplace** (Port 3001)
   - Static file server (http-server)
   - Firebase-based application
   - URL: http://localhost:3001

## Integration Details

### Sidebar Navigation

The sidebar now includes a "Calculator and Marketplace" menu item:
- **Icon**: 🛒 (shopping cart)
- **Position**: Last item in the menu (below Reports)
- **Behavior**: Redirects to http://localhost:3001/dashboard.html
- **Styling**: Special orange/amber highlighting with pulsing animation

### Files Modified

1. **frontend/src/components/Sidebar.jsx**
   - Added new menu item with external URL
   - Updated handleNavigation to support external redirects
   - Menu item configuration:
     ```javascript
     {
       id: 'calculator-marketplace',
       label: 'Calculator and Marketplace',
       icon: '🛒',
       path: null,
       disabled: false,
       comingSoon: false,
       externalUrl: 'http://localhost:3001/dashboard.html'
     }
     ```

2. **carbon-intelligence-system/package.json** (Created)
   - Added scripts to run http-server
   - Port configured to 3001

## Calculator & Marketplace Features

### Dashboard (http://localhost:3001/dashboard.html)
- Industry selection (Textile, Steel, Other)
- File import for production data (CSV, JSON, Excel)
- Manual data entry forms
- CO2 emissions calculation
- Carbon intensity metrics
- Risk scoring
- Sustainability index
- Recommendations

### Marketplace (http://localhost:3001/marketplace.html)
- View available carbon credits
- Buy credits from other users
- Sell your own credits
- Filter by price, industry, and other criteria
- Real-time marketplace statistics
- Transaction notifications

### Leaderboard (http://localhost:3001/leaderboard.html)
- User rankings based on carbon reduction
- Industry-specific leaderboards
- Achievement tracking

### Profile (http://localhost:3001/profile.html)
- User information
- Credit balance
- Transaction history
- Settings

## Starting the Servers

### Automated Start (All Three Servers)

Create a new batch file `start-all.bat`:
```batch
@echo off
echo Starting all servers...
start "Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak > nul
start "Calculator" cmd /k "cd carbon-intelligence-system && http-server public -p 3001"
echo All servers started!
pause
```

### Manual Start

Terminal 1 - Backend:
```cmd
npm run dev
```

Terminal 2 - Frontend:
```cmd
cd frontend
npm run dev
```

Terminal 3 - Calculator & Marketplace:
```cmd
cd carbon-intelligence-system
http-server public -p 3001
```

## URLs

| Service | URL | Description |
|---------|-----|-------------|
| Main Frontend | http://localhost:5173 | Main dashboard and analytics |
| Main Backend | http://localhost:3000 | API server |
| Calculator Dashboard | http://localhost:3001/dashboard.html | Carbon calculator |
| Marketplace | http://localhost:3001/marketplace.html | Credit marketplace |
| Leaderboard | http://localhost:3001/leaderboard.html | User rankings |
| Profile | http://localhost:3001/profile.html | User profile |

## Navigation Flow

1. User opens main application: http://localhost:5173
2. User clicks "Calculator and Marketplace" in sidebar
3. Browser redirects to: http://localhost:3001/dashboard.html
4. User can navigate within calculator system using its internal navigation
5. To return to main platform, user can use browser back button or navigate directly

## Firebase Configuration

The calculator system uses Firebase for:
- Authentication (Firebase Auth)
- Database (Firestore)
- Hosting configuration

Note: The system is currently configured to use Firebase emulators for local development.

## Dependencies

### Global Dependencies
- `http-server` - Installed globally for serving static files

### Calculator System
- Firebase SDK (loaded via CDN)
- PapaParse (CSV parsing)
- XLSX (Excel file handling)
- CryptoJS (Blockchain functionality)

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:
```powershell
# Find process
netstat -ano | findstr :3001
# Kill process
taskkill /PID <PID> /F
```

Or change the port in:
- `carbon-intelligence-system/package.json`
- `frontend/src/components/Sidebar.jsx` (externalUrl)

### Calculator Not Loading

1. Verify http-server is running:
   ```cmd
   curl http://localhost:3001/dashboard.html
   ```

2. Check process status:
   - Look for "http-server public -p 3001" in task manager

3. Restart the server:
   ```cmd
   cd carbon-intelligence-system
   http-server public -p 3001
   ```

### Firebase Errors

The calculator system uses Firebase. If you see Firebase errors:
- The system is configured for Firebase emulators
- For production, you'll need to configure Firebase credentials
- Check `carbon-intelligence-system/firebase.json` for configuration

## Security Notes

- The external redirect uses `window.location.href` for full page navigation
- Both applications run on localhost (development only)
- For production, consider:
  - Using iframe integration instead of redirect
  - Implementing SSO (Single Sign-On)
  - Securing cross-origin communication
  - Using HTTPS for all services

## Future Enhancements

1. **Unified Authentication**
   - Share authentication between main platform and calculator
   - Single sign-on implementation

2. **Embedded Integration**
   - Use iframe to embed calculator within main platform
   - Avoid full page redirects

3. **API Integration**
   - Connect calculator data to main platform analytics
   - Sync carbon credits across systems

4. **Unified Navigation**
   - Add back button to calculator to return to main platform
   - Breadcrumb navigation

## Current Status

✅ All three servers running
✅ Sidebar navigation configured
✅ External redirect working
✅ Calculator system accessible
✅ Special highlighting applied
✅ No "Coming Soon" badge

---

**Last Updated**: 2026-02-15
**Integration Status**: Complete and Functional
