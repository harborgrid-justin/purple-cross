import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Profiles = () => {
  const { data, isLoading, error } = useAPIQuery('staff');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Employee Profiles</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive employee information management.</p>
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
            <h3>Profile Info</h3>
            <ul>
              <li>Personal information</li>
              <li>Contact details</li>
              <li>Emergency contacts</li>
              <li>Professional credentials</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Employment</h3>
            <ul>
              <li>Job title</li>
              <li>Department</li>
              <li>Start date</li>
              <li>Employment type</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Skills</h3>
            <ul>
              <li>Certifications</li>
              <li>Specialties</li>
              <li>Languages</li>
              <li>Training records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
