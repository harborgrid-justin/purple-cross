import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const RecordRetention = () => {
  const { data, isLoading, error } = useAPIQuery('compliance/record-retention');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Medical Record Retention</h1>
      </header>

      <div className="content-section">
        <p>Manage record retention policies and compliance.</p>
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
            <h3>Policies</h3>
            <ul>
              <li>Retention schedules</li>
              <li>State requirements</li>
              <li>Minimum retention</li>
              <li>Destruction policies</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>Archive records</li>
              <li>Purge records</li>
              <li>Legal holds</li>
              <li>Record requests</li>
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
              <li>Documentation</li>
              <li>Audit trails</li>
              <li>Destruction certificates</li>
              <li>Storage requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordRetention;
