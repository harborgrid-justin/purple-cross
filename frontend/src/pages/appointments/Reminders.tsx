import '../../styles/Page.css';

const Reminders = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Reminder System</h1>
      </header>

      <div className="content-section">
        <p>Automated appointment reminders to reduce no-shows.</p>
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
            <h3>Reminder Types</h3>
            <ul>
              <li>Email reminders</li>
              <li>SMS reminders</li>
              <li>Phone call reminders</li>
              <li>Push notifications</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Timing</h3>
            <ul>
              <li>24-hour reminders</li>
              <li>1-week reminders</li>
              <li>Custom timing</li>
              <li>Multiple reminders</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Confirmation</h3>
            <ul>
              <li>Confirm attendance</li>
              <li>Request reschedule</li>
              <li>One-click confirmation</li>
              <li>Response tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
