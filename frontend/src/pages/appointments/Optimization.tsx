import '../../styles/Page.css';

const Optimization = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Schedule Optimization</h1>
      </header>

      <div className="content-section">
        <p>AI-powered scheduling optimization for maximum efficiency.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Optimization</h3>
            <ul>
              <li>Auto-scheduling</li>
              <li>Gap filling</li>
              <li>Resource balancing</li>
              <li>Load distribution</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Analytics</h3>
            <ul>
              <li>Utilization rates</li>
              <li>Downtime analysis</li>
              <li>Bottlenecks</li>
              <li>Efficiency metrics</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Suggestions</h3>
            <ul>
              <li>Schedule improvements</li>
              <li>Capacity planning</li>
              <li>Staff allocation</li>
              <li>Peak time management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Optimization;
