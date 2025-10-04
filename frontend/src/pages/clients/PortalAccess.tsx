import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PortalAccess = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Portal Access</h1>
      </header>

      <div className="content-section">
        <p>Self-service portal for clients to manage their accounts online.</p>
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
            <h3>Portal Features</h3>
            <ul>
              <li>View records</li>
              <li>Book appointments</li>
              <li>Pay invoices</li>
              <li>Request prescriptions</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Access Control</h3>
            <ul>
              <li>User permissions</li>
              <li>Family access</li>
              <li>Temporary access</li>
              <li>Access logs</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Mobile App</h3>
            <ul>
              <li>iOS application</li>
              <li>Android application</li>
              <li>Push notifications</li>
              <li>Offline mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalAccess;
