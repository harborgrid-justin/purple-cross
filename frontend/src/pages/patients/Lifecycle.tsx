import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PatientLifecycle = () => {
  const { data, isLoading, error } = useAPIQuery('patients');
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Lifecycle Management</h1>
      </header>

      <div className="content-section">
        <p>Track patients through their entire life journey from birth to end-of-life care.</p>
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
            <h3>Life Stages</h3>
            <ul>
              <li>Pediatric care (0-1 year)</li>
              <li>Adult care (1-7 years)</li>
              <li>Senior care (7+ years)</li>
              <li>Geriatric care</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Milestones</h3>
            <ul>
              <li>Birth records</li>
              <li>Vaccination schedules</li>
              <li>Spay/neuter procedures</li>
              <li>Senior wellness checks</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>End-of-Life Care</h3>
            <ul>
              <li>Hospice planning</li>
              <li>Quality of life assessment</li>
              <li>Euthanasia considerations</li>
              <li>Memorial services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLifecycle;
