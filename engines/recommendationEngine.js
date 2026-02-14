/**
 * AI Recommendation Engine
 * Rule-based intelligent recommendations for carbon optimization
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
 * Safely clamps a value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min = 0, max = 100) {
  if (typeof value !== "number" || isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates anomaly rate percentage
 * @param {number} anomalyCount
 * @param {number} totalHours
 * @returns {number}
 */
function calculateAnomalyRate(anomalyCount, totalHours) {
  if (totalHours === 0) return 0;
  return (anomalyCount / totalHours) * 100;
}

/**
 * Calculates downtime percentage
 * @param {number} downtimeMinutes
 * @param {number} totalRuntimeMinutes
 * @returns {number}
 */
function calculateDowntimePercent(downtimeMinutes, totalRuntimeMinutes) {
  if (totalRuntimeMinutes === 0) return 0;
  return (downtimeMinutes / (downtimeMinutes+totalRuntimeMinutes)) * 100;
}

/**
 * Determines priority level based on risk score
 * @param {number} riskScore
 * @returns {string}
 */
function determinePriority(riskScore) {
  if (riskScore > 70) return "High";
  if (riskScore >= 40) return "Medium";
  return "Low";
}

/**
 * Calculates confidence score based on volatility
 * @param {number} volatility
 * @returns {number}
 */
function calculateConfidenceScore(volatility) {
  const score = 100 - safeNumber(volatility);
  return clamp(score, 50, 95);
}

/**
 * Generates operational recommendations based on metrics
 * @param {object} baseData
 * @param {object} metrics
 * @returns {array}
 */
function generateOperationalRecommendations(baseData, metrics) {
  const recommendations = [];
  const confidenceScore = calculateConfidenceScore(metrics.volatility);

  const peakPercent = safeNumber(metrics.peak_percent);
  if (peakPercent > 60) {
    recommendations.push({
      type: "Operational",
      title: "Load Shifting Strategy",
      description: "High peak emission dependency detected. Implement load shifting to off-peak hours to distribute energy consumption more evenly throughout the day.",
      expected_reduction_percent: clamp(5 + (peakPercent - 60) * 0.1, 5, 10),
      confidence_score: confidenceScore
    });
  }

  const volatility = safeNumber(metrics.volatility);
  if (volatility > 50) {
    recommendations.push({
      type: "Operational",
      title: "Process Stabilization",
      description: "High emission volatility indicates unstable operations. Standardize production processes and implement real-time monitoring to reduce fluctuations.",
      expected_reduction_percent: clamp(4 + (volatility - 50) * 0.08, 4, 8),
      confidence_score: confidenceScore
    });
  }

  const anomalyRate = calculateAnomalyRate(
    safeNumber(baseData.anomaly_count),
    safeNumber(baseData.total_hours)
  );
  if (anomalyRate > 5) {
    recommendations.push({
      type: "Operational",
      title: "Machinery Inspection & Maintenance",
      description: "Elevated anomaly rate suggests equipment inefficiencies. Schedule comprehensive machinery inspection and preventive maintenance to optimize performance.",
      expected_reduction_percent: clamp(6 + (anomalyRate - 5) * 0.15, 6, 12),
      confidence_score: confidenceScore
    });
  }

  const downtimePercent = calculateDowntimePercent(
    safeNumber(baseData.downtime_minutes),
    safeNumber(baseData.total_runtime_minutes)
  );
  if (downtimePercent > 40) {
    recommendations.push({
      type: "Operational",
      title: "Operational Efficiency Optimization",
      description: "Significant downtime detected. Analyze root causes, optimize workflow scheduling, and implement predictive maintenance to minimize operational interruptions.",
      expected_reduction_percent: clamp(3 + (downtimePercent - 40) * 0.1, 3, 7),
      confidence_score: confidenceScore
    });
  }

  const carbonIntensity = safeNumber(metrics.carbon_intensity);
  const benchmark = safeNumber(baseData.industry_benchmark_intensity);
  if (benchmark > 0 && carbonIntensity > benchmark) {
    recommendations.push({
      type: "Efficiency",
      title: "Energy Efficiency Upgrade",
      description: "Carbon intensity exceeds industry benchmark. Invest in energy-efficient equipment, optimize combustion processes, and implement waste heat recovery systems.",
      expected_reduction_percent: clamp(5 + (carbonIntensity - benchmark) * 0.5, 5, 15),
      confidence_score: confidenceScore
    });
  }

  return recommendations;
}

/**
 * Generates carbon capture recommendation if applicable
 * @param {object} baseData
 * @param {object} metrics
 * @returns {object|null}
 */
function generateCarbonCaptureRecommendation(baseData, metrics) {
  const riskScore = safeNumber(metrics.carbon_risk_score);
  
  if (riskScore <= 75) return null;

  const confidenceScore = calculateConfidenceScore(metrics.volatility);
  const totalEmission = safeNumber(baseData.total_emission_tons);
  
  let description = "Deploy a Modular CO₂ Mineralization Unit to capture flue gas emissions and convert them into eco-construction blocks. This carbon utilization strategy transforms waste CO₂ into valuable building materials.";
  
  if (totalEmission > 50) {
    const estimatedCapture = Math.round(totalEmission * 0.15 * 100) / 100;
    description += ` Potential CO₂ capture capacity: ${estimatedCapture} tons/month. This presents a significant opportunity for local construction block production and circular economy integration.`;
  }

  return {
    type: "Carbon Capture",
    title: "Modular Carbon Capture & Utilization",
    description: description,
    expected_reduction_percent: clamp(10 + (riskScore - 75) * 0.3, 10, 20),
    confidence_score: confidenceScore
  };
}

/**
 * Generates comprehensive recommendations
 * @param {object} baseData
 * @param {object} metrics
 * @returns {object}
 */
function generateRecommendations(baseData, metrics) {
  const riskScore = safeNumber(metrics.carbon_risk_score);
  const priority = determinePriority(riskScore);
  
  const recommendations = generateOperationalRecommendations(baseData, metrics);
  
  const captureRecommendation = generateCarbonCaptureRecommendation(baseData, metrics);
  if (captureRecommendation) {
    recommendations.push(captureRecommendation);
  }

  if (recommendations.length === 0) {
    const confidenceScore = calculateConfidenceScore(metrics.volatility);
    recommendations.push({
      type: "Operational",
      title: "Maintain & Monitor",
      description: "Current operations are within acceptable parameters. Continue monitoring emission patterns and maintain existing efficiency measures.",
      expected_reduction_percent: 0,
      confidence_score: confidenceScore
    });
  }

  recommendations.sort(
    (a, b) => b.expected_reduction_percent - a.expected_reduction_percent
  );

  const hasCarbonCapture = captureRecommendation !== null;
  const summary = `${priority} priority risk level identified. Generated ${recommendations.length} recommendation${recommendations.length > 1 ? 's' : ''}${hasCarbonCapture ? ' including carbon capture strategy' : ''}.`;

  return {
    priority: priority,
    summary: summary,
    recommendations: recommendations
  };
}

module.exports = {
  generateRecommendations
};
