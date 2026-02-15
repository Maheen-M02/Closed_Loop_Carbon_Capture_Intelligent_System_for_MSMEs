/**
 * Blockchain Certificate PDF Generator
 * Generates professional PDF certificates for carbon credits
 */

const PDFDocument = require('pdfkit');

/**
 * Generates blockchain certificate PDF
 * @param {object} certificateData - Certificate and blockchain verification data
 * @returns {Buffer} PDF buffer
 */
function generateBlockchainCertificatePDF(certificateData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      const cert = certificateData.certificate;
      const blockchain = certificateData.blockchain_verification;

      // Header with border
      doc.rect(50, 50, 495, 692).stroke();
      doc.rect(55, 55, 485, 682).stroke();

      // Title
      doc.fontSize(28)
         .font('Helvetica-Bold')
         .fillColor('#0F2A1D')
         .text('CARBON CREDIT CERTIFICATE', 70, 100, { align: 'center' });

      // Subtitle
      doc.fontSize(14)
         .font('Helvetica')
         .fillColor('#7CFFB2')
         .text('Blockchain Verified', 70, 140, { align: 'center' });

      // Certificate ID Box
      doc.rect(150, 180, 295, 50)
         .fillAndStroke('#EAF5EE', '#7CFFB2');
      
      doc.fontSize(12)
         .fillColor('#0F2A1D')
         .font('Helvetica')
         .text('Certificate ID', 160, 190);
      
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text(cert.certificate_id, 160, 210);

      // Certificate Details
      const detailsY = 260;
      doc.fontSize(12).font('Helvetica');

      // Facility ID
      doc.fillColor('#0F2A1D')
         .text('Facility ID:', 100, detailsY);
      doc.font('Helvetica-Bold')
         .text(cert.facility_id, 250, detailsY);

      // Total Emissions
      doc.font('Helvetica')
         .text('Total Emissions:', 100, detailsY + 30);
      doc.font('Helvetica-Bold')
         .fillColor('#0F2A1D')
         .text(`${cert.total_emissions_tons.toFixed(2)} tons CO2`, 250, detailsY + 30);

      // Baseline Emissions
      doc.font('Helvetica')
         .text('Baseline Emissions:', 100, detailsY + 60);
      doc.font('Helvetica-Bold')
         .text(`${cert.baseline_emissions_tons.toFixed(2)} tons CO2`, 250, detailsY + 60);

      // Emission Reduction
      doc.font('Helvetica')
         .text('Emission Reduction:', 100, detailsY + 90);
      doc.font('Helvetica-Bold')
         .fillColor(cert.emission_reduction_tons > 0 ? '#7CFFB2' : '#FF6B6B')
         .text(`${cert.emission_reduction_tons.toFixed(2)} tons CO2`, 250, detailsY + 90);

      // Carbon Credits
      doc.font('Helvetica')
         .fillColor('#0F2A1D')
         .text('Carbon Credits Generated:', 100, detailsY + 120);
      doc.font('Helvetica-Bold')
         .fillColor(cert.carbon_credits > 0 ? '#7CFFB2' : '#0F2A1D')
         .text(cert.carbon_credits.toFixed(2), 250, detailsY + 120);

      // Generated Date
      doc.font('Helvetica')
         .fillColor('#0F2A1D')
         .text('Generated At:', 100, detailsY + 150);
      doc.font('Helvetica-Bold')
         .text(new Date(cert.generated_at).toLocaleString(), 250, detailsY + 150);

      // Blockchain Verification Section
      doc.rect(80, 480, 435, 180)
         .fillAndStroke('#F0FFF4', '#7CFFB2');

      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#0F2A1D')
         .text('🔐 Blockchain Verification', 100, 500);

      doc.fontSize(11).font('Helvetica');

      // Block ID
      doc.text('Block ID:', 100, 535);
      doc.font('Helvetica-Bold')
         .text(blockchain.block_id.toString(), 250, 535);

      // Certificate Hash
      doc.font('Helvetica')
         .text('Certificate Hash:', 100, 560);
      doc.fontSize(8)
         .font('Courier')
         .text(blockchain.certificate_hash, 100, 575, { width: 400 });

      // Block Timestamp
      doc.fontSize(11)
         .font('Helvetica')
         .text('Block Timestamp:', 100, 600);
      doc.font('Helvetica-Bold')
         .text(new Date(blockchain.block_timestamp).toLocaleString(), 250, 600);

      // Verification Status
      doc.font('Helvetica')
         .text('Status:', 100, 625);
      doc.font('Helvetica-Bold')
         .fillColor('#7CFFB2')
         .text(blockchain.verification_status, 250, 625);

      // Footer
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#0F2A1D')
         .text('This certificate is cryptographically secured and recorded on the CarbonChain Ledger.', 
               70, 690, { align: 'center', width: 455 });

      doc.fontSize(8)
         .fillColor('#666')
         .text('Verify authenticity at: https://carbonchain.verify', 
               70, 710, { align: 'center', width: 455 });

      // Decorative elements
      doc.circle(520, 100, 15).fillAndStroke('#7CFFB2', '#0F2A1D');
      doc.circle(75, 100, 15).fillAndStroke('#7CFFB2', '#0F2A1D');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateBlockchainCertificatePDF
};
