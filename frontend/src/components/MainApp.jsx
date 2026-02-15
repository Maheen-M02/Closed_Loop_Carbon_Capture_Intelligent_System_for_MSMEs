import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import Recommendations from '../pages/Recommendations';
import Compliance from '../pages/Compliance';
import Optimization from '../pages/Optimization';
import CarbonCapture from '../pages/CarbonCapture';
import Simulator from '../pages/Simulator';
import Reports from '../pages/Reports';

export default function MainApp() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (path) {
      setCurrentPage(path);
    }
  }, [location]);

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/carbon-capture" element={<CarbonCapture />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
