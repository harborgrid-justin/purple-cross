import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Telemedicine = () => {
  const { data, isLoading, error } = useAPIQuery('communications');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Video Telemedicine</h1>
      </header>

      <div className="content-section">
        <p>Virtual consultations and remote care.</p>
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
            <h3>Video Calls</h3>
            <ul>
              <li>HD video</li>
              <li>Screen sharing</li>
              <li>Recording</li>
              <li>Virtual waiting room</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>Scheduling</li>
              <li>Payment processing</li>
              <li>E-prescribing</li>
              <li>Medical records</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Compliance</h3>
            <ul>
              <li>HIPAA compliance</li>
              <li>Consent forms</li>
              <li>Documentation</li>
              <li>Recording policies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
