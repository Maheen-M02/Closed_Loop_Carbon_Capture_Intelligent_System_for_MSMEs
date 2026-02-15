export default function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'compliance', label: 'Compliance', icon: '✓' },
    { id: 'optimization', label: 'Optimization', icon: '⚡' },
    { id: 'carbon-capture', label: 'Carbon Capture', icon: '🌱' },
    { id: 'simulator', label: 'Simulator', icon: '🔬' },
    { id: 'reports', label: 'Reports', icon: '📄' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🌍</div>
        <h2 className="sidebar-title">Carbon Intelligence</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
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
