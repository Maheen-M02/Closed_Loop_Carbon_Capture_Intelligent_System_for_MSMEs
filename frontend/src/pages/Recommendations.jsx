import { useCarbonData } from '../hooks/useCarbonData';

export default function Recommendations() {
  const { data, loading } = useCarbonData();

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (!data) return null;

  const recommendations = data.recommendations || {};
  const allRecommendations = recommendations.recommendations || [];

  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div className="header-icon">💡</div>
        <div className="header-content">
          <h1 className="header-title">AI Recommendations</h1>
          <div className="header-meta">
            <span className="meta-badge accent">{recommendations.priority}</span>
            <span className="meta-text">{allRecommendations.length} Strategies</span>
          </div>
        </div>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {allRecommendations.map((rec, index) => (
          <div key={index} className="card-compact">
            <div className="card-header-compact">
              <span className="badge-mini" style={{
                background: rec.type === 'Carbon Capture' ? '#7CFFB2' : 
                           rec.type === 'Efficiency' ? '#4ECDC4' : '#95E1D3'
              }}>
                {rec.type}
              </span>
              <span className="text-muted">#{index + 1}</span>
            </div>
            <h3 className="card-title-compact">{rec.title}</h3>
            <p className="card-text-compact">{rec.description}</p>
            <div className="metrics-row-compact">
              <div className="metric-mini">
                <div className="metric-icon">📉</div>
                <div>
                  <div className="metric-value-mini accent">{rec.expected_reduction_percent?.toFixed(1)}%</div>
                  <div className="metric-label-mini">Reduction</div>
                </div>
              </div>
              <div className="metric-mini">
                <div className="metric-icon">✓</div>
                <div>
                  <div className="metric-value-mini">{rec.confidence_score}</div>
                  <div className="metric-label-mini">Confidence</div>
                </div>
              </div>
            </div>
            <div className="progress-bar-mini">
              <div className="progress-fill-mini" style={{ width: `${rec.expected_reduction_percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
