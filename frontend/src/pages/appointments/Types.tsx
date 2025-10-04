import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Types = () => {
  const { data, isLoading, error } = useAPIQuery('appointments');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Appointment Types & Duration</h1>
      </header>

      <div className="content-section">
        <p>Define and manage different appointment types and their durations.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Appointment Types</h3>
            <ul>
              <li>Wellness exams</li>
              <li>Sick visits</li>
              <li>Surgery</li>
              <li>Dental cleaning</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Duration Settings</h3>
            <ul>
              <li>Standard durations</li>
              <li>Custom durations</li>
              <li>Buffer time</li>
              <li>Cleanup time</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Resource Requirements</h3>
            <ul>
              <li>Staff requirements</li>
              <li>Equipment needed</li>
              <li>Room type</li>
              <li>Special preparations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Types;
