import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PatientRegistration = () => {
  const { data, isLoading, error } = useAPIQuery('patients');
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Registration & Profiles</h1>
        <button className="btn-primary">Register New Patient</button>
      </header>

      <div className="content-section">
        <p>
          Comprehensive patient registration system with detailed profile management for all pet
          information.
        </p>
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
            <h3>Basic Information</h3>
            <ul>
              <li>Name, species, breed</li>
              <li>Date of birth, age</li>
              <li>Sex, color, markings</li>
              <li>Microchip ID</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Owner Details</h3>
            <ul>
              <li>Primary & secondary owners</li>
              <li>Contact information</li>
              <li>Emergency contacts</li>
              <li>Billing contacts</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Medical Overview</h3>
            <ul>
              <li>Allergies & sensitivities</li>
              <li>Current medications</li>
              <li>Vaccination status</li>
              <li>Medical alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
