import { downloadESGReport, downloadBlockchainCertificate } from '../api/carbonApi';

export default function Reports() {
  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div className="header-icon">📄</div>
        <div className="header-content">
          <h1 className="header-title">Reports & Certificates</h1>
          <div className="header-meta">
            <span className="meta-text">Download comprehensive documentation</span>
          </div>
        </div>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div className="card-compact">
          <div className="card-header-compact">📊 Comprehensive ESG Report</div>
          <p className="card-text-compact">
            Complete environmental, social, and governance analysis with carbon metrics, 
            compliance status, and strategic recommendations.
          </p>
          <div className="features-grid-compact">
            <div className="feature-item-compact">✓ Executive Summary</div>
            <div className="feature-item-compact">✓ Environmental Performance</div>
            <div className="feature-item-compact">✓ Risk & Compliance</div>
            <div className="feature-item-compact">✓ Optimization Strategy</div>
            <div className="feature-item-compact">✓ Financial Impact</div>
            <div className="feature-item-compact">✓ Carbon Capture</div>
            <div className="feature-item-compact">✓ Forward Outlook</div>
            <div className="feature-item-compact">✓ Board-Ready Format</div>
          </div>
          <button className="btn-primary-compact" onClick={downloadESGReport}>
            ⬇ Download ESG Report
          </button>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">🔐 Blockchain Certificate</div>
          <p className="card-text-compact">
            Cryptographically verified carbon credit certificate recorded on the 
            CarbonChain Ledger with immutable blockchain verification.
          </p>
          <div className="features-grid-compact">
            <div className="feature-item-compact">✓ Certificate ID</div>
            <div className="feature-item-compact">✓ Carbon Credits</div>
            <div className="feature-item-compact">✓ SHA256 Hash</div>
            <div className="feature-item-compact">✓ Block ID</div>
            <div className="feature-item-compact">✓ Timestamp</div>
            <div className="feature-item-compact">✓ Verification Status</div>
            <div className="feature-item-compact">✓ Emission Reduction</div>
            <div className="feature-item-compact">✓ Tamper-Proof</div>
          </div>
          <button className="btn-primary-compact" onClick={downloadBlockchainCertificate}>
            ⬇ Download Certificate
          </button>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">Report Features</div>
          <div className="features-list-compact">
            <div className="feature-row-compact">
              <div className="feature-icon-compact">🎯</div>
              <div className="feature-content-compact">
                <div className="feature-title-compact">Board-Level Presentation</div>
                <div className="feature-desc-compact">Professional formatting for executive review</div>
              </div>
            </div>
            <div className="feature-row-compact">
              <div className="feature-icon-compact">📈</div>
              <div className="feature-content-compact">
                <div className="feature-title-compact">Data-Driven Insights</div>
                <div className="feature-desc-compact">Comprehensive analytics with projections</div>
              </div>
            </div>
            <div className="feature-row-compact">
              <div className="feature-icon-compact">✓</div>
              <div className="feature-content-compact">
                <div className="feature-title-compact">Compliance Ready</div>
                <div className="feature-desc-compact">Regulatory-aligned documentation</div>
              </div>
            </div>
            <div className="feature-row-compact">
              <div className="feature-icon-compact">🔐</div>
              <div className="feature-content-compact">
                <div className="feature-title-compact">Blockchain Verified</div>
                <div className="feature-desc-compact">Cryptographically secured certificates with immutable ledger</div>
              </div>
            </div>
            <div className="feature-row-compact">
              <div className="feature-icon-compact">💼</div>
              <div className="feature-content-compact">
                <div className="feature-title-compact">Stakeholder Communication</div>
                <div className="feature-desc-compact">Suitable for investors and auditors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
