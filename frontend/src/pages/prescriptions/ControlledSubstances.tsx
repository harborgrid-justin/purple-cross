import '../../styles/Page.css';

const ControlledSubstances = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Controlled Substance Tracking</h1>
      </header>

      <div className="content-section">
        <p>DEA-compliant tracking of controlled substances.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Tracking</h3>
            <ul>
              <li>Schedule II-V</li>
              <li>Inventory levels</li>
              <li>Dispensing records</li>
              <li>Destruction records</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Compliance</h3>
            <ul>
              <li>DEA reporting</li>
              <li>State reporting</li>
              <li>Audit trails</li>
              <li>Security measures</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Monitoring</h3>
            <ul>
              <li>Usage patterns</li>
              <li>Discrepancies</li>
              <li>Audit preparation</li>
              <li>Renewal reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlledSubstances;
