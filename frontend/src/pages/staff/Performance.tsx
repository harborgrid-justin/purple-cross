import '../../styles/Page.css';

const Performance = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Performance Management</h1>
      </header>

      <div className="content-section">
        <p>Track and manage employee performance.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Reviews</h3>
            <ul>
              <li>Performance reviews</li>
              <li>Goal setting</li>
              <li>360 feedback</li>
              <li>Self-assessments</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Metrics</h3>
            <ul>
              <li>KPIs</li>
              <li>Productivity</li>
              <li>Quality scores</li>
              <li>Client feedback</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Development</h3>
            <ul>
              <li>Performance plans</li>
              <li>Training needs</li>
              <li>Career planning</li>
              <li>Succession planning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
