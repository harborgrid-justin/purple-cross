import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const TreatmentHistory = () => {
  const { data, isLoading, error } = useAPIQuery('medical-records');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Treatment History</h1>
      </header>

      <div className="content-section">
        <p>Complete historical record of all treatments provided.</p>
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
            <h3>History Tracking</h3>
            <ul>
              <li>All treatments</li>
              <li>Chronological view</li>
              <li>Provider notes</li>
              <li>Outcomes</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Search</h3>
            <ul>
              <li>By date range</li>
              <li>By procedure</li>
              <li>By provider</li>
              <li>By condition</li>
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
              <li>Treatment effectiveness</li>
              <li>Recurring issues</li>
              <li>Treatment plans</li>
              <li>Follow-up needs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentHistory;
