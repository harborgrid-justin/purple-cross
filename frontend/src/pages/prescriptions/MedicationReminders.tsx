import '../../styles/Page.css';

const MedicationReminders = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Medication Reminders</h1>
      </header>

      <div className="content-section">
        <p>Automated reminders for medication administration and refills.</p>
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
            <h3>Reminders</h3>
            <ul>
              <li>Refill reminders</li>
              <li>Administration reminders</li>
              <li>Compliance alerts</li>
              <li>Follow-up reminders</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Delivery</h3>
            <ul>
              <li>Email</li>
              <li>SMS</li>
              <li>Push notifications</li>
              <li>Phone calls</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Tracking</h3>
            <ul>
              <li>Refill history</li>
              <li>Adherence rates</li>
              <li>Missed doses</li>
              <li>Response rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationReminders;
