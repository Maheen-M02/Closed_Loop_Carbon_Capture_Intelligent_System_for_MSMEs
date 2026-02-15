import { useCarbonData } from '../hooks/useCarbonData';

export default function Optimization() {
  const { data, loading } = useCarbonData();

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (!data) return null;

  const optimization = data.optimization || {};
  const financial = data.financial_impact || {};

  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div className="header-icon">⚡</div>
        <div className="header-content">
          <h1 className="header-title">Optimization & ROI</h1>
          <div className="header-meta">
            <span className="meta-badge accent">{optimization.optimization_potential_percent?.toFixed(1)}% Potential</span>
            <span className="meta-text">{optimization.improvement_category}</span>
          </div>
        </div>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="card-compact">
          <div className="card-header-compact">💰 Investment</div>
          <div className="metric-value-large">{optimization.investment_priority}</div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">📈 Sustainability</div>
          <div className="metric-value-large accent">+{optimization.sustainability_score_boost?.toFixed(1)}</div>
          <div className="metric-label-mini">points boost</div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">🎯 Reduction</div>
          <div className="metric-value-large accent">{financial.potential_reduction_tons?.toFixed(2)}</div>
          <div className="metric-label-mini">tons CO₂</div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">🏆 Credits</div>
          <div className="metric-value-large accent">{financial.carbon_credits_generated?.toFixed(2)}</div>
          <div className="metric-label-mini">generated</div>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">💵 Credit Value Range</div>
          <div className="value-range">
            <div className="range-item">
              <div className="range-label">Min</div>
              <div className="range-value">₹{financial.estimated_credit_value_min?.toLocaleString('en-IN')}</div>
            </div>
            <div className="range-divider">→</div>
            <div className="range-item">
              <div className="range-label">Max</div>
              <div className="range-value accent">₹{financial.estimated_credit_value_max?.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">⚠️ Avoided Penalties</div>
          <div className="metric-value-large">₹{financial.avoided_compliance_penalty?.toLocaleString('en-IN')}</div>
          <div className="metric-label-mini">compliance savings</div>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 4' }}>
          <div className="card-header-compact">Return on Investment</div>
          <div className="roi-compact">
            <div className="roi-main-compact">
              <div className="roi-percentage-large accent">{financial.roi_percent?.toFixed(1)}%</div>
              <div className="roi-label-compact">Expected ROI</div>
            </div>
            <div className="roi-breakdown-compact">
              <div className="roi-item-compact">
                <span className="roi-label-small">Total Benefit (Min)</span>
                <span className="roi-value-small">₹{financial.total_financial_benefit_min?.toLocaleString('en-IN')}</span>
              </div>
              <div className="roi-item-compact">
                <span className="roi-label-small">Total Benefit (Max)</span>
                <span className="roi-value-small accent">₹{financial.total_financial_benefit_max?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
