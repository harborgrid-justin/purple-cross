import { useEmergencyAccess } from '../../hooks/useAPI';
import '../../styles/Page.css';

const EmergencyAccess = () => {
  const { data: emergencyData, isLoading, error } = useEmergencyAccess();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Emergency Access</h1>
      </header>

      <div className="content-section">
        <p>Quick access protocols for emergency situations.</p>
        
        {isLoading && <p>Loading emergency access data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading emergency access data</p>}
        {!!emergencyData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Emergency access data loaded successfully.</p>
          </div>
        )}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Fast login</li>
              <li>Quick patient lookup</li>
              <li>Critical info access</li>
              <li>Emergency contacts</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Security</h3>
            <ul>
              <li>Break-glass access</li>
              <li>Audit trail</li>
              <li>Temporary elevation</li>
              <li>Notifications</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Use Cases</h3>
            <ul>
              <li>After hours</li>
              <li>Critical cases</li>
              <li>On-call access</li>
              <li>Disaster recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccess;
