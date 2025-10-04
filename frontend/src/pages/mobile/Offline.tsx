import { useOfflineData } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Offline = () => {
  const { data: offlineData, isLoading, error } = useOfflineData();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Offline Capabilities</h1>
      </header>

      <div className="content-section">
        <p>Continue working without internet connectivity.</p>

        {isLoading && <p>Loading offline data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading offline data</p>}
        {!!offlineData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Offline data loaded successfully.</p>
          </div>
        )}

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
            <h3>Features</h3>
            <ul>
              <li>Local data storage</li>
              <li>Offline forms</li>
              <li>Queue sync</li>
              <li>Conflict resolution</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Data Access</h3>
            <ul>
              <li>Patient records</li>
              <li>Appointments</li>
              <li>Medical history</li>
              <li>Prescriptions</li>
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
              <li>Manual sync</li>
              <li>Selective sync</li>
              <li>Sync status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;
