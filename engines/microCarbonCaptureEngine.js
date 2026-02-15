/**
 * Micro Carbon Capture Engine
 * Evaluates and recommends carbon capture strategies
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
 * Classifies emission scale
 * @param {number} totalEmission
 * @returns {string}
 */
function classifyEmissionScale(totalEmission) {
  if (totalEmission < 50) return "Small";
  if (totalEmission <= 200) return "Medium";
  return "Large";
}

/**
 * Calculates suitability score for carbon capture
 * @param {object} baseData
 * @param {object} metrics
 * @returns {number}
 */
function calculateSuitabilityScore(baseData, metrics) {
  const carbonRiskScore = safeNumber(metrics.carbon_risk_score);
  const peakPercent = safeNumber(metrics.peak_percent);
  const volatility = safeNumber(metrics.volatility);
  const carbonIntensity = safeNumber(metrics.carbon_intensity);
  const benchmark = safeNumber(baseData.industry_benchmark_intensity);
  
  const anomalyRate = calculateAnomalyRate(
    safeNumber(baseData.anomaly_count),
    safeNumber(baseData.total_hours)
  );

  const intensityGap = Math.max(0, carbonIntensity - benchmark);

  const score = 
    (carbonRiskScore * 0.30) +
    (peakPercent * 0.20) +
    (volatility * 0.15) +
    (anomalyRate * 0.15) +
    (intensityGap * 20);

  return clamp(score, 0, 100);
}

/**
 * Selects optimal capture strategy
 * @param {string} emissionScale
 * @param {number} carbonRiskScore
 * @param {number} volatility
 * @returns {string}
 */
function selectCaptureStrategy(emissionScale, carbonRiskScore, volatility) {
  if (carbonRiskScore > 80 && volatility > 50) {
    return "Carbon-to-Synthetic Fuel Pilot System";
  }

  if (emissionScale === "Small") {
    return "CO₂ Mineralization for Construction Blocks";
  }

  if (emissionScale === "Medium") {
    return "Modular Flue Gas Capture Units";
  }

  return "On-Site CO₂ Liquefaction & Storage";
}

/**
 * Determines implementation complexity
 * @param {string} strategyType
 * @returns {string}
 */
function determineImplementationComplexity(strategyType) {
  if (strategyType === "CO₂ Mineralization for Construction Blocks") {
    return "Low";
  }

  if (strategyType === "Modular Flue Gas Capture Units") {
    return "Medium";
  }

  if (strategyType === "On-Site CO₂ Liquefaction & Storage") {
    return "High";
  }

  if (strategyType === "Carbon-to-Synthetic Fuel Pilot System") {
    return "Very High";
  }

  return "Medium";
}

/**
 * Estimates ROI boost category
 * @param {number} suitabilityScore
 * @returns {string}
 */
function estimateROIBoost(suitabilityScore) {
  if (suitabilityScore > 70) return "High";
  if (suitabilityScore >= 40) return "Medium";
  return "Low";
}

/**
 * Calculates estimated capture potential
 * @param {number} totalEmission
 * @param {number} suitabilityScore
 * @returns {number}
 */
function calculateEstimatedCapture(totalEmission, suitabilityScore) {
  const capturePotential = totalEmission * (suitabilityScore / 100) * 0.25;
  const maxCapture = totalEmission * 0.40;
  return Math.min(capturePotential, maxCapture);
}

/**
 * Evaluates micro carbon capture strategy
 * @param {object} baseData
 * @param {object} metrics
 * @returns {object}
 */
function evaluateMicroCarbonCapture(baseData, metrics) {
  const totalEmission = safeNumber(baseData.total_emission_tons);
  const carbonRiskScore = safeNumber(metrics.carbon_risk_score);
  const volatility = safeNumber(metrics.volatility);

  const emissionScale = classifyEmissionScale(totalEmission);
  const suitabilityScore = calculateSuitabilityScore(baseData, metrics);
  const captureStrategyType = selectCaptureStrategy(emissionScale, carbonRiskScore, volatility);
  const estimatedCaptureTons = calculateEstimatedCapture(totalEmission, suitabilityScore);
  const implementationComplexity = determineImplementationComplexity(captureStrategyType);
  const expectedROIBoost = estimateROIBoost(suitabilityScore);

  return {
    emission_scale: emissionScale,
    capture_strategy_type: captureStrategyType,
    suitability_score: roundTo(suitabilityScore),
    estimated_capture_tons: roundTo(estimatedCaptureTons),
    implementation_complexity: implementationComplexity,
    expected_roi_boost: expectedROIBoost
  };
}

module.exports = {
  evaluateMicroCarbonCapture
};
