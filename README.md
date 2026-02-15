# Carbon Intelligence Platform

A full-stack carbon analytics and intelligence platform with React frontend and Node.js backend.

## Prerequisites

- Node.js v18+ (You have v22.20.0 ✓)
- npm v8+ (You have v11.6.0 ✓)

## Quick Start

### 1. Install Backend Dependencies

```cmd
npm install
```

### 2. Install Frontend Dependencies

```cmd
cd frontend
npm install
cd ..
```

### 3. Start the Backend Server

```cmd
npm start
```

The backend will run on http://localhost:3000

### 4. Start the Frontend (in a new terminal)

```cmd
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173

## Development Mode

For auto-reload during development:

Backend:
```cmd
npm run dev
```

Frontend:
```cmd
cd frontend
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/demo-analysis` - Get demo carbon analysis
- `POST /api/simulate` - Run what-if scenarios
- `GET /api/esg-report/pdf` - Download ESG report
- `GET /api/blockchain-certificate/pdf` - Download blockchain certificate

## Project Structure

```
├── server.js                 # Express server
├── routes/                   # API routes
├── controllers/              # Request handlers
├── engines/                  # Business logic engines
├── services/                 # Service layer
├── data/                     # JSON data files
└── frontend/                 # React frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/            # Page components
    │   ├── api/              # API client
    │   └── hooks/            # Custom hooks
    └── vite.config.js        # Vite configuration
```

## Troubleshooting

If you encounter port conflicts:
- Backend: Change PORT in server.js
- Frontend: Change port in frontend/vite.config.js

## Build for Production

Frontend:
```cmd
cd frontend
npm run build
```

The built files will be in `frontend/dist/`
