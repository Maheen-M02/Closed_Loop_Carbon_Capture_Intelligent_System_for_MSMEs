const carbonService = require('../services/carbonService');
const demoData = require('../data/demoFactoryData.json');
const { generatePDFReport } = require('../engines/pdfReportEngine');
const { generateBlockchainCertificatePDF } = require('../engines/blockchainCertificatePdfEngine');

async function analyzeController(req, res) {
  try {
    const baseData = req.body;

    if (!baseData || typeof baseData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body'
      });
    }

    if (
      typeof baseData.total_emission_tons !== 'number' ||
      typeof baseData.previous_month_emission_tons !== 'number'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required emission fields'
      });
    }

    const result = carbonService.analyzeFactoryData(baseData);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

async function simulateController(req, res) {
  try {
    const { baseData, adjustments } = req.body;

    if (!baseData || typeof baseData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid baseData'
      });
    }

    if (!adjustments || typeof adjustments !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid adjustments'
      });
    }

    const result = carbonService.simulateFactoryScenario(baseData, adjustments);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Demo analysis using local factory data
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function demoAnalysisController(req, res) {
  try {
    const result = carbonService.analyzeFactoryData(demoData);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Generates and downloads ESG report PDF
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function esgPdfController(req, res) {
  try {
    const analysisResult = carbonService.analyzeFactoryData(demoData);

    const pdfBuffer = await generatePDFReport(demoData, analysisResult);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="carbon-esg-report.pdf"');

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Health check endpoint
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function healthController(req, res) {
  try {
    res.status(200).json({
      status: "Carbon Intelligence API Running",
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.round(process.uptime())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Downloads blockchain certificate PDF
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function blockchainCertificateController(req, res) {
  try {
    const analysisResult = carbonService.analyzeFactoryData(demoData);

    if (!analysisResult.blockchain_verification) {
      return res.status(404).json({
        success: false,
        error: 'No blockchain certificate available'
      });
    }

    const pdfBuffer = await generateBlockchainCertificatePDF(analysisResult.blockchain_verification);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="carbon-credit-certificate.pdf"');

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = {
  analyzeController,
  simulateController,
  demoAnalysisController,
  healthController,
  esgPdfController,
  blockchainCertificateController
};
