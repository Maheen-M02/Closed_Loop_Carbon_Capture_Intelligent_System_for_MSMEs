import { useCarbonData } from '../hooks/useCarbonData';

export default function Compliance() {
  const { data, loading } = useCarbonData();

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (!data) return null;

  const compliance = data.compliance || {};

  const getStatusColor = (status) => {
    if (status === 'Compliant') return '#7CFFB2';
    if (status === 'Warning') return '#FFB84D';
    return '#FF6B6B';
  };

  const getRiskColor = (level) => {
    if (level === 'Low') return '#7CFFB2';
    if (level === 'Medium') return '#FFB84D';
    return '#FF6B6B';
  };

  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div className="header-icon">✓</div>
        <div className="header-content">
          <h1 className="header-title">Regulatory Compliance</h1>
          <div className="header-meta">
            <span className="meta-badge" style={{ background: getStatusColor(compliance.compliance_status) }}>
              {compliance.compliance_status}
            </span>
            <span className="meta-badge" style={{ background: getRiskColor(compliance.risk_level) }}>
              {compliance.risk_level} Risk
            </span>
          </div>
        </div>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {compliance.projected_threshold_breach_days !== null && (
          <div className="card-compact alert-card">
            <div className="card-header-compact">⚠️ Breach Alert</div>
            <div className="alert-value">{compliance.projected_threshold_breach_days}</div>
            <div className="alert-label">days to breach</div>
          </div>
        )}

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">⚠️ Regulatory Warning</div>
          <p className="card-text-compact">{compliance.regulatory_warning}</p>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">📋 Advisory</div>
          <p className="card-text-compact">{compliance.advisory_note}</p>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 4' }}>
          <div className="card-header-compact">Compliance Timeline</div>
          <div className="timeline-compact">
            <div className="timeline-step active">
              <div className="timeline-dot"></div>
              <div className="timeline-label">Current</div>
              <div className="timeline-value">{compliance.compliance_status}</div>
            </div>
            <div className="timeline-connector"></div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-label">Monitor</div>
              <div className="timeline-value">Track</div>
            </div>
            <div className="timeline-connector"></div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-label">Optimize</div>
              <div className="timeline-value">Reduce</div>
            </div>
            <div className="timeline-connector"></div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-label">Achieve</div>
              <div className="timeline-value">Maintain</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
