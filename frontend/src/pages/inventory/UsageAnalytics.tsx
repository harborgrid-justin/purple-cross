import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const UsageAnalytics = () => {
  const { data, isLoading, error } = useAPIQuery('inventory');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Usage Analytics</h1>
      </header>

      <div className="content-section">
        <p>Analyze inventory usage patterns and trends.</p>
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
            <h3>Analytics</h3>
            <ul>
              <li>Usage by item</li>
              <li>Usage by department</li>
              <li>Usage by provider</li>
              <li>Seasonal trends</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Optimization</h3>
            <ul>
              <li>Reduce waste</li>
              <li>Optimize stock</li>
              <li>Identify savings</li>
              <li>Improve efficiency</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Forecasting</h3>
            <ul>
              <li>Demand prediction</li>
              <li>Stock planning</li>
              <li>Budget forecasting</li>
              <li>Capacity planning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;
