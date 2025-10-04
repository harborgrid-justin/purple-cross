import '../../styles/Page.css';

const AutoReorder = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Automatic Reordering</h1>
      </header>

      <div className="content-section">
        <p>Automated purchase order generation based on stock levels.</p>
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
            <h3>Auto-Reorder</h3>
            <ul>
              <li>Min/max levels</li>
              <li>Par levels</li>
              <li>Reorder points</li>
              <li>Lead times</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Smart Ordering</h3>
            <ul>
              <li>Usage patterns</li>
              <li>Seasonal adjustments</li>
              <li>Bulk discounts</li>
              <li>Vendor preferences</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Approval</h3>
            <ul>
              <li>Auto-approve</li>
              <li>Manual review</li>
              <li>Spending limits</li>
              <li>Multi-level approval</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoReorder;
