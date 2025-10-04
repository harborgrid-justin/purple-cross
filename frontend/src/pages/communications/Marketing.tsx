import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Marketing = () => {
  const { data, isLoading, error } = useAPIQuery('communications');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Marketing Automation</h1>
      </header>

      <div className="content-section">
        <p>Automated marketing campaigns and workflows.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Campaigns</h3>
            <ul>
              <li>Email campaigns</li>
              <li>SMS campaigns</li>
              <li>Multi-channel</li>
              <li>Drip campaigns</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Segmentation</h3>
            <ul>
              <li>Target audiences</li>
              <li>Behavioral triggers</li>
              <li>Custom segments</li>
              <li>A/B testing</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Analytics</h3>
            <ul>
              <li>Open rates</li>
              <li>Click rates</li>
              <li>Conversions</li>
              <li>ROI tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
