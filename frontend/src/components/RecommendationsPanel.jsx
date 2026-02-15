export default function RecommendationsPanel({ recommendations }) {
  const topRecommendations = recommendations.recommendations?.slice(0, 3) || [];

  return (
    <div className="card">
      <h2 className="section-title">Recommendations</h2>
      <div className="recommendation-priority">
        Priority: <span className="accent">{recommendations.priority}</span>
      </div>
      <p className="recommendation-summary">{recommendations.summary}</p>
      <div className="recommendations-list">
        {topRecommendations.map((rec, index) => (
          <div key={index} className="recommendation-item">
            <div className="recommendation-header">
              <span className="recommendation-title">{rec.title}</span>
              <span className="recommendation-type">{rec.type}</span>
            </div>
            <p className="recommendation-description">{rec.description}</p>
            <div className="recommendation-metrics">
              <span>Expected Reduction: <span className="accent">{rec.expected_reduction_percent?.toFixed(1)}%</span></span>
              <span>Confidence: {rec.confidence_score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
