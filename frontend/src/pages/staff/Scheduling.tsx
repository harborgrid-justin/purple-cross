import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Scheduling = () => {
  const { data, isLoading, error } = useAPIQuery('staff');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Shift Scheduling</h1>
      </header>

      <div className="content-section">
        <p>Create and manage employee work schedules.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Scheduling</h3>
            <ul>
              <li>Shift creation</li>
              <li>Shift templates</li>
              <li>Recurring shifts</li>
              <li>Shift swaps</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Coverage</h3>
            <ul>
              <li>Availability</li>
              <li>Time-off requests</li>
              <li>Coverage gaps</li>
              <li>On-call schedules</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Notifications</h3>
            <ul>
              <li>Schedule changes</li>
              <li>Shift reminders</li>
              <li>Coverage alerts</li>
              <li>Overtime alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
