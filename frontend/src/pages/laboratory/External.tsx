import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const External = () => {
  const { data, isLoading, error } = useAPIQuery('lab-tests');

  return (
    <div className="page">
      <header className="page-header">
        <h1>External Lab Integration</h1>
      </header>

      <div className="content-section">
        <p>Integrate with external reference laboratories.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Integration</h3>
            <ul>
              <li>Lab partners</li>
              <li>Electronic orders</li>
              <li>Result download</li>
              <li>Automatic import</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Order tracking</li>
              <li>Result alerts</li>
              <li>Critical values</li>
              <li>Follow-up notifications</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Partners</h3>
            <ul>
              <li>Idexx</li>
              <li>Antech</li>
              <li>VDI</li>
              <li>Custom labs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default External;
