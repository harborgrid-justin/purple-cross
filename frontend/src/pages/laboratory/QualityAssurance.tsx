import '../../styles/Page.css';

const QualityAssurance = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Quality Assurance</h1>
      </header>

      <div className="content-section">
        <p>Ensure accuracy and reliability of lab results.</p>
        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>QA/QC</h3>
            <ul>
              <li>Control samples</li>
              <li>Calibration</li>
              <li>Proficiency testing</li>
              <li>Method validation</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Monitoring</h3>
            <ul>
              <li>QC charts</li>
              <li>Out-of-control alerts</li>
              <li>Corrective actions</li>
              <li>Documentation</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Compliance</h3>
            <ul>
              <li>CLIA compliance</li>
              <li>Accreditation</li>
              <li>Standard procedures</li>
              <li>Training records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssurance;
