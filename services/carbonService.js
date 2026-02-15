const { calculateCarbonMetrics } = require('../engines/carbonIntelligenceEngine');
const { calculateCarbonCredits } = require('../engines/carbonCreditCalculator');
const { simulateWhatIfScenario } = require('../engines/simulationEngine');
const { generateRecommendations } = require('../engines/recommendationEngine');
const { generateExplainability } = require('../engines/explainabilityEngine');
const { evaluateCompliance } = require('../engines/complianceEngine');
const { calculateOptimizationPotential } = require('../engines/optimizationEngine');
const { calculateFinancialImpact } = require('../engines/roiEngine');
const { generateESGReport } = require('../engines/esgReportEngine');
const { evaluateMicroCarbonCapture } = require('../engines/microCarbonCaptureEngine');
const { generateCreditCertificate } = require('../engines/blockchainVerificationEngine');

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

  const blockchainVerification = generateCreditCertificate(safeData, credits);

  const recommendations = generateRecommendations(safeData, metrics);

  const explainability = generateExplainability(safeData, metrics, recommendations);

  const compliance = evaluateCompliance(safeData, metrics);

  const optimization = calculateOptimizationPotential(safeData, metrics);

  const financialImpact = calculateFinancialImpact(safeData, metrics, optimization);

  const microCapture = evaluateMicroCarbonCapture(safeData, metrics);

  const esgReport = generateESGReport(safeData, {
    metrics,
    recommendations,
    compliance,
    optimization,
    financial_impact: financialImpact,
    explainability,
    micro_capture: microCapture
  });

  return {
    emissions: safeData.total_emission_tons,
    metrics,
    credits,
    blockchain_verification: blockchainVerification,
    recommendations,
    explainability,
    compliance,
    optimization,
    financial_impact: financialImpact,
    micro_capture: microCapture,
    esg_report: esgReport
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
