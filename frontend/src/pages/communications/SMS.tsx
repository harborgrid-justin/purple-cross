import '../../styles/Page.css';

const SMS = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>SMS Messaging</h1>
      </header>

      <div className="content-section">
        <p>Text message communication with clients.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Messaging</h3>
            <ul>
              <li>Appointment reminders</li>
              <li>Test results</li>
              <li>Medication reminders</li>
              <li>General updates</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Two-way texting</li>
              <li>Bulk messaging</li>
              <li>Templates</li>
              <li>Opt-in/opt-out</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Compliance</h3>
            <ul>
              <li>TCPA compliance</li>
              <li>Consent management</li>
              <li>Message logs</li>
              <li>Delivery tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMS;
