import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Diagnostics = () => {
  const { data, isLoading, error } = useAPIQuery('medical-records');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Diagnostic Results Tracking</h1>
      </header>

      <div className="content-section">
        <p>Track and manage all diagnostic test results.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Test Types</h3>
            <ul>
              <li>Blood work</li>
              <li>Urinalysis</li>
              <li>Imaging</li>
              <li>Biopsies</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Results</h3>
            <ul>
              <li>Lab integration</li>
              <li>Result alerts</li>
              <li>Trending</li>
              <li>Comparisons</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reporting</h3>
            <ul>
              <li>Result summaries</li>
              <li>PDF reports</li>
              <li>Shareable reports</li>
              <li>Historical trends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
