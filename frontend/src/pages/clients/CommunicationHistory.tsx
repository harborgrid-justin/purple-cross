import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const CommunicationHistory = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Communication History</h1>
      </header>

      <div className="content-section">
        <p>Track all client interactions and communication touchpoints.</p>
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
            <h3>Communication Log</h3>
            <ul>
              <li>Email history</li>
              <li>SMS records</li>
              <li>Phone call logs</li>
              <li>In-person visits</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Templates</h3>
            <ul>
              <li>Email templates</li>
              <li>SMS templates</li>
              <li>Letter templates</li>
              <li>Reminder templates</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Analytics</h3>
            <ul>
              <li>Response rates</li>
              <li>Engagement metrics</li>
              <li>Preferred channels</li>
              <li>Communication frequency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;
