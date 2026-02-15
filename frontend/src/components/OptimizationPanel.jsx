export default function OptimizationPanel({ optimization, financialImpact }) {
  return (
    <div className="card">
      <h2 className="section-title">Optimization & Financial Impact</h2>
      <div className="optimization-grid">
        <div className="optimization-item">
          <div className="item-label">Optimization Potential</div>
          <div className="item-value accent">
            {optimization.optimization_potential_percent?.toFixed(1)}%
          </div>
        </div>
        <div className="optimization-item">
          <div className="item-label">Sustainability Boost</div>
          <div className="item-value accent">
            {optimization.sustainability_score_boost?.toFixed(1)}
          </div>
        </div>
        <div className="optimization-item">
          <div className="item-label">Carbon Credits</div>
          <div className="item-value accent">
            {financialImpact.carbon_credits_generated?.toFixed(2)} credits
          </div>
        </div>
        <div className="optimization-item">
          <div className="item-label">Credit Value Range</div>
          <div className="item-value">
            ₹{financialImpact.estimated_credit_value_min?.toFixed(0)} - ₹{financialImpact.estimated_credit_value_max?.toFixed(0)}
          </div>
        </div>
        <div className="optimization-item">
          <div className="item-label">ROI</div>
          <div className="item-value accent">
            {financialImpact.roi_percent?.toFixed(1)}%
          </div>
        </div>
        <div className="optimization-item">
          <div className="item-label">Investment Priority</div>
          <div className="item-value">
            {optimization.investment_priority}
          </div>
        </div>
      </div>
    </div>
  );
}
