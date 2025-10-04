import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const HIPAA = () => {
  const { data, isLoading, error } = useAPIQuery('compliance/hipaa');

  return (
    <div className="page">
      <header className="page-header">
        <h1>HIPAA Compliance</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive HIPAA compliance management.</p>
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
            <h3>Privacy</h3>
            <ul>
              <li>Privacy policies</li>
              <li>Client consent</li>
              <li>Access controls</li>
              <li>Minimum necessary</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Security</h3>
            <ul>
              <li>Data encryption</li>
              <li>Audit logs</li>
              <li>Risk assessments</li>
              <li>Incident response</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Training</h3>
            <ul>
              <li>Staff training</li>
              <li>Annual updates</li>
              <li>Certification</li>
              <li>Documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HIPAA;
