import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const MedicationDatabase = () => {
  const { data, isLoading, error } = useAPIQuery('prescriptions');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Medication Database</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive drug information and reference database.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Database</h3>
            <ul>
              <li>10,000+ medications</li>
              <li>Dosing guidelines</li>
              <li>Contraindications</li>
              <li>Side effects</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Search</h3>
            <ul>
              <li>By name</li>
              <li>By class</li>
              <li>By indication</li>
              <li>By species</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Information</h3>
            <ul>
              <li>Drug monographs</li>
              <li>Dosing calculators</li>
              <li>Administration routes</li>
              <li>Storage requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDatabase;
