import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Recommendations from './pages/Recommendations';
import Compliance from './pages/Compliance';
import Optimization from './pages/Optimization';
import CarbonCapture from './pages/CarbonCapture';
import Simulator from './pages/Simulator';
import Reports from './pages/Reports';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'recommendations':
        return <Recommendations />;
      case 'compliance':
        return <Compliance />;
      case 'optimization':
        return <Optimization />;
      case 'carbon-capture':
        return <CarbonCapture />;
      case 'simulator':
        return <Simulator />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
