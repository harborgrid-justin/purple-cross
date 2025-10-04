import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const InvoiceGeneration = () => {
  const { data, isLoading, error } = useAPIQuery('invoices');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Invoice Generation</h1>
      </header>

      <div className="content-section">
        <p>Create professional invoices for services rendered.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Invoice Creation</h3>
            <ul>
              <li>Itemized invoices</li>
              <li>Bulk invoicing</li>
              <li>Recurring invoices</li>
              <li>Deposit invoices</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Templates</h3>
            <ul>
              <li>Custom templates</li>
              <li>Branded invoices</li>
              <li>Multiple formats</li>
              <li>Multi-language</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Automation</h3>
            <ul>
              <li>Auto-generate</li>
              <li>Email delivery</li>
              <li>Payment links</li>
              <li>Reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGeneration;
