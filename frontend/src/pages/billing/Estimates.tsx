import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Estimates = () => {
  const { data, isLoading, error } = useAPIQuery('invoices');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Estimates & Quotes</h1>
      </header>

      <div className="content-section">
        <p>Provide accurate cost estimates to clients.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Estimate Creation</h3>
            <ul>
              <li>Quick estimates</li>
              <li>Detailed estimates</li>
              <li>Multi-service</li>
              <li>Package pricing</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Templates</h3>
            <ul>
              <li>Common procedures</li>
              <li>Surgical estimates</li>
              <li>Dental estimates</li>
              <li>Emergency estimates</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Conversion</h3>
            <ul>
              <li>Approve estimates</li>
              <li>Convert to invoice</li>
              <li>Track conversions</li>
              <li>Win rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estimates;
