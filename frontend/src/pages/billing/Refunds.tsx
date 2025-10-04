import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Refunds = () => {
  const { data, isLoading, error } = useAPIQuery('invoices');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Refund & Credit Management</h1>
      </header>

      <div className="content-section">
        <p>Process refunds and manage client credits.</p>
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
            <h3>Refunds</h3>
            <ul>
              <li>Full refunds</li>
              <li>Partial refunds</li>
              <li>Process refunds</li>
              <li>Refund tracking</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Credits</h3>
            <ul>
              <li>Account credits</li>
              <li>Credit memos</li>
              <li>Apply credits</li>
              <li>Credit expiration</li>
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
              <li>Refund reports</li>
              <li>Credit reports</li>
              <li>Reason tracking</li>
              <li>Trend analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refunds;
