/**
 * ESG Report Engine
 * Generates structured ESG reports for board-level presentation
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
 * Rounds value to specified decimal places
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
function roundTo(value, decimals = 2) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
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
  return (downtimeMinutes / totalRuntimeMinutes) * 100;
}

/**
 * Generates executive summary section
 * @param {object} baseData
 * @param {object} analysis
 * @returns {string}
 */
function generateExecutiveSummary(baseData, analysis) {
  const totalEmission = roundTo(safeNumber(baseData.total_emission_tons));
  const riskScore = roundTo(safeNumber(analysis.metrics.carbon_risk_score));
  const complianceStatus = analysis.compliance.compliance_status || "Unknown";
  const optimizationPotential = roundTo(safeNumber(analysis.optimization.optimization_potential_percent));

  return `The facility recorded total emissions of ${totalEmission} tons with a carbon risk score of ${riskScore}. Current compliance status is ${complianceStatus}. Analysis indicates an optimization potential of ${optimizationPotential}%, representing significant opportunity for emission reduction and operational efficiency improvement. Strategic interventions are recommended to enhance environmental performance and regulatory alignment.`;
}

/**
 * Generates environmental performance section
 * @param {object} baseData
 * @param {object} analysis
 * @returns {string}
 */
function generateEnvironmentalPerformance(baseData, analysis) {
  const carbonIntensity = roundTo(safeNumber(analysis.metrics.carbon_intensity));
  const volatility = roundTo(safeNumber(analysis.metrics.volatility));
  const anomalyRate = roundTo(calculateAnomalyRate(
    safeNumber(baseData.anomaly_count),
    safeNumber(baseData.total_hours)
  ));
  const downtimePercent = roundTo(calculateDowntimePercent(
    safeNumber(baseData.downtime_minutes),
    safeNumber(baseData.total_runtime_minutes)
  ));

  return `Carbon intensity stands at ${carbonIntensity} tons per production unit. Operational volatility is measured at ${volatility}, indicating ${volatility > 50 ? 'unstable' : 'stable'} emission patterns. The facility experienced an anomaly rate of ${anomalyRate}% and downtime of ${downtimePercent}%. ${downtimePercent > 40 ? 'Significant operational inefficiencies require immediate attention.' : 'Operational stability is within acceptable parameters.'} Enhanced monitoring and process optimization can further improve environmental performance.`;
}

/**
 * Generates risk and compliance section
 * @param {object} analysis
 * @returns {string}
 */
function generateRiskAndCompliance(analysis) {
  const complianceStatus = analysis.compliance.compliance_status || "Unknown";
  const breachDays = analysis.compliance.projected_threshold_breach_days;
  const regulatoryWarning = analysis.compliance.regulatory_warning || "No regulatory concerns identified.";

  let breachStatement = "";
  if (breachDays !== null && breachDays > 0) {
    breachStatement = ` Projected threshold breach is estimated in ${breachDays} days if current trends continue.`;
  }

  return `Compliance Status: ${complianceStatus}. ${regulatoryWarning}${breachStatement} Proactive regulatory engagement and emission control strategies are essential to maintain compliance and avoid potential penalties. Continuous monitoring of emission trends is recommended to ensure alignment with environmental regulations.`;
}

/**
 * Generates optimization strategy section
 * @param {object} analysis
 * @returns {string}
 */
function generateOptimizationStrategy(analysis) {
  const recommendations = analysis.recommendations.recommendations || [];
  const optimizationPotential = roundTo(safeNumber(analysis.optimization.optimization_potential_percent));
  const sustainabilityBoost = roundTo(safeNumber(analysis.optimization.sustainability_score_boost));

  let topRecommendation = "Maintain current operational practices";
  if (recommendations.length > 0) {
    topRecommendation = recommendations[0].title || topRecommendation;
  }

  return `Primary recommendation: ${topRecommendation}. The facility demonstrates an optimization potential of ${optimizationPotential}%, which can deliver a sustainability score improvement of ${sustainabilityBoost} points. Implementation of targeted efficiency measures, process stabilization, and technology upgrades will drive measurable emission reductions. Strategic investment in optimization initiatives is projected to yield significant environmental and operational benefits.`;
}

/**
 * Generates financial impact summary section
 * @param {object} analysis
 * @returns {string}
 */
function generateFinancialImpactSummary(analysis) {
  const carbonCredits = roundTo(safeNumber(analysis.financial_impact.carbon_credits_generated));
  const creditValueMin = roundTo(safeNumber(analysis.financial_impact.estimated_credit_value_min));
  const creditValueMax = roundTo(safeNumber(analysis.financial_impact.estimated_credit_value_max));
  const roiPercent = roundTo(safeNumber(analysis.financial_impact.roi_percent));

  return `Projected carbon credit generation: ${carbonCredits} credits, valued between ₹${creditValueMin} and ₹${creditValueMax}. Estimated return on investment for optimization initiatives is ${roiPercent}%. ${roiPercent > 0 ? 'Financial analysis supports strategic investment in emission reduction programs.' : 'Further evaluation of cost-benefit scenarios is recommended.'} Carbon credit monetization and compliance penalty avoidance present substantial financial upside for the organization.`;
}

/**
 * Generates forward outlook section
 * @param {object} baseData
 * @param {object} analysis
 * @returns {string}
 */
function generateForwardOutlook(baseData, analysis) {
  const predictedEmission = roundTo(safeNumber(baseData.predicted_next_month_emission_tons));
  const growthRate = roundTo(safeNumber(analysis.metrics.growth_rate));

  const trend = growthRate > 0 ? "increasing" : growthRate < 0 ? "decreasing" : "stable";
  const outlook = growthRate > 10 ? "Immediate intervention is critical to reverse emission trajectory." : 
                  growthRate > 0 ? "Proactive measures are recommended to stabilize emission trends." :
                  "Current trajectory supports sustainability objectives.";

  return `Forecasted emissions for the next period: ${predictedEmission} tons, representing a ${trend} trend with a growth rate of ${growthRate}%. ${outlook} Continued focus on operational excellence, technology adoption, and strategic emission management will position the facility for long-term environmental leadership and regulatory resilience.`;
}

/**
 * Calculates overall ESG rating
 * @param {object} analysis
 * @returns {string}
 */
function calculateOverallESGRating(analysis) {
  const riskScore = safeNumber(analysis.metrics.carbon_risk_score);
  const complianceStatus = analysis.compliance.compliance_status || "Unknown";
  const optimizationPotential = safeNumber(analysis.optimization.optimization_potential_percent);

  let score = 0;

  if (riskScore <= 40) {
    score += 40;
  } else if (riskScore <= 70) {
    score += 20;
  } else {
    score += 0;
  }

  if (complianceStatus === "Compliant") {
    score += 40;
  } else if (complianceStatus === "Warning") {
    score += 20;
  } else {
    score += 0;
  }

  if (optimizationPotential <= 15) {
    score += 20;
  } else if (optimizationPotential <= 25) {
    score += 10;
  } else {
    score += 0;
  }

  if (score >= 70) return "A";
  if (score >= 40) return "B";
  return "C";
}

/**
 * Generates comprehensive ESG report
 * @param {object} baseData
 * @param {object} analysis
 * @returns {object}
 */
function generateESGReport(baseData, analysis) {
  const overallRating = calculateOverallESGRating(analysis);

  return {
    report_generated_at: new Date().toISOString(),
    overall_esg_rating: overallRating,
    executive_summary: generateExecutiveSummary(baseData, analysis),
    environmental_performance: generateEnvironmentalPerformance(baseData, analysis),
    risk_and_compliance: generateRiskAndCompliance(analysis),
    optimization_strategy: generateOptimizationStrategy(analysis),
    financial_impact_summary: generateFinancialImpactSummary(analysis),
    forward_outlook: generateForwardOutlook(baseData, analysis)
  };
}

module.exports = {
  generateESGReport
};
