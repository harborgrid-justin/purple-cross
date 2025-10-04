import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const VitalSigns = () => {
  const { data, isLoading, error } = useAPIQuery('medical-records');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Vital Signs Recording</h1>
      </header>

      <div className="content-section">
        <p>Record and monitor patient vital signs over time.</p>
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
            <h3>Vital Signs</h3>
            <ul>
              <li>Temperature</li>
              <li>Heart rate</li>
              <li>Respiratory rate</li>
              <li>Blood pressure</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Tracking</h3>
            <ul>
              <li>Trend charts</li>
              <li>Alert thresholds</li>
              <li>Historical data</li>
              <li>Comparisons</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Monitoring</h3>
            <ul>
              <li>Real-time alerts</li>
              <li>Abnormal values</li>
              <li>Baseline comparisons</li>
              <li>Critical values</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalSigns;
