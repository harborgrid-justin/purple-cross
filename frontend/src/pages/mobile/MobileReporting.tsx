import '../../styles/Page.css';

const MobileReporting = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Mobile Reporting</h1>
      </header>

      <div className="content-section">
        <p>Access reports on mobile devices.</p>
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
              <li>Key metrics</li>
              <li>Financial reports</li>
              <li>Operational reports</li>
              <li>Custom reports</li>
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
              <li>Mobile-optimized</li>
              <li>Interactive charts</li>
              <li>Drill-down</li>
              <li>Export</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Delivery</h3>
            <ul>
              <li>Push reports</li>
              <li>Email reports</li>
              <li>Scheduled reports</li>
              <li>Alert notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileReporting;
