import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Analytics = () => {
  const { data, isLoading, error } = useAPIQuery('appointments');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Appointment Analytics</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive analytics and reporting on appointment metrics.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Metrics</h3>
            <ul>
              <li>Booking rates</li>
              <li>No-show rates</li>
              <li>Cancellation rates</li>
              <li>Wait times</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reports</h3>
            <ul>
              <li>Daily summaries</li>
              <li>Monthly trends</li>
              <li>Provider performance</li>
              <li>Revenue analysis</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Insights</h3>
            <ul>
              <li>Peak times</li>
              <li>Busy seasons</li>
              <li>Capacity utilization</li>
              <li>Growth opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
