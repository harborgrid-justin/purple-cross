import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const FinancialReports = () => {
  const { data, isLoading, error } = useAPIQuery('invoices');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Financial Reporting</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive financial reports and analytics.</p>
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
            <h3>Reports</h3>
            <ul>
              <li>Revenue reports</li>
              <li>Expense reports</li>
              <li>Profit/loss</li>
              <li>Cash flow</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Analytics</h3>
            <ul>
              <li>Revenue trends</li>
              <li>Service analysis</li>
              <li>Provider productivity</li>
              <li>Client spending</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Dashboards</h3>
            <ul>
              <li>Financial KPIs</li>
              <li>Real-time metrics</li>
              <li>Comparative analysis</li>
              <li>Forecasting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
