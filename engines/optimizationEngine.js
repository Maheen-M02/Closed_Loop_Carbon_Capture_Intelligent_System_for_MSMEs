/**
 * Optimization Engine
 * Calculates maximum achievable emission reduction potential
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
  const totalMinutes = downtimeMinutes + totalRuntimeMinutes;
  if (totalMinutes === 0) return 0;
  const percent = (downtimeMinutes / totalMinutes) * 100;
  return clamp(percent, 0, 100);
}

/**
 * Calculates intensity gap above benchmark
 * @param {number} carbonIntensity
 * @param {number} benchmark
 * @returns {number}
 */
function calculateIntensityGap(carbonIntensity, benchmark) {
  const gap = carbonIntensity - benchmark;
  return Math.max(0, gap);
}

/**
 * Categorizes optimization potential
 * @param {number} potential
 * @returns {string}
 */
function categorizeOptimizationPotential(potential) {
  if (potential > 20) return "High";
  if (potential >= 10) return "Medium";
  return "Low";
}

/**
 * Determines investment priority based on category
 * @param {string} category
 * @returns {string}
 */
function determineInvestmentPriority(category) {
  if (category === "High") return "Immediate Strategic Investment";
  if (category === "Medium") return "Planned Optimization";
  return "Performance Monitoring";
}

/**
 * Calculates optimization potential and improvement metrics
 * @param {object} baseData
 * @param {object} metrics
 * @returns {object}
 */
function calculateOptimizationPotential(baseData, metrics) {
  const volatility = safeNumber(metrics.volatility);
  const peakPercent = safeNumber(metrics.peak_percent);
  const carbonIntensity = safeNumber(metrics.carbon_intensity);
  const carbonRiskScore = safeNumber(metrics.carbon_risk_score);
  
  const anomalyCount = safeNumber(baseData.anomaly_count);
  const totalHours = safeNumber(baseData.total_hours);
  const downtimeMinutes = safeNumber(baseData.downtime_minutes);
  const totalRuntimeMinutes = safeNumber(baseData.total_runtime_minutes);
  const benchmark = safeNumber(baseData.industry_benchmark_intensity);

  const anomalyRate = calculateAnomalyRate(anomalyCount, totalHours);
  const downtimePercent = calculateDowntimePercent(downtimeMinutes, totalRuntimeMinutes);
  const intensityGap = calculateIntensityGap(carbonIntensity, benchmark);
  const cappedIntensityGap = clamp(intensityGap, 0, 3);

  const potential = 
    (volatility * 0.15) +
    (peakPercent * 0.15) +
    (anomalyRate * 0.20) +
    (downtimePercent * 0.10) +
    (cappedIntensityGap * 5) +
    (carbonRiskScore * 0.15);

  const optimizationPotentialPercent = clamp(potential, 0, 35);
  const improvementCategory = categorizeOptimizationPotential(optimizationPotentialPercent);
  const investmentPriority = determineInvestmentPriority(improvementCategory);
  const sustainabilityScoreBoost = clamp(optimizationPotentialPercent * 1.2, 0, 40);

  return {
    optimization_potential_percent: Math.round(optimizationPotentialPercent * 100) / 100,
    improvement_category: improvementCategory,
    investment_priority: investmentPriority,
    sustainability_score_boost: Math.round(sustainabilityScoreBoost * 100) / 100
  };
}

module.exports = {
  calculateOptimizationPotential
};
