import '../../styles/Page.css';

const CalendarManagement = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Calendar Management</h1>
      </header>

      <div className="content-section">
        <p>Centralized calendar system for all appointments and events.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Calendar Views</h3>
            <ul>
              <li>Day view</li>
              <li>Week view</li>
              <li>Month view</li>
              <li>Provider view</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Scheduling</h3>
            <ul>
              <li>Drag-and-drop</li>
              <li>Quick reschedule</li>
              <li>Bulk operations</li>
              <li>Recurring appointments</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Integration</h3>
            <ul>
              <li>Google Calendar</li>
              <li>Outlook Calendar</li>
              <li>Apple Calendar</li>
              <li>iCal sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;
