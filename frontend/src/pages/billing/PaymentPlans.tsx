import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PaymentPlans = () => {
  const { data, isLoading, error } = useAPIQuery('invoices');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Payment Plans</h1>
      </header>

      <div className="content-section">
        <p>Offer flexible payment options to clients.</p>
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
            <h3>Plan Types</h3>
            <ul>
              <li>Monthly plans</li>
              <li>Custom schedules</li>
              <li>Interest options</li>
              <li>Down payments</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>Setup plans</li>
              <li>Track payments</li>
              <li>Late fees</li>
              <li>Early payoff</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Automation</h3>
            <ul>
              <li>Auto-billing</li>
              <li>Payment reminders</li>
              <li>Receipt generation</li>
              <li>Default management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans;
