import '../../styles/Page.css';

const Clinical = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Clinical Analytics</h1>
      </header>

      <div className="content-section">
        <p>Medical outcomes and clinical performance metrics.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Outcomes</h3>
            <ul>
              <li>Treatment success rates</li>
              <li>Complication rates</li>
              <li>Mortality rates</li>
              <li>Readmission rates</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Quality</h3>
            <ul>
              <li>Protocol compliance</li>
              <li>Best practices</li>
              <li>Clinical guidelines</li>
              <li>Evidence-based care</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Benchmarking</h3>
            <ul>
              <li>Industry benchmarks</li>
              <li>Peer comparisons</li>
              <li>Best performers</li>
              <li>Quality scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clinical;
