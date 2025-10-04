import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const ControlledSubstances = () => {
  const { data, isLoading, error } = useAPIQuery('compliance/controlled-substances');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Controlled Substance Reporting</h1>
      </header>

      <div className="content-section">
        <p>DEA and state reporting for controlled substances.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reporting</h3>
            <ul>
              <li>DEA reporting</li>
              <li>State reporting</li>
              <li>PDMP integration</li>
              <li>Audit reports</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Tracking</h3>
            <ul>
              <li>Inventory</li>
              <li>Dispensing</li>
              <li>Destruction</li>
              <li>Theft/loss</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Compliance</h3>
            <ul>
              <li>Schedule tracking</li>
              <li>Record keeping</li>
              <li>Inspections</li>
              <li>Training</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlledSubstances;
