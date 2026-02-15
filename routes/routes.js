/**
 * API Routes
 * Carbon analytics endpoints
 */

const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/carbonController');

router.get('/health', carbonController.healthController);
router.post('/analyze', carbonController.analyzeController);
router.post('/simulate', carbonController.simulateController);
router.get('/demo-analysis', carbonController.demoAnalysisController);
router.get('/esg-report/pdf', carbonController.esgPdfController);
router.get('/blockchain-certificate/pdf', carbonController.blockchainCertificateController);

module.exports = router;
