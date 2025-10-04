import '../../styles/Page.css';

const Sync = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Cross-Platform Sync</h1>
      </header>

      <div className="content-section">
        <p>Seamless synchronization across all devices.</p>
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
            <h3>Sync Features</h3>
            <ul>
              <li>Real-time sync</li>
              <li>Conflict resolution</li>
              <li>Selective sync</li>
              <li>Background sync</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Platforms</h3>
            <ul>
              <li>Web</li>
              <li>iOS</li>
              <li>Android</li>
              <li>Desktop</li>
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
              <li>Sync status</li>
              <li>Bandwidth control</li>
              <li>Sync history</li>
              <li>Troubleshooting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sync;
