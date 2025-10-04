import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Segmentation = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Segmentation</h1>
      </header>

      <div className="content-section">
        <p>Segment clients for targeted marketing and personalized service.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Segmentation Criteria</h3>
            <ul>
              <li>Demographics</li>
              <li>Pet ownership</li>
              <li>Visit frequency</li>
              <li>Spending patterns</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Target Groups</h3>
            <ul>
              <li>New clients</li>
              <li>High-value clients</li>
              <li>At-risk clients</li>
              <li>VIP clients</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Campaigns</h3>
            <ul>
              <li>Email campaigns</li>
              <li>SMS campaigns</li>
              <li>Direct mail</li>
              <li>Special promotions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Segmentation;
