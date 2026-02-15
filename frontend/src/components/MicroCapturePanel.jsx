export default function MicroCapturePanel({ microCapture }) {
  return (
    <div className="card micro-capture-card">
      <h2 className="section-title">Micro Carbon Capture Strategy</h2>
      <div className="micro-capture-grid">
        <div className="capture-item">
          <div className="item-label">Emission Scale</div>
          <div className="item-value accent">{microCapture.emission_scale}</div>
        </div>
        <div className="capture-item">
          <div className="item-label">Strategy Type</div>
          <div className="item-value">{microCapture.capture_strategy_type}</div>
        </div>
        <div className="capture-item">
          <div className="item-label">Suitability Score</div>
          <div className="item-value accent">{microCapture.suitability_score}</div>
        </div>
        <div className="capture-item">
          <div className="item-label">Estimated Capture</div>
          <div className="item-value accent">
            {microCapture.estimated_capture_tons?.toFixed(2)} tons
          </div>
        </div>
        <div className="capture-item">
          <div className="item-label">Implementation Complexity</div>
          <div className="item-value">{microCapture.implementation_complexity}</div>
        </div>
        <div className="capture-item">
          <div className="item-label">Expected ROI Boost</div>
          <div className="item-value accent">{microCapture.expected_roi_boost}</div>
        </div>
      </div>
    </div>
  );
}
