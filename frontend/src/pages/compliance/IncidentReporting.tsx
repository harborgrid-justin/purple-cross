import '../../styles/Page.css';

const IncidentReporting = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Incident Reporting</h1>
      </header>

      <div className="content-section">
        <p>Report and track adverse events and incidents.</p>
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
            <h3>Reporting</h3>
            <ul>
              <li>Incident forms</li>
              <li>Near miss reports</li>
              <li>Adverse events</li>
              <li>Client complaints</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Investigation</h3>
            <ul>
              <li>Root cause analysis</li>
              <li>Corrective actions</li>
              <li>Preventive measures</li>
              <li>Follow-up</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Analytics</h3>
            <ul>
              <li>Incident trends</li>
              <li>Risk areas</li>
              <li>Improvement metrics</li>
              <li>Reporting to authorities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReporting;
