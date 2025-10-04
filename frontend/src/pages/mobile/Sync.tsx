import { useMobileSync, useSyncMobileData } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Sync = () => {
  const { data: syncData, isLoading, error } = useMobileSync();
  const syncMobileData = useSyncMobileData();

  const handleSync = async () => {
    try {
      await syncMobileData.mutateAsync({});
      alert('Data synced successfully!');
    } catch (err) {
      console.error('Error syncing data:', err);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Cross-Platform Sync</h1>
        <button className="btn-primary" onClick={handleSync} disabled={syncMobileData.isPending}>
          {syncMobileData.isPending ? 'Syncing...' : 'Sync Now'}
        </button>
      </header>

      <div className="content-section">
        <p>Keep data synchronized across all devices.</p>

        {isLoading && <p>Loading sync status...</p>}
        {error && <p style={{ color: 'red' }}>Error loading sync status</p>}
        {!!syncData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Sync status loaded successfully.</p>
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
            <h3>Sync Features</h3>
            <ul>
              <li>Real-time sync</li>
              <li>Scheduled sync</li>
              <li>Manual sync</li>
              <li>Selective sync</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Data Types</h3>
            <ul>
              <li>Patient records</li>
              <li>Appointments</li>
              <li>Documents</li>
              <li>Settings</li>
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
              <li>Conflict resolution</li>
              <li>Bandwidth control</li>
              <li>Sync history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sync;
