import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const ClinicalNotes = () => {
  const { data, isLoading, error } = useAPIQuery('medical-records');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Clinical Note Templates</h1>
      </header>

      <div className="content-section">
        <p>Standardized templates for consistent documentation.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Note Types</h3>
            <ul>
              <li>SOAP notes</li>
              <li>Progress notes</li>
              <li>Surgery notes</li>
              <li>Emergency notes</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Templates</h3>
            <ul>
              <li>Pre-built templates</li>
              <li>Custom templates</li>
              <li>Specialty templates</li>
              <li>Quick notes</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Voice dictation</li>
              <li>Auto-complete</li>
              <li>Copy forward</li>
              <li>Smart templates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;
