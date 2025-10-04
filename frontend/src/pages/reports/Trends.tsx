import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Trends = () => {
  const { data, isLoading, error } = useAPIQuery('reports/trends');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Trend Analysis</h1>
      </header>

      <div className="content-section">
        <p>Identify and analyze business trends over time.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Trending</h3>
            <ul>
              <li>Revenue trends</li>
              <li>Patient trends</li>
              <li>Service trends</li>
              <li>Seasonal patterns</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Analysis</h3>
            <ul>
              <li>Year-over-year</li>
              <li>Month-over-month</li>
              <li>Moving averages</li>
              <li>Growth rates</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Forecasting</h3>
            <ul>
              <li>Predictive analytics</li>
              <li>Scenario planning</li>
              <li>What-if analysis</li>
              <li>Projections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
