import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Valuation = () => {
  const { data, isLoading, error } = useAPIQuery('inventory');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Inventory Valuation</h1>
      </header>

      <div className="content-section">
        <p>Track inventory value and costs.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Valuation Methods</h3>
            <ul>
              <li>FIFO</li>
              <li>LIFO</li>
              <li>Average cost</li>
              <li>Specific identification</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reporting</h3>
            <ul>
              <li>Current value</li>
              <li>Cost of goods sold</li>
              <li>Profit margins</li>
              <li>Write-offs</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Analysis</h3>
            <ul>
              <li>Cost trends</li>
              <li>Value by category</li>
              <li>Dead stock</li>
              <li>High-value items</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Valuation;
