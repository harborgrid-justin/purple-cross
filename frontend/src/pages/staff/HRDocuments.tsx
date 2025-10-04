import '../../styles/Page.css';

const HRDocuments = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>HR Document Management</h1>
      </header>

      <div className="content-section">
        <p>Manage employee documents and records.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Documents</h3>
            <ul>
              <li>Employment contracts</li>
              <li>I-9 forms</li>
              <li>W-4 forms</li>
              <li>Benefits documents</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Storage</h3>
            <ul>
              <li>Secure storage</li>
              <li>Digital signatures</li>
              <li>Version control</li>
              <li>Access logs</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Compliance</h3>
            <ul>
              <li>Record retention</li>
              <li>Privacy protection</li>
              <li>Audit trails</li>
              <li>Regulatory compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDocuments;
