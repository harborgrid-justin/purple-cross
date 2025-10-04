import '../../styles/Page.css';

const LabReports = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Laboratory Reporting</h1>
      </header>

      <div className="content-section">
        <p>Generate comprehensive laboratory reports.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reports</h3>
            <ul>
              <li>Test results</li>
              <li>Quality metrics</li>
              <li>Turnaround times</li>
              <li>Cost analysis</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Distribution</h3>
            <ul>
              <li>Provider reports</li>
              <li>Client reports</li>
              <li>Regulatory reports</li>
              <li>Trend reports</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Analytics</h3>
            <ul>
              <li>Test utilization</li>
              <li>Revenue analysis</li>
              <li>Efficiency metrics</li>
              <li>Benchmarking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReports;
