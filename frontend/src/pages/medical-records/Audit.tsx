import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Audit = () => {
  const { data, isLoading, error } = useAPIQuery('medical-records');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Audit Trail & Compliance</h1>
      </header>

      <div className="content-section">
        <p>Complete audit trail for regulatory compliance.</p>
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
            <h3>Audit Log</h3>
            <ul>
              <li>All changes</li>
              <li>User actions</li>
              <li>Timestamps</li>
              <li>IP addresses</li>
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
              <li>HIPAA compliance</li>
              <li>Data retention</li>
              <li>Access controls</li>
              <li>Breach detection</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Reporting</h3>
            <ul>
              <li>Audit reports</li>
              <li>Compliance reports</li>
              <li>Security reports</li>
              <li>Access reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
