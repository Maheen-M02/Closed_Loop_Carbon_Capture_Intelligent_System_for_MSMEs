/**
 * Explainability Engine
 * Generates human-readable AI-style explanations for carbon analytics
 */

/**
 * Ensures value is a valid number
 * @param {*} val
 * @returns {number}
 */
function safeNumber(val) {
  return typeof val === "number" && !isNaN(val) ? val : 0;
}

/**
 * Maps risk component keys to human-readable labels
 * @param {string} key
 * @returns {string}
 */
function getRiskDriverLabel(key) {
  const labels = {
    intensity_risk: "Carbon Intensity",
    growth_risk: "Emission Growth",
    peak_risk: "Peak Dependency",
    volatility_risk: "Operational Volatility",
    anomaly_fault_risk: "Anomalies & Downtime"
  };
  return labels[key] || key;
}

/**
 * Identifies top risk contributors from breakdown
 * @param {object} breakdown
 * @returns {array}
 */
function getTopRiskDrivers(breakdown) {
  if (!breakdown || typeof breakdown !== "object") return [];

  const entries = Object.entries(breakdown).map(([key, value]) => ({
    key,
    value: safeNumber(value),
    label: getRiskDriverLabel(key)
  }));

  entries.sort((a, b) => b.value - a.value);

  return entries.slice(0, 2).map(entry => `${entry.label} (${Math.round(entry.value)}%)`);
}

/**
 * Generates risk explanation based on score and drivers
 * @param {number} riskScore
 * @param {array} topDrivers
 * @returns {string}
 */
function generateRiskExplanation(riskScore, topDrivers) {
  const score = safeNumber(riskScore);
  const drivers = topDrivers.length > 0 
    ? topDrivers.join(" and ") 
    : "operational factors";

  if (score > 70) {
    return `Carbon risk is high, primarily driven by ${drivers}. These factors significantly increase emission exposure and operational instability.`;
  } 

  if (score >= 40) {
    return `Carbon risk is moderate, influenced mainly by ${drivers}. Targeted optimization can reduce sustainability risk.`;
  }

  return `Carbon risk remains stable. Key factors such as ${drivers} are within controlled thresholds.`;
}

/**
 * Generates projected impact summary from top recommendation
 * @param {array} recommendations
 * @returns {string}
 */
function generateProjectedImpact(recommendations) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return "Continue monitoring emission patterns to identify optimization opportunities.";
  }

  const topRecommendation = recommendations[0];
  const title = topRecommendation.title || "recommended action";
  const reduction = safeNumber(topRecommendation.expected_reduction_percent);

  if (reduction === 0) {
    return `${title} will help maintain current emission levels and operational stability.`;
  }

  return `Implementing ${title} may reduce emissions by up to ${Math.round(reduction * 10) / 10}%, improving overall sustainability performance and financial efficiency.`;
}

/**
 * Generates strategic insight based on priority
 * @param {string} priority
 * @returns {string}
 */
function generateStrategicInsight(priority) {
  if (priority === "High") {
    return "Immediate intervention is recommended. Deploy high-impact strategies to rapidly reduce carbon footprint and ensure compliance.";
  }

  if (priority === "Medium") {
    return "Optimization measures can improve sustainability. Implement recommended actions to enhance efficiency and reduce environmental impact.";
  }

  return "Maintain current operational strategy. Continue monitoring performance metrics and sustaining best practices.";
}

/**
 * Generates comprehensive explainability report
 * @param {object} baseData
 * @param {object} metrics
 * @param {object} recommendations
 * @returns {object}
 */
function generateExplainability(baseData, metrics, recommendations) {
  const riskScore = safeNumber(metrics.carbon_risk_score);
  const breakdown = metrics.breakdown || {};
  const priority = recommendations.priority || "Low";
  const recommendationList = recommendations.recommendations || [];

  const topDrivers = getTopRiskDrivers(breakdown);
  const riskExplanation = generateRiskExplanation(riskScore, topDrivers);
  const projectedImpact = generateProjectedImpact(recommendationList);
  const strategicInsight = generateStrategicInsight(priority);

  return {
    risk_explanation: riskExplanation,
    top_drivers: topDrivers,
    projected_impact_summary: projectedImpact,
    strategic_insight: strategicInsight
  };
}

module.exports = {
  generateExplainability
};
