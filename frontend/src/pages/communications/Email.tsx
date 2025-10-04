import '../../styles/Page.css';

const Email = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Email Communication</h1>
      </header>

      <div className="content-section">
        <p>Professional email communication system.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Email Types</h3>
            <ul>
              <li>Appointment confirmations</li>
              <li>Lab results</li>
              <li>Invoices</li>
              <li>Newsletters</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Templates</h3>
            <ul>
              <li>Custom templates</li>
              <li>Branded emails</li>
              <li>Rich formatting</li>
              <li>Attachments</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Automation</h3>
            <ul>
              <li>Triggered emails</li>
              <li>Drip campaigns</li>
              <li>Follow-ups</li>
              <li>Reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
