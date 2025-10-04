import '../../styles/Page.css';

const PatientHealthStatus = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Health Status Monitoring</h1>
      </header>

      <div className="content-section">
        <p>Real-time monitoring and tracking of patient health status, vital signs, and chronic conditions.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Vital Signs Tracking</h3>
            <ul>
              <li>Temperature monitoring</li>
              <li>Heart rate & respiratory rate</li>
              <li>Blood pressure</li>
              <li>Weight tracking</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Chronic Conditions</h3>
            <ul>
              <li>Diabetes management</li>
              <li>Heart disease tracking</li>
              <li>Kidney disease monitoring</li>
              <li>Arthritis management</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Health Alerts</h3>
            <ul>
              <li>Abnormal vital signs</li>
              <li>Medication reminders</li>
              <li>Follow-up appointments</li>
              <li>Critical health events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHealthStatus;
