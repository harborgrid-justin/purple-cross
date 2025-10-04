import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const StockMonitoring = () => {
  const { data, isLoading, error } = useAPIQuery('inventory');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Stock Level Monitoring</h1>
      </header>

      <div className="content-section">
        <p>Real-time inventory tracking and monitoring.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Monitoring</h3>
            <ul>
              <li>Current levels</li>
              <li>Low stock alerts</li>
              <li>Out of stock alerts</li>
              <li>Expiration tracking</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reporting</h3>
            <ul>
              <li>Stock reports</li>
              <li>Usage reports</li>
              <li>Turnover rates</li>
              <li>Waste tracking</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Alerts</h3>
            <ul>
              <li>Reorder alerts</li>
              <li>Expiration alerts</li>
              <li>Overstock alerts</li>
              <li>Custom alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMonitoring;
