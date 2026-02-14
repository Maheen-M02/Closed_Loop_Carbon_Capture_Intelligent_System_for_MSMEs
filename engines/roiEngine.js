/**
 * ROI Engine
 * Financial impact and return on investment calculations
 */

const CARBON_CREDIT_PRICE_MIN = 700;
const CARBON_CREDIT_PRICE_MAX = 2000;
const COMPLIANCE_PENALTY_PER_TON = 3000;
const ESTIMATED_IMPLEMENTATION_COST = 500000;
const REGULATORY_THRESHOLD = 70;

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
 * Calculates potential emission reduction in tons
 * @param {number} totalEmission
 * @param {number} optimizationPercent
 * @returns {number}
 */
function calculatePotentialReduction(totalEmission, optimizationPercent) {
  const reduction = (totalEmission * optimizationPercent) / 100;
  return Math.max(0, reduction);
}

/**
 * Calculates avoided compliance penalty
 * @param {number} predictedEmission
 * @returns {number}
 */
function calculateAvoidedPenalty(predictedEmission) {
  if (predictedEmission <= REGULATORY_THRESHOLD) return 0;
  
  const excess = predictedEmission - REGULATORY_THRESHOLD;
  return excess * COMPLIANCE_PENALTY_PER_TON;
}

/**
 * Calculates ROI percentage
 * @param {number} averageBenefit
 * @param {number} implementationCost
 * @returns {number}
 */
function calculateROI(averageBenefit, implementationCost) {
  if (implementationCost === 0) return 0;
  
  const roi = ((averageBenefit - implementationCost) / implementationCost) * 100;
  return clamp(roi, -100, 500);
}

/**
 * Calculates financial impact and ROI projections
 * @param {object} baseData
 * @param {object} metrics
 * @param {object} optimization
 * @returns {object}
 */
function calculateFinancialImpact(baseData, metrics, optimization) {
  const totalEmission = safeNumber(baseData.total_emission_tons);
  const predictedEmission = safeNumber(baseData.predicted_next_month_emission_tons);
  const optimizationPercent = safeNumber(optimization.optimization_potential_percent);

  const potentialReductionTons = calculatePotentialReduction(totalEmission, optimizationPercent);
  const carbonCreditsGenerated = potentialReductionTons;

  const estimatedCreditValueMin = carbonCreditsGenerated * CARBON_CREDIT_PRICE_MIN;
  const estimatedCreditValueMax = carbonCreditsGenerated * CARBON_CREDIT_PRICE_MAX;

  const avoidedCompliancePenalty = calculateAvoidedPenalty(predictedEmission);

  const totalFinancialBenefitMin = estimatedCreditValueMin + avoidedCompliancePenalty;
  const totalFinancialBenefitMax = estimatedCreditValueMax + avoidedCompliancePenalty;

  const averageBenefit = (totalFinancialBenefitMin + totalFinancialBenefitMax) / 2;
  const roiPercent = calculateROI(averageBenefit, ESTIMATED_IMPLEMENTATION_COST);

  return {
    potential_reduction_tons: roundTo(potentialReductionTons),
    carbon_credits_generated: roundTo(carbonCreditsGenerated),
    estimated_credit_value_min: roundTo(estimatedCreditValueMin),
    estimated_credit_value_max: roundTo(estimatedCreditValueMax),
    avoided_compliance_penalty: roundTo(avoidedCompliancePenalty),
    total_financial_benefit_min: roundTo(totalFinancialBenefitMin),
    total_financial_benefit_max: roundTo(totalFinancialBenefitMax),
    roi_percent: roundTo(roiPercent)
  };
}

module.exports = {
  calculateFinancialImpact
};
