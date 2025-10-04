import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Templates = () => {
  const { data, isLoading, error } = useAPIQuery('documents');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Templates</h1>
      </header>

      <div className="content-section">
        <p>Pre-built templates for common documents.</p>
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
            <h3>Templates</h3>
            <ul>
              <li>Consent forms</li>
              <li>Treatment plans</li>
              <li>Discharge instructions</li>
              <li>Client letters</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Customization</h3>
            <ul>
              <li>Edit templates</li>
              <li>Brand templates</li>
              <li>Merge fields</li>
              <li>Conditional content</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Usage</h3>
            <ul>
              <li>Quick fill</li>
              <li>Auto-populate</li>
              <li>Digital signing</li>
              <li>Email delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
