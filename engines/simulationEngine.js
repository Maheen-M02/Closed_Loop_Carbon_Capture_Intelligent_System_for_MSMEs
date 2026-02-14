/**
 * What-If Simulation Engine
 * Production-ready module for carbon emission scenario analysis
 */

const { calculateCarbonMetrics } = require('./carbonIntelligenceEngine');
const { calculateCarbonCredits } = require('./carbonCreditCalculator');

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
function clamp(value, min = 0, max = Infinity) {
  if (typeof value !== "number" || isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates percentage change between two values
 * @param {number} original - Original value
 * @param {number} adjusted - Adjusted value
 * @returns {number} Percentage change
 */
function calculateEmissionChangePercent(original, adjusted) {
  const orig = safeNumber(original);
  const adj = safeNumber(adjusted);
  
  if (orig === 0) return adj > 0 ? 100 : 0;
  
  return ((adj - orig) / orig) * 100;
}

/**
 * Applies adjustment factor to a value
 * @param {number} baseValue - Base value to adjust
 * @param {number} energyPercent - Energy change percentage
 * @param {number} loadPercent - Load change percentage
 * @param {number} runtimePercent - Runtime change percentage
 * @returns {number} Adjusted value
 */
function applyAdjustments(baseValue, energyPercent, loadPercent, runtimePercent) {
  const base = safeNumber(baseValue);
  const energy = safeNumber(energyPercent);
  const load = safeNumber(loadPercent);
  const runtime = safeNumber(runtimePercent);
  
  const energyFactor = 1 + (energy / 100);
  const loadFactor = 1 + (load / 100);
  const runtimeFactor = 1 + (runtime / 100);
  
  const adjusted = base * energyFactor * loadFactor * runtimeFactor;
  
  return clamp(adjusted, 0);
}

/**
 * Adjusts hourly emissions array
 * @param {number[]} hourlyEmissions - Original hourly emissions
 * @param {number} energyPercent - Energy change percentage
 * @param {number} loadPercent - Load change percentage
 * @param {number} runtimePercent - Runtime change percentage
 * @returns {number[]} Adjusted hourly emissions
 */
function adjustHourlyEmissions(hourlyEmissions, energyPercent, loadPercent, runtimePercent) {
  if (!Array.isArray(hourlyEmissions)) return [];
  
  return hourlyEmissions.map(emission => {
    const adjusted = applyAdjustments(emission, energyPercent, loadPercent, runtimePercent);
    return Math.round(adjusted * 100) / 100;
  });
}

/**
 * Simulates what-if scenario for carbon emissions
 * @param {object} baseData - Base emission data
 * @param {object} adjustments - Adjustment parameters
 * @returns {object} Simulation results with metrics and credits
 */
function simulateWhatIfScenario(baseData, adjustments) {
  const energyChange = safeNumber(adjustments?.energy_change_percent);
  const loadChange = safeNumber(adjustments?.load_change_percent);
  const runtimeChange = safeNumber(adjustments?.runtime_change_percent);

  const adjustedTotalEmission = applyAdjustments(
    baseData.total_emission_tons,
    energyChange,
    loadChange,
    runtimeChange
  );

  const adjustedPeakEmission = applyAdjustments(
    baseData.peak_emission_tons,
    energyChange,
    loadChange,
    runtimeChange
  );

  const adjustedHourlyEmissions = adjustHourlyEmissions(
    baseData.hourly_emissions_array,
    energyChange,
    loadChange,
    runtimeChange
  );

  const adjustedPredictedNextEmission = applyAdjustments(
    baseData.predicted_next_month_emission_tons || 0,
    energyChange,
    loadChange,
    runtimeChange
  );

  const adjustedData = {
    total_emission_tons: Math.round(adjustedTotalEmission * 100) / 100,
    total_production_units: safeNumber(baseData.total_production_units),
    peak_emission_tons: Math.round(adjustedPeakEmission * 100) / 100,
    previous_month_emission_tons: safeNumber(baseData.previous_month_emission_tons),
    predicted_next_month_emission_tons: Math.round(adjustedPredictedNextEmission * 100) / 100,
    hourly_emissions_array: adjustedHourlyEmissions,
    anomaly_count: safeNumber(baseData.anomaly_count),
    total_hours: safeNumber(baseData.total_hours),
    downtime_minutes: safeNumber(baseData.downtime_minutes),
    total_runtime_minutes: safeNumber(baseData.total_runtime_minutes),
    industry_benchmark_intensity: safeNumber(baseData.industry_benchmark_intensity)
  };

  const metrics = calculateCarbonMetrics(adjustedData);

  const credits = calculateCarbonCredits(
    baseData.previous_month_emission_tons,
    adjustedData.total_emission_tons
  );

  const emissionChangePercent = calculateEmissionChangePercent(
    baseData.total_emission_tons,
    adjustedData.total_emission_tons
  );

  return {
    adjusted_emission: adjustedData.total_emission_tons,
    emission_change_percent: Math.round(emissionChangePercent * 100) / 100,
    metrics: metrics,
    credits: credits
  };
}

module.exports = {
  simulateWhatIfScenario,
  calculateEmissionChangePercent
};
