import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Sidebar({ currentPage, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡', path: '/recommendations' },
    { id: 'compliance', label: 'Compliance', icon: '✓', path: '/compliance' },
    { id: 'optimization', label: 'Optimization', icon: '⚡', path: '/optimization' },
    { id: 'carbon-capture', label: 'Carbon Capture', icon: '🌱', path: '/carbon-capture' },
    { id: 'simulator', label: 'Simulator', icon: '🔬', path: '/simulator' },
    { id: 'reports', label: 'Reports', icon: '📄', path: '/reports' },
    { id: 'calculator-marketplace', label: 'Calculator and Marketplace', icon: '🛒', path: null, disabled: false, comingSoon: false, externalUrl: 'http://localhost:3001/dashboard.html' }
  ];

  // Update currentPage based on location
  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem && onNavigate) {
      onNavigate(currentItem.id);
    }
  }, [location.pathname]);

  const handleNavigation = (item) => {
    if (item.disabled) return;
    
    // Handle external link for calculator-marketplace
    if (item.id === 'calculator-marketplace' && item.externalUrl) {
      window.location.href = item.externalUrl;
      return;
    }
    
    navigate(item.path);
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🌱</div>
        <h2 className="sidebar-title">CarbonSetu</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''} ${item.disabled ? 'nav-item-disabled' : ''} ${item.comingSoon ? 'nav-item-coming-soon' : ''}`}
            onClick={() => handleNavigation(item)}
            disabled={item.disabled}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">
              {item.label}
              {item.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
            </span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">System Active</span>
        </div>
      </div>
    </aside>
  );
}
