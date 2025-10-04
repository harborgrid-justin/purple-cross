import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const MultiPet = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Multi-Pet Household Management</h1>
      </header>

      <div className="content-section">
        <p>Manage multiple pets under a single client account.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Household Overview</h3>
            <ul>
              <li>All pets listed</li>
              <li>Relationship mapping</li>
              <li>Primary contacts</li>
              <li>Household notes</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Pet Management</h3>
            <ul>
              <li>Add/remove pets</li>
              <li>Transfer ownership</li>
              <li>Share access</li>
              <li>Group appointments</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Billing Consolidation</h3>
            <ul>
              <li>Combined invoices</li>
              <li>Shared payment plans</li>
              <li>Household discounts</li>
              <li>Family packages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiPet;
