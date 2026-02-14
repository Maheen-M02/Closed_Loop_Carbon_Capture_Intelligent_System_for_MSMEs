const { calculateCarbonMetrics } = require('../carbonIntelligenceEngine');
const { calculateCarbonCredits } = require('../carbonCreditCalculator');
const { simulateWhatIfScenario } = require('../simulationEngine');
const { generateRecommendations } = require('../recommendationEngine');
const { generateExplainability } = require('../explainabilityEngine');
const { evaluateCompliance } = require('../complianceEngine');
const { calculateOptimizationPotential } = require('../optimizationEngine');
const { calculateFinancialImpact } = require('../roiEngine');

function analyzeFactoryData(baseData) {
  if (!baseData || typeof baseData !== "object") {
    throw new Error("Invalid baseData input");
  }

  const safeData = { ...baseData };

  const metrics = calculateCarbonMetrics(safeData);

  const credits = calculateCarbonCredits(
    safeData.previous_month_emission_tons,
    safeData.total_emission_tons
  );

  const recommendations = generateRecommendations(safeData, metrics);

  const explainability = generateExplainability(safeData, metrics, recommendations);

  const compliance = evaluateCompliance(safeData, metrics);

  const optimization = calculateOptimizationPotential(safeData, metrics);

  const financialImpact = calculateFinancialImpact(safeData, metrics, optimization);

  return {
    emissions: safeData.total_emission_tons,
    metrics,
    credits,
    recommendations,
    explainability,
    compliance,
    optimization,
    financial_impact: financialImpact
  };
}

function simulateFactoryScenario(baseData, adjustments) {
  if (!baseData || typeof baseData !== "object") {
    throw new Error("Invalid baseData input");
  }

  if (!adjustments || typeof adjustments !== "object") {
    throw new Error("Invalid adjustments input");
  }

  return simulateWhatIfScenario({ ...baseData }, { ...adjustments });
}

module.exports = {
  analyzeFactoryData,
  simulateFactoryScenario
};
