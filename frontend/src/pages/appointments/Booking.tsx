import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Booking = () => {
  const { data, isLoading, error } = useAPIQuery('appointments');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Appointment Booking</h1>
      </header>

      <div className="content-section">
        <p>Quick and easy appointment scheduling for clients and staff.</p>
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

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
            <h3>Booking Options</h3>
            <ul>
              <li>Online booking</li>
              <li>Phone booking</li>
              <li>Walk-in booking</li>
              <li>Mobile booking</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Availability</h3>
            <ul>
              <li>Real-time availability</li>
              <li>Provider schedules</li>
              <li>Room availability</li>
              <li>Equipment availability</li>
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
              <li>Email confirmation</li>
              <li>SMS confirmation</li>
              <li>Calendar invites</li>
              <li>Reminder setup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
