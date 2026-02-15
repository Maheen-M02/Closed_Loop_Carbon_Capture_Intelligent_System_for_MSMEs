import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Initial load animation
    setTimeout(() => setLoaded(true), 100);
    // Show button after animation
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`landing-container ${loaded ? 'loaded' : ''}`}>
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* 3D rotating cube */}
      <div className="cube-container">
        <div className="cube">
          <div className="cube-face front">CO₂</div>
          <div className="cube-face back">NET</div>
          <div className="cube-face right">ZERO</div>
          <div className="cube-face left">ESG</div>
          <div className="cube-face top">AI</div>
          <div className="cube-face bottom">CARBON</div>
        </div>
      </div>

      {/* Main content */}
      <div className="landing-content">
        <div className="logo-animation">
          <div className="logo-icon">🌱</div>
          <h1 className="brand-name">
            <span className="brand-carbon">Carbon</span>
            <span className="brand-setu">Setu</span>
          </h1>
          <p className="tagline">AI-Powered Carbon Intelligence Platform</p>
        </div>

        {showButton && (
          <button className="enter-button" onClick={handleEnter}>
            <span className="button-text">Go to Dashboard</span>
            <span className="button-arrow">→</span>
          </button>
        )}
      </div>

      {/* Floating elements */}
      <div className="floating-elements">
        <div className="float-item float-1">🌍</div>
        <div className="float-item float-2">♻️</div>
        <div className="float-item float-3">⚡</div>
        <div className="float-item float-4">🔋</div>
      </div>
    </div>
  );
}
