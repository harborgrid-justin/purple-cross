import { useAccountingIntegrations } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Accounting = () => {
  const { data: accountingData, isLoading, error } = useAccountingIntegrations();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Accounting Software Integration</h1>
      </header>

      <div className="content-section">
        <p>Sync financial data with accounting software.</p>

        {isLoading && <p>Loading accounting integrations...</p>}
        {error && <p style={{ color: 'red' }}>Error loading accounting integrations</p>}
        {!!accountingData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Accounting integrations loaded successfully.</p>
          </div>
        )}

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
            <h3>Platforms</h3>
            <ul>
              <li>QuickBooks</li>
              <li>Xero</li>
              <li>Sage</li>
              <li>FreshBooks</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Data Sync</h3>
            <ul>
              <li>Invoices</li>
              <li>Payments</li>
              <li>Expenses</li>
              <li>Chart of accounts</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>Auto-sync</li>
              <li>Manual sync</li>
              <li>Conflict resolution</li>
              <li>Audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
