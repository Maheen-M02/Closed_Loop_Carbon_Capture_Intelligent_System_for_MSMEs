export default function RiskBreakdown({ breakdown }) {
  const risks = [
    { label: 'Intensity Risk', value: breakdown.intensity_risk },
    { label: 'Growth Risk', value: breakdown.growth_risk },
    { label: 'Peak Risk', value: breakdown.peak_risk },
    { label: 'Volatility Risk', value: breakdown.volatility_risk },
    { label: 'Anomaly & Fault Risk', value: breakdown.anomaly_fault_risk }
  ];

  return (
    <div className="card">
      <h2 className="section-title">Risk Breakdown</h2>
      <div className="risk-bars">
        {risks.map((risk, index) => (
          <div key={index} className="risk-item">
            <div className="risk-label">{risk.label}</div>
            <div className="risk-bar-container">
              <div 
                className="risk-bar" 
                style={{ width: `${risk.value}%` }}
              />
              <span className="risk-value">{risk.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
