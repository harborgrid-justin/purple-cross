import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const SampleTracking = () => {
  const { data, isLoading, error } = useAPIQuery('lab-tests');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Sample Tracking</h1>
      </header>

      <div className="content-section">
        <p>Track specimens from collection to disposal.</p>
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Tracking</h3>
            <ul>
              <li>Collection</li>
              <li>Processing</li>
              <li>Testing</li>
              <li>Storage</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Identification</h3>
            <ul>
              <li>Barcoding</li>
              <li>Specimen labels</li>
              <li>Chain of custody</li>
              <li>Location tracking</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>Sample inventory</li>
              <li>Disposal records</li>
              <li>Retention policies</li>
              <li>Audit trails</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleTracking;
