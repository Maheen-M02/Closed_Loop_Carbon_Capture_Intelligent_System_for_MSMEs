import { downloadESGReport } from '../api/carbonApi';

export default function ESGDownloadButton() {
  return (
    <div className="card download-section">
      <h2 className="section-title">ESG Report</h2>
      <p>Download comprehensive ESG analysis report in PDF format</p>
      <button className="download-button" onClick={downloadESGReport}>
        Download ESG Report (PDF)
      </button>
    </div>
  );
}
