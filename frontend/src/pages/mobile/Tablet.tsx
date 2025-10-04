import { useMobileDevices } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Tablet = () => {
  const { data: devicesData, isLoading, error } = useMobileDevices({ platform: 'tablet' });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Tablet Optimization</h1>
      </header>

      <div className="content-section">
        <p>Tablet-optimized interface and features.</p>

        {isLoading && <p>Loading tablet devices...</p>}
        {error && <p style={{ color: 'red' }}>Error loading devices</p>}
        {!!devicesData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Tablet devices loaded successfully.</p>
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
            <h3>Platforms</h3>
            <ul>
              <li>iPad</li>
              <li>Android tablets</li>
              <li>Windows tablets</li>
              <li>Chrome OS</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>Split screen</li>
              <li>Stylus support</li>
              <li>Large form factor UI</li>
              <li>Gesture controls</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Use Cases</h3>
            <ul>
              <li>Exam room</li>
              <li>Surgery suite</li>
              <li>Reception desk</li>
              <li>Field visits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tablet;
