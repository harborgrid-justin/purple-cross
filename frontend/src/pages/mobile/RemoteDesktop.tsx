import '../../styles/Page.css';

const RemoteDesktop = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Remote Desktop Access</h1>
      </header>

      <div className="content-section">
        <p>Secure remote access to the platform.</p>

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Protocols</h3>
            <ul>
              <li>RDP</li>
              <li>VNC</li>
              <li>SSH</li>
              <li>Web-based</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Security</h3>
            <ul>
              <li>Multi-factor auth</li>
              <li>End-to-end encryption</li>
              <li>Session timeout</li>
              <li>Access logs</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>File transfer</li>
              <li>Clipboard sync</li>
              <li>Multi-monitor</li>
              <li>Print support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteDesktop;
