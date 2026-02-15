/**
 * Blockchain Verification Engine
 * Simulated immutable ledger for carbon credit verification
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const LEDGER_PATH = path.join(__dirname, '../data/carbonLedger.json');

/**
 * Gets next certificate counter from ledger
 * @returns {number} Next certificate number
 */
function getNextCertificateNumber() {
  const ledger = readLedger();
  return ledger.length + 1;
}

/**
 * Generates SHA256 hash of data
 * @param {object} data - Data to hash
 * @returns {string} Hex hash
 */
function generateHash(data) {
  const jsonString = JSON.stringify(data);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

/**
 * Reads ledger from file
 * @returns {Array} Ledger blocks
 */
function readLedger() {
  try {
    if (!fs.existsSync(LEDGER_PATH)) {
      return [];
    }
    const data = fs.readFileSync(LEDGER_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

/**
 * Writes ledger to file
 * @param {Array} ledger - Ledger blocks
 */
function writeLedger(ledger) {
  const dir = path.dirname(LEDGER_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf8');
}

/**
 * Generates carbon credit certificate
 * @param {object} baseData - Base emission data
 * @param {object} credits - Carbon credits data
 * @returns {object} Certificate and blockchain verification
 */
function generateCreditCertificate(baseData, credits) {
  const currentYear = new Date().getFullYear();
  const certificateNumber = getNextCertificateNumber();
  const certificateId = `CC-${currentYear}-${String(certificateNumber).padStart(4, '0')}`;

  const facilityId = baseData.facility_id || 'DEMO-FACILITY';
  const carbonCredits = credits.carbon_credits_generated || credits.carbon_credits || 0;
  const emissionReduction = credits.emission_reduction_tons || credits.reduction || 0;
  const totalEmissions = credits.total_emission || baseData.total_emission_tons || 0;
  const baselineEmissions = credits.baseline_emission || baseData.previous_month_emission_tons || 0;
  const generatedAt = new Date().toISOString();

  const certificate = {
    certificate_id: certificateId,
    facility_id: facilityId,
    carbon_credits: carbonCredits,
    emission_reduction_tons: emissionReduction,
    total_emissions_tons: totalEmissions,
    baseline_emissions_tons: baselineEmissions,
    generated_at: generatedAt
  };

  const certificateHash = generateHash(certificate);

  const ledger = readLedger();
  const blockId = ledger.length + 1;
  const previousHash = ledger.length > 0 
    ? ledger[ledger.length - 1].certificate_hash 
    : 'GENESIS';

  const block = {
    block_id: blockId,
    previous_hash: previousHash,
    certificate_hash: certificateHash,
    timestamp: generatedAt
  };

  ledger.push(block);
  writeLedger(ledger);

  return {
    certificate,
    blockchain_verification: {
      block_id: blockId,
      certificate_hash: certificateHash,
      block_timestamp: generatedAt,
      verification_status: 'Recorded on CarbonChain Ledger'
    }
  };
}

/**
 * Verifies certificate integrity
 * @param {object} certificate - Certificate to verify
 * @returns {object} Verification result
 */
function verifyCertificate(certificate) {
  const certificateHash = generateHash(certificate);
  const ledger = readLedger();

  const blockExists = ledger.some(block => block.certificate_hash === certificateHash);

  if (blockExists) {
    return {
      is_valid: true,
      message: 'Certificate verified on CarbonChain Ledger',
      certificate_hash: certificateHash
    };
  }

  return {
    is_valid: false,
    message: 'Certificate not found in CarbonChain Ledger',
    certificate_hash: certificateHash
  };
}

/**
 * Gets ledger statistics
 * @returns {object} Ledger stats
 */
function getLedgerStats() {
  const ledger = readLedger();
  return {
    total_blocks: ledger.length,
    latest_block: ledger.length > 0 ? ledger[ledger.length - 1] : null
  };
}

module.exports = {
  generateCreditCertificate,
  verifyCertificate,
  getLedgerStats
};
