import '../../styles/Page.css';

const EmergencyAccess = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Emergency Access</h1>
      </header>

      <div className="content-section">
        <p>Quick access to critical information in emergencies.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Quick Access</h3>
            <ul>
              <li>Patient lookup</li>
              <li>Medical alerts</li>
              <li>Emergency contacts</li>
              <li>Critical meds</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Simplified UI</li>
              <li>Voice commands</li>
              <li>Quick actions</li>
              <li>Priority notifications</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Security</h3>
            <ul>
              <li>PIN bypass</li>
              <li>Audit logging</li>
              <li>Time limits</li>
              <li>Emergency protocols</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccess;
