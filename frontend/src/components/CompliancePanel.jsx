export default function CompliancePanel({ compliance }) {
  const getStatusColor = (status) => {
    if (status === 'Compliant') return '#7CFFB2';
    if (status === 'Warning') return '#FFB84D';
    return '#FF6B6B';
  };

  return (
    <div className="card">
      <h2 className="section-title">Compliance Status</h2>
      <div className="compliance-status" style={{ color: getStatusColor(compliance.compliance_status) }}>
        {compliance.compliance_status}
      </div>
      {compliance.projected_threshold_breach_days !== null && (
        <div className="compliance-breach">
          Projected Breach: {compliance.projected_threshold_breach_days} days
        </div>
      )}
      <div className="compliance-warning">
        {compliance.regulatory_warning}
      </div>
      <div className="compliance-advisory">
        <strong>Advisory:</strong> {compliance.advisory_note}
      </div>
    </div>
  );
}
