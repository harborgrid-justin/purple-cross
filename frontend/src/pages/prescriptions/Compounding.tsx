import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Compounding = () => {
  const { data, isLoading, error } = useAPIQuery('prescriptions');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Compounding Management</h1>
      </header>

      <div className="content-section">
        <p>Manage custom medication compounding and formulations.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Formulations</h3>
            <ul>
              <li>Custom compounds</li>
              <li>Flavoring</li>
              <li>Dosage forms</li>
              <li>Strength adjustments</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Recipes</h3>
            <ul>
              <li>Standard recipes</li>
              <li>Custom recipes</li>
              <li>Batch records</li>
              <li>Quality control</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Documentation</h3>
            <ul>
              <li>Compounding logs</li>
              <li>Ingredient sources</li>
              <li>Expiration tracking</li>
              <li>Labeling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compounding;
