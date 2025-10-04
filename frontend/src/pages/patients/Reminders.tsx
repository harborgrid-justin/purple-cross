import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PatientReminders = () => {
  const { data, isLoading, error } = useAPIQuery('patients');
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Reminders & Alerts</h1>
        <button className="btn-primary">Create Reminder</button>
      </header>

      <div className="content-section">
        <p>Automated reminders and alerts for vaccinations, checkups, and medications.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Vaccination Reminders</h3>
            <ul>
              <li>Rabies vaccinations</li>
              <li>DHPP/FVRCP boosters</li>
              <li>Bordetella updates</li>
              <li>Custom vaccine schedules</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Appointment Reminders</h3>
            <ul>
              <li>Annual wellness exams</li>
              <li>Dental cleanings</li>
              <li>Follow-up visits</li>
              <li>Senior wellness checks</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Medication Alerts</h3>
            <ul>
              <li>Refill reminders</li>
              <li>Dosage changes</li>
              <li>Medication interactions</li>
              <li>Treatment completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReminders;
