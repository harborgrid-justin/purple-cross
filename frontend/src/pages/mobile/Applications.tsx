import { useMobileApplications } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Applications = () => {
  const { data: appsData, isLoading, error } = useMobileApplications();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Mobile Applications</h1>
      </header>

      <div className="content-section">
        <p>Native mobile apps for iOS and Android.</p>

        {isLoading && <p>Loading mobile applications...</p>}
        {error && <p style={{ color: 'red' }}>Error loading applications</p>}
        {!!appsData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Mobile applications loaded successfully.</p>
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
              <li>Full functionality</li>
              <li>Offline mode</li>
              <li>Push notifications</li>
              <li>Biometric auth</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>iOS App</h3>
            <ul>
              <li>iPhone support</li>
              <li>iPad optimization</li>
              <li>Apple Watch</li>
              <li>App Store</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Android App</h3>
            <ul>
              <li>Phone support</li>
              <li>Tablet optimization</li>
              <li>Android Wear</li>
              <li>Play Store</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
