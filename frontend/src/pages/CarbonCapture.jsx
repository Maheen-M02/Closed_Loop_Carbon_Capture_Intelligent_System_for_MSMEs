import { useCarbonData } from '../hooks/useCarbonData';

export default function CarbonCapture() {
  const { data, loading } = useCarbonData();

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (!data) return null;

  const capture = data.micro_capture || {};

  const getComplexityColor = (complexity) => {
    if (complexity === 'Low') return '#7CFFB2';
    if (complexity === 'Medium') return '#4ECDC4';
    if (complexity === 'High') return '#FFB84D';
    return '#FF6B6B';
  };

  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div className="header-icon">🌱</div>
        <div className="header-content">
          <h1 className="header-title">{capture.capture_strategy_type}</h1>
          <div className="header-meta">
            <span className="meta-badge accent">{capture.emission_scale} Scale</span>
            <span className="meta-badge" style={{ background: getComplexityColor(capture.implementation_complexity) }}>
              {capture.implementation_complexity} Complexity
            </span>
          </div>
        </div>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="card-compact">
          <div className="card-header-compact">🎯 Suitability</div>
          <div className="metric-value-large accent">{capture.suitability_score}</div>
          <div className="progress-bar-mini">
            <div className="progress-fill-mini" style={{ width: `${capture.suitability_score}%` }} />
          </div>
          <div className="metric-label-mini">
            {capture.suitability_score > 70 ? 'Highly Suitable' : 
             capture.suitability_score > 40 ? 'Moderately Suitable' : 'Limited Suitability'}
          </div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">🌍 Capture Potential</div>
          <div className="metric-value-large accent">{capture.estimated_capture_tons?.toFixed(2)}</div>
          <div className="metric-label-mini">tons CO₂ annually</div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">📈 ROI Boost</div>
          <div className="metric-value-large">{capture.expected_roi_boost}</div>
          <div className="metric-label-mini">expected impact</div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">⚙️ Implementation</div>
          <div className="metric-value-large" style={{ color: getComplexityColor(capture.implementation_complexity) }}>
            {capture.implementation_complexity}
          </div>
          <div className="metric-label-mini">complexity level</div>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 4' }}>
          <div className="card-header-compact">Implementation Roadmap</div>
          <div className="roadmap-compact">
            <div className="roadmap-step-compact">
              <div className="step-number-compact">1</div>
              <div className="step-content-compact">
                <div className="step-title-compact">Assessment</div>
                <div className="step-desc-compact">Site evaluation</div>
              </div>
            </div>
            <div className="roadmap-arrow">→</div>
            <div className="roadmap-step-compact">
              <div className="step-number-compact">2</div>
              <div className="step-content-compact">
                <div className="step-title-compact">Design</div>
                <div className="step-desc-compact">System engineering</div>
              </div>
            </div>
            <div className="roadmap-arrow">→</div>
            <div className="roadmap-step-compact">
              <div className="step-number-compact">3</div>
              <div className="step-content-compact">
                <div className="step-title-compact">Installation</div>
                <div className="step-desc-compact">Equipment deployment</div>
              </div>
            </div>
            <div className="roadmap-arrow">→</div>
            <div className="roadmap-step-compact">
              <div className="step-number-compact">4</div>
              <div className="step-content-compact">
                <div className="step-title-compact">Operation</div>
                <div className="step-desc-compact">Monitor & optimize</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">✓ Key Benefits</div>
          <ul className="benefits-list-compact">
            <li>Direct CO₂ emission reduction</li>
            <li>Carbon credit generation</li>
            <li>Circular economy integration</li>
            <li>Regulatory compliance support</li>
          </ul>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">📊 Strategy Overview</div>
          <p className="card-text-compact">
            {capture.capture_strategy_type} technology designed for {capture.emission_scale.toLowerCase()} scale operations. 
            Estimated to capture {capture.estimated_capture_tons?.toFixed(2)} tons of CO₂ annually with {capture.implementation_complexity.toLowerCase()} implementation complexity.
          </p>
        </div>
      </div>
    </div>
  );
}
