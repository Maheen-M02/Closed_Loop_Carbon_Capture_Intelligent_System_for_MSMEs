/**
 * Compliance Engine
 * Regulatory compliance risk evaluation for carbon emissions
 */

const MAX_ALLOWED_MONTHLY_EMISSION = 70;

/**
 * Ensures value is a valid number
 * @param {*} val
 * @returns {number}
 */
function safeNumber(val) {
  return typeof val === "number" && !isNaN(val) ? val : 0;
}

/**
 * Determines compliance status based on emissions
 * @param {number} currentEmission
 * @param {number} predictedEmission
 * @param {number} threshold
 * @returns {string}
 */
function determineComplianceStatus(currentEmission, predictedEmission, threshold) {
  if (predictedEmission > threshold) {
    return "At Risk";
  }

  if (currentEmission > threshold * 0.9) {
    return "Warning";
  }

  return "Compliant";
}

/**
 * Calculates projected days until threshold breach
 * @param {number} currentEmission
 * @param {number} predictedEmission
 * @param {number} growthRate
 * @param {number} threshold
 * @returns {number|null}
 */
function calculateProjectedBreachDays(currentEmission, predictedEmission, growthRate, threshold) {
  if (growthRate <= 0 || currentEmission >= threshold) {
    return null;
  }

  const monthlyIncrease = predictedEmission - currentEmission;

  if (monthlyIncrease <= 0) {
    return null;
  }

  const monthsToBreach = (threshold - currentEmission) / monthlyIncrease;
  const daysToBreach = monthsToBreach * 30;

  return Math.max(0, Math.round(daysToBreach));
}

/**
 * Maps compliance status to risk level
 * @param {string} complianceStatus
 * @returns {string}
 */
function mapRiskLevel(complianceStatus) {
  if (complianceStatus === "At Risk") return "High";
  if (complianceStatus === "Warning") return "Medium";
  return "Low";
}

/**
 * Generates regulatory warning message
 * @param {string} complianceStatus
 * @returns {string}
 */
function generateRegulatoryWarning(complianceStatus) {
  if (complianceStatus === "At Risk") {
    return "Projected emissions exceed regulatory threshold. Immediate emission control strategies are required to avoid penalties.";
  }

  if (complianceStatus === "Warning") {
    return "Facility emissions are approaching regulatory limits. Preventive optimization is advised.";
  }

  return "Facility operates within regulatory emission limits.";
}

/**
 * Generates advisory note based on risk level
 * @param {string} riskLevel
 * @returns {string}
 */
function generateAdvisoryNote(riskLevel) {
  if (riskLevel === "High") {
    return "Deploy high-impact reduction strategies and monitor monthly growth closely.";
  }

  if (riskLevel === "Medium") {
    return "Implement targeted efficiency improvements to maintain compliance.";
  }

  return "Continue monitoring emissions and sustain current mitigation strategies.";
}

/**
 * Evaluates regulatory compliance based on emission data
 * @param {object} baseData
 * @param {object} metrics
 * @returns {object}
 */
function evaluateCompliance(baseData, metrics) {
  if (
    baseData.predicted_next_month_emission_tons === undefined ||
    typeof baseData.predicted_next_month_emission_tons !== "number"
  ) {
    return {
      compliance_status: "Insufficient Data",
      risk_level: "Unknown",
      projected_threshold_breach_days: null,
      regulatory_warning: "Forecast data unavailable for compliance evaluation.",
      advisory_note: "Provide emission forecast to enable regulatory risk prediction."
    };
  }

  const currentEmission = safeNumber(baseData.total_emission_tons);
  const predictedEmission = safeNumber(baseData.predicted_next_month_emission_tons);
  const growthRate = safeNumber(metrics.growth_rate);

  const complianceStatus = determineComplianceStatus(
    currentEmission,
    predictedEmission,
    MAX_ALLOWED_MONTHLY_EMISSION
  );

  const riskLevel = mapRiskLevel(complianceStatus);

  const projectedBreachDays = calculateProjectedBreachDays(
    currentEmission,
    predictedEmission,
    growthRate,
    MAX_ALLOWED_MONTHLY_EMISSION
  );

  const regulatoryWarning = generateRegulatoryWarning(complianceStatus);
  const advisoryNote = generateAdvisoryNote(riskLevel);

  return {
    compliance_status: complianceStatus,
    risk_level: riskLevel,
    projected_threshold_breach_days: projectedBreachDays,
    regulatory_warning: regulatoryWarning,
    advisory_note: advisoryNote
  };
}

module.exports = {
  evaluateCompliance
};
