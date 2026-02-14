/**
 * Carbon Credit Calculator
 * Production-ready module for carbon credit calculations
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
function clamp(value, min = 0, max = Infinity) {
  if (typeof value !== "number" || isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates carbon credits based on emission reduction
 * @param {number} baseline - Baseline emissions in tons
 * @param {number} currentEmission - Current total emissions in tons
 * @param {number} pricePerCreditMin - Minimum price per credit (default: 700)
 * @param {number} pricePerCreditMax - Maximum price per credit (default: 2000)
 * @returns {object} Carbon credit calculation results
 */
function calculateCarbonCredits(
  baseline,
  currentEmission,
  pricePerCreditMin = 700,
  pricePerCreditMax = 2000
) {
  const baselineEmission = safeNumber(baseline);
  const emission = safeNumber(currentEmission);
  const minPrice = safeNumber(pricePerCreditMin);
  const maxPrice = safeNumber(pricePerCreditMax);

  const finalMinPrice = Math.min(minPrice, maxPrice);
  const finalMaxPrice = Math.max(minPrice, maxPrice);

  const reduction = clamp(baselineEmission - emission, 0);
  const carbonCredits = reduction;

  const estimatedValueMin = carbonCredits * finalMinPrice;
  const estimatedValueMax = carbonCredits * finalMaxPrice;

  return {
    total_emission: Math.round(emission * 100) / 100,
    baseline_emission: Math.round(baselineEmission * 100) / 100,
    reduction: Math.round(reduction * 100) / 100,
    carbon_credits: Math.round(carbonCredits * 100) / 100,
    estimated_value_min: Math.round(estimatedValueMin * 100) / 100,
    estimated_value_max: Math.round(estimatedValueMax * 100) / 100
  };
}

module.exports = {
  calculateCarbonCredits
};
