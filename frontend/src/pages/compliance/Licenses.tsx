import '../../styles/Page.css';

const Licenses = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>License & Credential Tracking</h1>
      </header>

      <div className="content-section">
        <p>Track professional licenses and credentials.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Tracking</h3>
            <ul>
              <li>License numbers</li>
              <li>Expiration dates</li>
              <li>Renewal reminders</li>
              <li>CE requirements</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Credentials</h3>
            <ul>
              <li>DEA licenses</li>
              <li>State licenses</li>
              <li>Certifications</li>
              <li>Board specialties</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Monitoring</h3>
            <ul>
              <li>Renewal alerts</li>
              <li>Compliance status</li>
              <li>Verification</li>
              <li>Documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Licenses;
