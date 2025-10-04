import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const ClientPortal = () => {
  const { data, isLoading, error } = useAPIQuery('communications');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Portal</h1>
      </header>

      <div className="content-section">
        <p>Self-service portal for client access.</p>
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
            <h3>Medical Records</h3>
            <ul>
              <li>Pet profiles</li>
              <li>Vaccination records</li>
              <li>Lab results</li>
              <li>Medical history</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Communication</h3>
            <ul>
              <li>Secure messaging</li>
              <li>Appointment reminders</li>
              <li>Test results</li>
              <li>Prescription refills</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
