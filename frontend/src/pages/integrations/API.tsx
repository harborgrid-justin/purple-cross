import '../../styles/Page.css';

const API = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>RESTful API</h1>
      </header>

      <div className="content-section">
        <p>Programmatic access to platform data and functionality.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>API Features</h3>
            <ul>
              <li>REST endpoints</li>
              <li>JSON format</li>
              <li>Authentication</li>
              <li>Rate limiting</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Documentation</h3>
            <ul>
              <li>API reference</li>
              <li>Code examples</li>
              <li>SDKs</li>
              <li>Postman collections</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>API keys</li>
              <li>Usage metrics</li>
              <li>Error logs</li>
              <li>Version control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default API;
