import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const QualityAssurance = () => {
  const { data, isLoading, error } = useAPIQuery('lab-tests');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Quality Assurance</h1>
      </header>

      <div className="content-section">
        <p>Ensure accuracy and reliability of lab results.</p>
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

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
