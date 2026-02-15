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
 * Formats number with Indian locale
 * @param {number} value
 * @returns {string}
 */
function formatIndianNumber(value) {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

/**
 * Formats carbon intensity with appropriate precision
 * @param {number} intensity
 * @returns {string}
 */
function formatCarbonIntensity(intensity) {
  if (intensity < 0.01) {
    return roundTo(intensity, 4).toString();
  }
  return roundTo(intensity, 2).toString();
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
  const totalMinutes = downtimeMinutes + totalRuntimeMinutes;
  if (totalMinutes === 0) return 0;
  const percent = (downtimeMinutes / totalMinutes) * 100;
  return Math.min(percent, 100);
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

  let opportunityPhrase = "significant opportunity";
  if (optimizationPotential > 20) {
    opportunityPhrase = "significant opportunity";
  } else if (optimizationPotential >= 10) {
    opportunityPhrase = "moderate opportunity";
  } else {
    opportunityPhrase = "limited optimization opportunity";
  }

  return `The facility recorded total emissions of ${totalEmission} tons with a carbon risk score of ${riskScore}. Current compliance status is ${complianceStatus}. Analysis indicates an optimization potential of ${optimizationPotential}%, representing ${opportunityPhrase} for emission reduction and operational efficiency improvement. Strategic interventions are recommended to enhance environmental performance and regulatory alignment.`;
}

/**
 * Generates environmental performance section
 * @param {object} baseData
 * @param {object} analysis
 * @returns {string}
 */
function generateEnvironmentalPerformance(baseData, analysis) {
  const carbonIntensity = formatCarbonIntensity(safeNumber(analysis.metrics.carbon_intensity));
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
  const creditValueMin = safeNumber(analysis.financial_impact.estimated_credit_value_min);
  const creditValueMax = safeNumber(analysis.financial_impact.estimated_credit_value_max);
  const roiPercent = roundTo(safeNumber(analysis.financial_impact.roi_percent));

  let financialOutlook = "";
  if (roiPercent > 0) {
    financialOutlook = "Financial analysis supports strategic investment in emission reduction programs.";
  } else if (roiPercent >= -20) {
    financialOutlook = "Marginal financial viability; further evaluation of cost-benefit scenarios is recommended.";
  } else {
    financialOutlook = "Strategic investment required; financial returns may be long-term.";
  }

  return `Projected carbon credit generation: ${carbonCredits} credits, valued between INR ${formatIndianNumber(creditValueMin)} and INR ${formatIndianNumber(creditValueMax)}. Estimated return on investment for optimization initiatives is ${roiPercent}%. ${financialOutlook} Carbon credit monetization and compliance penalty avoidance present opportunities for the organization.`;
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
 * Generates micro carbon capture strategy section
 * @param {object} analysis
 * @returns {string}
 */
function generateMicroCarbonCaptureSection(analysis) {
  const microCapture = analysis.micro_capture || {};
  
  const emissionScale = microCapture.emission_scale || "Unknown";
  const strategyType = microCapture.capture_strategy_type || "Not determined";
  const suitabilityScore = roundTo(safeNumber(microCapture.suitability_score));
  const estimatedCapture = roundTo(safeNumber(microCapture.estimated_capture_tons));
  const complexity = microCapture.implementation_complexity || "Unknown";
  const roiBoost = microCapture.expected_roi_boost || "Unknown";

  let suitabilityPhrase = "limited";
  if (suitabilityScore > 70) {
    suitabilityPhrase = "high";
  } else if (suitabilityScore >= 40) {
    suitabilityPhrase = "moderate";
  }

  return `Emission Scale Classification: ${emissionScale}. Recommended carbon capture strategy: ${strategyType}. Strategic suitability assessment indicates a score of ${suitabilityScore}, reflecting ${suitabilityPhrase} alignment with facility operational profile. Estimated capture potential: ${estimatedCapture} tons, representing opportunity for direct emission reduction and carbon utilization. Implementation complexity is assessed as ${complexity}, with expected ROI boost categorized as ${roiBoost}. Deployment of micro carbon capture technology will enhance environmental performance, support regulatory compliance, and create value through carbon credit generation and circular economy integration.`;
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
    micro_carbon_capture_strategy: generateMicroCarbonCaptureSection(analysis),
    forward_outlook: generateForwardOutlook(baseData, analysis)
  };
}

module.exports = {
  generateESGReport
};
