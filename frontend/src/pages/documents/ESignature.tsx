import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const ESignature = () => {
  const { data, isLoading, error } = useAPIQuery('documents');

  return (
    <div className="page">
      <header className="page-header">
        <h1>E-Signature Integration</h1>
      </header>

      <div className="content-section">
        <p>Legally binding electronic signatures.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Signing</h3>
            <ul>
              <li>In-person signing</li>
              <li>Remote signing</li>
              <li>Bulk signing</li>
              <li>Sequential signing</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Compliance</h3>
            <ul>
              <li>ESIGN Act</li>
              <li>UETA</li>
              <li>Audit trails</li>
              <li>Tamper-proof</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Track status</li>
              <li>Reminders</li>
              <li>Expiration</li>
              <li>Void/cancel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignature;
