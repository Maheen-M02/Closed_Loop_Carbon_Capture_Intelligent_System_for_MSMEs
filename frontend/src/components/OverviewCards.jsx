export default function OverviewCards({ data }) {
  const cards = [
    {
      label: 'Total Emissions',
      value: `${data.emissions?.toFixed(2) || 0} tons`,
      accent: true
    },
    {
      label: 'Carbon Risk Score',
      value: data.metrics?.carbon_risk_score || 0,
      accent: true
    },
    {
      label: 'Compliance Status',
      value: data.compliance?.compliance_status || 'Unknown',
      accent: false
    },
    {
      label: 'Optimization Potential',
      value: `${data.optimization?.optimization_potential_percent?.toFixed(1) || 0}%`,
      accent: true
    },
    {
      label: 'ROI',
      value: `${data.financial_impact?.roi_percent?.toFixed(1) || 0}%`,
      accent: true
    }
  ];

  return (
    <div className="overview-cards">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="card-label">{card.label}</div>
          <div className={card.accent ? 'card-value accent' : 'card-value'}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
