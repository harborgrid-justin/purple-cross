import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Notifications = () => {
  const { data, isLoading, error } = useAPIQuery('communications');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Push Notifications</h1>
      </header>

      <div className="content-section">
        <p>Mobile and web push notifications.</p>
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

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
            <h3>Notification Types</h3>
            <ul>
              <li>Appointments</li>
              <li>Test results</li>
              <li>Messages</li>
              <li>Promotions</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Delivery</h3>
            <ul>
              <li>Mobile push</li>
              <li>Web push</li>
              <li>In-app</li>
              <li>Badge counts</li>
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
              <li>Notification preferences</li>
              <li>Quiet hours</li>
              <li>Priority levels</li>
              <li>Opt-in management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
