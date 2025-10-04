import '../../styles/Page.css';

const RemoteDesktop = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Remote Desktop Access</h1>
      </header>

      <div className="content-section">
        <p>Secure remote access to the system.</p>
        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Access Methods</h3>
            <ul>
              <li>VPN</li>
              <li>RDP</li>
              <li>Web access</li>
              <li>Mobile apps</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Security</h3>
            <ul>
              <li>Encryption</li>
              <li>Multi-factor auth</li>
              <li>Session timeout</li>
              <li>Access logs</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>User permissions</li>
              <li>Device management</li>
              <li>Session monitoring</li>
              <li>Security policies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteDesktop;
