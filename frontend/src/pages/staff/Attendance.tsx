import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Attendance = () => {
  const { data, isLoading, error } = useAPIQuery('staff');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Time & Attendance</h1>
      </header>

      <div className="content-section">
        <p>Track employee time and attendance.</p>
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
            <h3>Time Tracking</h3>
            <ul>
              <li>Clock in/out</li>
              <li>Break tracking</li>
              <li>Overtime</li>
              <li>PTO tracking</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Reporting</h3>
            <ul>
              <li>Timesheet reports</li>
              <li>Attendance reports</li>
              <li>Absence tracking</li>
              <li>Tardiness reports</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Integration</h3>
            <ul>
              <li>Payroll systems</li>
              <li>HR systems</li>
              <li>Biometric systems</li>
              <li>Mobile apps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
