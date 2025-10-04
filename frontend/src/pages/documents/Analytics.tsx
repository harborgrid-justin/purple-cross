import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Analytics = () => {
  const { data, isLoading, error } = useAPIQuery('documents');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Analytics</h1>
      </header>

      <div className="content-section">
        <p>Usage analytics and insights.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Metrics</h3>
            <ul>
              <li>Storage usage</li>
              <li>Document counts</li>
              <li>User activity</li>
              <li>Access patterns</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reports</h3>
            <ul>
              <li>Usage reports</li>
              <li>Compliance reports</li>
              <li>Activity reports</li>
              <li>Audit reports</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Insights</h3>
            <ul>
              <li>Popular documents</li>
              <li>Inactive documents</li>
              <li>Collaboration patterns</li>
              <li>Storage trends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
