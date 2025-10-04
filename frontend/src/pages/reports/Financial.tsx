import '../../styles/Page.css';

const Financial = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Financial Reports</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive financial reporting and analysis.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Revenue</h3>
            <ul>
              <li>Revenue by service</li>
              <li>Revenue by provider</li>
              <li>Revenue trends</li>
              <li>Payment methods</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Expenses</h3>
            <ul>
              <li>Operating expenses</li>
              <li>COGS</li>
              <li>Overhead</li>
              <li>Cost centers</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Profitability</h3>
            <ul>
              <li>Profit margins</li>
              <li>Break-even analysis</li>
              <li>ROI</li>
              <li>Budget variance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;
