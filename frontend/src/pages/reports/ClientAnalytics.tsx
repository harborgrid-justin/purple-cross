import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const ClientAnalytics = () => {
  const { data, isLoading, error } = useAPIQuery('reports/client-analytics');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Analytics</h1>
      </header>

      <div className="content-section">
        <p>Analyze client behavior and demographics.</p>
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
            <h3>Demographics</h3>
            <ul>
              <li>Age distribution</li>
              <li>Location analysis</li>
              <li>Income levels</li>
              <li>Pet ownership</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Behavior</h3>
            <ul>
              <li>Visit frequency</li>
              <li>Service preferences</li>
              <li>Spending patterns</li>
              <li>Lifetime value</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Retention</h3>
            <ul>
              <li>Retention rates</li>
              <li>Churn analysis</li>
              <li>Loyalty metrics</li>
              <li>Engagement scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics;
