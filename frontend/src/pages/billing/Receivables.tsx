import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Receivables = () => {
  const { data, isLoading, error } = useAPIQuery('invoices');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Account Receivables</h1>
      </header>

      <div className="content-section">
        <p>Manage outstanding balances and collections.</p>
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
            <h3>AR Management</h3>
            <ul>
              <li>Outstanding balances</li>
              <li>Aging reports</li>
              <li>Collection letters</li>
              <li>Payment tracking</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Collections</h3>
            <ul>
              <li>Automated reminders</li>
              <li>Collection agencies</li>
              <li>Payment arrangements</li>
              <li>Write-offs</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Reporting</h3>
            <ul>
              <li>AR reports</li>
              <li>DSO metrics</li>
              <li>Collection rates</li>
              <li>Bad debt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receivables;
