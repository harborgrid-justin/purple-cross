import '../../styles/Page.css';

const Operational = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Operational Reports</h1>
      </header>

      <div className="content-section">
        <p>Practice operations metrics and analysis.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Productivity</h3>
            <ul>
              <li>Appointments per day</li>
              <li>Patient visits</li>
              <li>No-show rates</li>
              <li>Wait times</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Utilization</h3>
            <ul>
              <li>Room utilization</li>
              <li>Equipment usage</li>
              <li>Staff efficiency</li>
              <li>Capacity analysis</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Quality</h3>
            <ul>
              <li>Service quality</li>
              <li>Outcomes</li>
              <li>Complications</li>
              <li>Client satisfaction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operational;
