import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Results = () => {
  const { data, isLoading, error } = useAPIQuery('lab-tests');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Result Interpretation</h1>
      </header>

      <div className="content-section">
        <p>Tools for interpreting and analyzing lab results.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Interpretation</h3>
            <ul>
              <li>Reference ranges</li>
              <li>Critical values</li>
              <li>Trending</li>
              <li>Pattern recognition</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Visualization</h3>
            <ul>
              <li>Graphs</li>
              <li>Charts</li>
              <li>Comparisons</li>
              <li>Historical trends</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Clinical Support</h3>
            <ul>
              <li>Decision support</li>
              <li>Diagnostic algorithms</li>
              <li>References</li>
              <li>Expert systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
