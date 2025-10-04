import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const History = () => {
  const { data, isLoading, error } = useAPIQuery('prescriptions');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Prescription History</h1>
      </header>

      <div className="content-section">
        <p>Complete medication history for each patient.</p>
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
            <h3>History View</h3>
            <ul>
              <li>All prescriptions</li>
              <li>Active medications</li>
              <li>Discontinued</li>
              <li>Past medications</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Details</h3>
            <ul>
              <li>Medication names</li>
              <li>Dosages</li>
              <li>Durations</li>
              <li>Prescribers</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Analysis</h3>
            <ul>
              <li>Medication trends</li>
              <li>Compliance</li>
              <li>Refill patterns</li>
              <li>Adverse events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
