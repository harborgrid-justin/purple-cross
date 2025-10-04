import '../../styles/Page.css';

const Storage = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Storage</h1>
      </header>

      <div className="content-section">
        <p>Secure cloud-based document storage and management.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Storage</h3>
            <ul>
              <li>Unlimited storage</li>
              <li>Cloud backup</li>
              <li>Version control</li>
              <li>Automatic sync</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Organization</h3>
            <ul>
              <li>Folders</li>
              <li>Tags</li>
              <li>Categories</li>
              <li>Smart collections</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Security</h3>
            <ul>
              <li>Encryption</li>
              <li>Access controls</li>
              <li>Audit trails</li>
              <li>Compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
