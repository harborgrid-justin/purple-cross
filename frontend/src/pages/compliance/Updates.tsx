import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Updates = () => {
  const { data, isLoading, error } = useAPIQuery('compliance/regulatory-updates');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Regulatory Updates</h1>
      </header>

      <div className="content-section">
        <p>Stay informed about regulatory changes.</p>
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
            <h3>Updates</h3>
            <ul>
              <li>Federal regulations</li>
              <li>State regulations</li>
              <li>Industry standards</li>
              <li>Best practices</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Notifications</h3>
            <ul>
              <li>Email alerts</li>
              <li>Newsletter</li>
              <li>In-app notifications</li>
              <li>Compliance calendar</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Resources</h3>
            <ul>
              <li>Regulatory guides</li>
              <li>Compliance resources</li>
              <li>Training materials</li>
              <li>Expert consultation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Updates;
