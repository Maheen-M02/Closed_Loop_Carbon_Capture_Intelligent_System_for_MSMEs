import { useCarbonData } from '../hooks/useCarbonData';

export default function Analytics() {
  const { data, loading } = useCarbonData();

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (!data) return null;

  const metrics = data.metrics || {};
  const breakdown = metrics.breakdown || {};

  // Calculate max value for scaling
  const maxBreakdown = Math.max(...Object.values(breakdown));

  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div>
          <h1 className="enterprise-title">Carbon Analytics</h1>
          <p className="enterprise-subtitle">Comprehensive emission analysis</p>
        </div>
        <div className="header-metrics">
          <div className="header-metric accent">
            <span className="header-metric-value">{metrics.carbon_risk_score}</span>
            <span className="header-metric-label">Risk Score</span>
          </div>
          <div className="header-metric">
            <span className="header-metric-value">{metrics.risk_level}</span>
            <span className="header-metric-label">Risk Level</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid-enterprise">
        {/* Risk Distribution Chart */}
        <div className="enterprise-card chart-card">
          <div className="card-header-compact"><h3>Risk Distribution</h3></div>
          <div className="bar-chart">
            {Object.entries(breakdown).map(([key, value]) => {
              const colors = {
                intensity_risk: '#7CFFB2',
                growth_risk: '#4ECDC4',
                peak_risk: '#95E1D3',
                volatility_risk: '#FFB84D',
                anomaly_fault_risk: '#FF9A3D'
              };
              return (
                <div key={key} className="bar-item">
                  <div className="bar-label">{key.replace(/_/g, ' ').replace(/risk/g, '').trim()}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${(value / maxBreakdown) * 100}%`,
                        background: colors[key] || '#7CFFB2'
                      }}
                    >
                      <span className="bar-value">{value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="enterprise-card">
          <div className="card-header-compact"><h3>Performance Metrics</h3></div>
          <div className="metrics-grid-enterprise">
            <div className="metric-enterprise">
              <div className="metric-enterprise-icon">📊</div>
              <div className="metric-enterprise-content">
                <div className="metric-enterprise-value">{metrics.carbon_intensity?.toFixed(4)}</div>
                <div className="metric-enterprise-label">Carbon Intensity</div>
              </div>
            </div>
            <div className="metric-enterprise">
              <div className="metric-enterprise-icon">📈</div>
              <div className="metric-enterprise-content">
                <div className="metric-enterprise-value">{metrics.growth_rate?.toFixed(1)}%</div>
                <div className="metric-enterprise-label">Growth Rate</div>
              </div>
            </div>
            <div className="metric-enterprise">
              <div className="metric-enterprise-icon">⚡</div>
              <div className="metric-enterprise-content">
                <div className="metric-enterprise-value">{metrics.volatility?.toFixed(1)}</div>
                <div className="metric-enterprise-label">Volatility</div>
              </div>
            </div>
            <div className="metric-enterprise">
              <div className="metric-enterprise-icon">🎯</div>
              <div className="metric-enterprise-content">
                <div className="metric-enterprise-value">{metrics.stability_index}</div>
                <div className="metric-enterprise-label">Stability</div>
              </div>
            </div>
            <div className="metric-enterprise">
              <div className="metric-enterprise-icon">📉</div>
              <div className="metric-enterprise-content">
                <div className="metric-enterprise-value">{metrics.peak_percent?.toFixed(1)}%</div>
                <div className="metric-enterprise-label">Peak Dependency</div>
              </div>
            </div>
            <div className="metric-enterprise">
              <div className="metric-enterprise-icon">🔮</div>
              <div className="metric-enterprise-content">
                <div className="metric-enterprise-value">{metrics.forecast_growth_percent?.toFixed(1)}%</div>
                <div className="metric-enterprise-label">Forecast</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="enterprise-card span-full">
          <div className="card-header-compact"><h3>Risk Analysis & Insights</h3></div>
          <div className="insights-grid">
            <div className="insight-box">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <div className="insight-title">Risk Explanation</div>
                <div className="insight-text">{data.explainability?.risk_explanation}</div>
              </div>
            </div>
            <div className="insight-box">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <div className="insight-title">Strategic Insight</div>
                <div className="insight-text">{data.explainability?.strategic_insight}</div>
              </div>
            </div>
            <div className="insight-box">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <div className="insight-title">Top Risk Drivers</div>
                <div className="drivers-compact">
                  {(Array.isArray(data.explainability?.top_drivers) 
                    ? data.explainability.top_drivers 
                    : []
                  ).map((driver, idx) => (
                    <span key={idx} className="driver-tag">{driver}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
