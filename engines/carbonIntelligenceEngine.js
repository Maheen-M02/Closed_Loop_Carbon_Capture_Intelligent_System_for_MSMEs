/**
 * Carbon Intelligence Engine
 * Production-ready module for advanced carbon risk analytics
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
  if (typeof value !== "number" || isNaN(value)) return 0;
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
 * Calculates mean of an array
 * @param {number[]} values - Array of numbers
 * @returns {number} Mean value
 */
function calculateMean(values) {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculates standard deviation of an array
 * @param {number[]} values - Array of numbers
 * @param {number} mean - Pre-calculated mean
 * @returns {number} Standard deviation
 */
function calculateStandardDeviation(values, mean) {
  if (!values || values.length === 0) return 0;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculates carbon intensity risk score
 * @param {number} intensity - Carbon intensity value
 * @param {number} benchmark - Industry benchmark intensity
 * @returns {number} Risk score (0-100)
 */
function calculateIntensityRisk(intensity, benchmark) {
  if (benchmark === 0) return 100;
  const risk = (intensity / benchmark) * 100;
  return clamp(risk);
}

/**
 * Calculates emission growth risk score
 * @param {number} predicted - Predicted next month emissions
 * @param {number} previous - Previous month emissions
 * @returns {number} Risk score (0-100)
 */
function calculateGrowthRisk(predicted, previous) {
  if (previous === 0) {
    return predicted > 0 ? 100 : 0;
  }
  
  const growthRate = ((predicted - previous) / previous) * 100;
  
  if (growthRate <= 0) return 0;
  if (growthRate >= 20) return 100;
  
  return clamp((growthRate / 20) * 100);
}

/**
 * Calculates peak dependency risk score
 * @param {number} peakPercent - Peak emission percentage
 * @returns {number} Risk score (0-100)
 */
function calculatePeakRisk(peakPercent) {
  if (peakPercent >= 70) return 100;
  return clamp((peakPercent / 70) * 100);
}

/**
 * Calculates volatility risk score
 * @param {number[]} hourlyEmissions - Array of hourly emissions
 * @returns {object} Volatility value and risk score
 */
function calculateVolatilityRisk(hourlyEmissions) {
  if (!hourlyEmissions || hourlyEmissions.length === 0) {
    return { volatility: 0, risk: 0 };
  }
  
  const mean = calculateMean(hourlyEmissions);
  if (mean === 0) return { volatility: 0, risk: 0 };
  
  const stdDev = calculateStandardDeviation(hourlyEmissions, mean);
  const volatility = (stdDev / mean) * 100;
  const risk = clamp(volatility);
  
  return { volatility, risk };
}

/**
 * Calculates anomaly and fault composite risk score
 * @param {number} anomalyCount - Number of anomalies detected
 * @param {number} totalHours - Total operational hours
 * @param {number} downtimeMinutes - Total downtime in minutes
 * @param {number} totalRuntimeMinutes - Total runtime in minutes
 * @returns {number} Composite risk score (0-100)
 */
function calculateAnomalyFaultRisk(anomalyCount, totalHours, downtimeMinutes, totalRuntimeMinutes) {
  const anomalyScore = totalHours > 0 ? (anomalyCount / totalHours) * 100 : 0;
  
  const totalMinutes = downtimeMinutes + totalRuntimeMinutes;
  const faultScore = totalMinutes > 0 ? (downtimeMinutes / totalMinutes) * 100 : 0;
  
  const compositeScore = (0.6 * clamp(anomalyScore)) + (0.4 * clamp(faultScore));
  return clamp(compositeScore);
}

/**
 * Main function to calculate comprehensive carbon metrics
 * @param {object} data - Input data object
 * @returns {object} Carbon metrics and risk analysis
 */
function calculateCarbonMetrics(data) {
  const totalEmission = safeNumber(data.total_emission_tons);
  const totalProduction = safeNumber(data.total_production_units);
  const peakEmission = safeNumber(data.peak_emission_tons);
  const previousEmission = safeNumber(data.previous_month_emission_tons);
  const predictedNextEmission = safeNumber(data.predicted_next_month_emission_tons);
  const hourlyEmissions = Array.isArray(data.hourly_emissions_array)
    ? data.hourly_emissions_array.map(safeNumber)
    : [];
  const anomalyCount = safeNumber(data.anomaly_count);
  const totalHours = safeNumber(data.total_hours);
  const downtimeMinutes = safeNumber(data.downtime_minutes);
  const totalRuntimeMinutes = safeNumber(data.total_runtime_minutes);
  const benchmarkIntensity = safeNumber(data.industry_benchmark_intensity);

  const carbonIntensity = totalProduction > 0 
    ? totalEmission / totalProduction 
    : 0;

  let growthRate = 0;
  if (previousEmission === 0) {
    growthRate = predictedNextEmission > 0 ? 100 : 0;
  } else {
    const rawGrowth = ((predictedNextEmission - previousEmission) / previousEmission) * 100;
    growthRate = clamp(rawGrowth, -200, 200);
  }

  const peakPercent = totalEmission > 0
    ? (peakEmission / totalEmission) * 100
    : 0;

  const intensityRisk = calculateIntensityRisk(carbonIntensity, benchmarkIntensity);
  const growthRisk = calculateGrowthRisk(predictedNextEmission, previousEmission);
  const peakRisk = calculatePeakRisk(peakPercent);
  
  const { volatility, risk: volatilityRisk } = calculateVolatilityRisk(hourlyEmissions);
  
  const anomalyFaultRisk = calculateAnomalyFaultRisk(
    anomalyCount,
    totalHours,
    downtimeMinutes,
    totalRuntimeMinutes
  );

  const carbonRiskScore = Math.round(
    (0.30 * intensityRisk) +
    (0.20 * growthRisk) +
    (0.15 * peakRisk) +
    (0.15 * volatilityRisk) +
    (0.20 * anomalyFaultRisk)
  );

  const finalRiskScore = clamp(carbonRiskScore);

  let forecastGrowthPercent = 0;
  if (totalEmission === 0) {
    forecastGrowthPercent = predictedNextEmission > 0 ? 100 : 0;
  } else {
    const rawForecast = ((predictedNextEmission - totalEmission) / totalEmission) * 100;
    forecastGrowthPercent = clamp(rawForecast, -200, 200);
  }

  return {
    carbon_intensity: carbonIntensity < 0.01 ? roundTo(carbonIntensity, 4) : roundTo(carbonIntensity, 2),
    growth_rate: roundTo(growthRate, 2),
    peak_percent: roundTo(peakPercent, 2),
    volatility: roundTo(volatility, 2),
    carbon_risk_score: finalRiskScore,
    risk_level: classifyRisk(finalRiskScore),
    stability_index: 100 - Math.round(volatilityRisk),
    forecast_growth_percent: roundTo(forecastGrowthPercent, 2),
    breakdown: {
      intensity_risk: Math.round(intensityRisk),
      growth_risk: Math.round(growthRisk),
      peak_risk: Math.round(peakRisk),
      volatility_risk: Math.round(volatilityRisk),
      anomaly_fault_risk: Math.round(anomalyFaultRisk)
    }
  };
}

/**
 * Classifies risk level based on score
 * @param {number} score - Risk score (0-100)
 * @returns {string} Risk classification
 */
function classifyRisk(score) {
  if (score <= 30) return "Low";
  if (score <= 70) return "Moderate";
  return "High";
}

module.exports = {
  calculateCarbonMetrics,
  classifyRisk
};
