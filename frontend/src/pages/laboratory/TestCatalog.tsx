import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const TestCatalog = () => {
  const { data, isLoading, error } = useAPIQuery('lab-tests');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Test Catalog Management</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive catalog of available tests.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Catalog</h3>
            <ul>
              <li>Test descriptions</li>
              <li>Specimen requirements</li>
              <li>Turnaround times</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Organization</h3>
            <ul>
              <li>Test panels</li>
              <li>Profiles</li>
              <li>Individual tests</li>
              <li>Species-specific</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Information</h3>
            <ul>
              <li>CPT codes</li>
              <li>Reference ranges</li>
              <li>Interpretation guides</li>
              <li>Clinical notes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCatalog;
