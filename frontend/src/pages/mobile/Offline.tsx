import '../../styles/Page.css';

const Offline = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Offline Capabilities</h1>
      </header>

      <div className="content-section">
        <p>Work without internet connectivity.</p>
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
            <h3>Offline Features</h3>
            <ul>
              <li>View records</li>
              <li>Create notes</li>
              <li>Process payments</li>
              <li>Update data</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Sync</h3>
            <ul>
              <li>Auto-sync</li>
              <li>Conflict resolution</li>
              <li>Queue management</li>
              <li>Bandwidth optimization</li>
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
              <li>Sync settings</li>
              <li>Storage limits</li>
              <li>Data prioritization</li>
              <li>Sync status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;
