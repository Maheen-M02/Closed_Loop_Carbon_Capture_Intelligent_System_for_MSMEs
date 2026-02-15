import { useCarbonData } from '../hooks/useCarbonData';

export default function Dashboard() {
  const { data, loading, error } = useCarbonData();

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (error) return <div className="error-container"><div className="error-text">Error: {error}</div></div>;
  if (!data) return null;

  const metrics = data.metrics || {};
  const compliance = data.compliance || {};
  const optimization = data.optimization || {};
  const financial = data.financial_impact || {};

  return (
    <div className="enterprise-page">
      {/* Compact Header */}
      <div className="enterprise-header">
        <div>
          <h1 className="enterprise-title">Carbon Intelligence Dashboard</h1>
          <p className="enterprise-subtitle">Real-time emission analytics</p>
        </div>
        <div className="header-metrics">
          <div className="header-metric">
            <span className="header-metric-value">{data.emissions?.toFixed(1)}</span>
            <span className="header-metric-label">Emissions (t)</span>
          </div>
          <div className="header-metric accent">
            <span className="header-metric-value">{metrics.carbon_risk_score}</span>
            <span className="header-metric-label">Risk Score</span>
          </div>
          <div className="header-metric">
            <span className="header-metric-value">{optimization.optimization_potential_percent?.toFixed(1)}%</span>
            <span className="header-metric-label">Optimization</span>
          </div>
        </div>
      </div>

      {/* Compact Grid */}
      <div className="enterprise-grid">
        {/* Risk Gauge - Compact */}
        <div className="enterprise-card">
          <div className="card-header-compact">
            <h3>Risk Assessment</h3>
            <span className="risk-level-badge">{metrics.risk_level}</span>
          </div>
          <div className="gauge-compact">
            <svg viewBox="0 0 120 70" className="gauge-svg-compact">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7CFFB2" />
                  <stop offset="50%" stopColor="#FFB84D" />
                  <stop offset="100%" stopColor="#FF6B6B" />
                </linearGradient>
              </defs>
              <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#EAF5EE" strokeWidth="12" strokeLinecap="round"/>
              <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(metrics.carbon_risk_score / 100) * 157} 157`}/>
            </svg>
            <div className="gauge-value-compact">{metrics.carbon_risk_score}</div>
          </div>
        </div>

        {/* Metrics - Ultra Compact */}
        <div className="enterprise-card">
          <div className="card-header-compact"><h3>Key Metrics</h3></div>
          <div className="metrics-ultra-compact">
            <div className="metric-mini">
              <span className="metric-mini-icon">📊</span>
              <div>
                <div className="metric-mini-value">{metrics.carbon_intensity?.toFixed(4)}</div>
                <div className="metric-mini-label">Intensity</div>
              </div>
            </div>
            <div className="metric-mini">
              <span className="metric-mini-icon">📈</span>
              <div>
                <div className="metric-mini-value">{metrics.growth_rate?.toFixed(1)}%</div>
                <div className="metric-mini-label">Growth</div>
              </div>
            </div>
            <div className="metric-mini">
              <span className="metric-mini-icon">⚡</span>
              <div>
                <div className="metric-mini-value">{metrics.volatility?.toFixed(1)}</div>
                <div className="metric-mini-label">Volatility</div>
              </div>
            </div>
            <div className="metric-mini">
              <span className="metric-mini-icon">🎯</span>
              <div>
                <div className="metric-mini-value">{metrics.stability_index}</div>
                <div className="metric-mini-label">Stability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance - Compact */}
        <div className="enterprise-card">
          <div className="card-header-compact"><h3>Compliance</h3></div>
          <div className="compliance-mini">
            <div className={`status-badge-mini ${compliance.compliance_status?.toLowerCase().replace(' ', '-')}`}>
              {compliance.compliance_status}
            </div>
            <div className="compliance-detail">{compliance.risk_level} Risk</div>
          </div>
        </div>

        {/* Financial - Compact */}
        <div className="enterprise-card">
          <div className="card-header-compact"><h3>Financial</h3></div>
          <div className="financial-mini">
            <div className="financial-row">
              <span>Credits</span>
              <span className="financial-value">{financial.carbon_credits_generated?.toFixed(0)}</span>
            </div>
            <div className="financial-row">
              <span>ROI</span>
              <span className="financial-value accent">{financial.roi_percent?.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Risk Breakdown - Compact */}
        <div className="enterprise-card span-2">
          <div className="card-header-compact"><h3>Risk Components</h3></div>
          <div className="risk-bars-mini">
            {Object.entries(metrics.breakdown || {}).map(([key, value]) => (
              <div key={key} className="risk-bar-mini">
                <span className="risk-label-mini">{key.replace(/_/g, ' ').replace(/risk/g, '').trim()}</span>
                <div className="risk-track-mini">
                  <div className="risk-fill-mini" style={{ width: `${value}%` }}/>
                </div>
                <span className="risk-value-mini">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recommendation - Compact */}
        <div className="enterprise-card span-2">
          <div className="card-header-compact"><h3>Top Recommendation</h3></div>
          {data.recommendations?.recommendations?.[0] && (
            <div className="recommendation-mini">
              <div className="rec-header-mini">
                <span className="rec-type-mini">{data.recommendations.recommendations[0].type}</span>
                <span className="rec-impact-mini">{data.recommendations.recommendations[0].expected_reduction_percent?.toFixed(1)}% reduction</span>
              </div>
              <div className="rec-title-mini">{data.recommendations.recommendations[0].title}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
