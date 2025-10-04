import '../../styles/Page.css';

const Dashboard = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard & KPIs</h1>
      </header>

      <div className="content-section">
        <p>Real-time dashboards with key performance indicators.</p>
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
            <h3>KPIs</h3>
            <ul>
              <li>Revenue</li>
              <li>Appointments</li>
              <li>Client satisfaction</li>
              <li>Staff productivity</li>
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
              <li>Executive dashboard</li>
              <li>Clinical dashboard</li>
              <li>Operations dashboard</li>
              <li>Custom dashboards</li>
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
              <li>Real-time data</li>
              <li>Interactive charts</li>
              <li>Drill-down</li>
              <li>Alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
