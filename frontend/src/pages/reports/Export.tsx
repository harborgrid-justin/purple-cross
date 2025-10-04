import '../../styles/Page.css';

const Export = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Export & Scheduling</h1>
      </header>

      <div className="content-section">
        <p>Export reports and schedule automated delivery.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Export Formats</h3>
            <ul>
              <li>PDF</li>
              <li>Excel</li>
              <li>CSV</li>
              <li>JSON</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Scheduling</h3>
            <ul>
              <li>Daily reports</li>
              <li>Weekly reports</li>
              <li>Monthly reports</li>
              <li>Custom schedules</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Distribution</h3>
            <ul>
              <li>Email delivery</li>
              <li>FTP upload</li>
              <li>Cloud storage</li>
              <li>API integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
