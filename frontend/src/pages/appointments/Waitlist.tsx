import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Waitlist = () => {
  const { data, isLoading, error } = useAPIQuery('appointments');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Waitlist Management</h1>
      </header>

      <div className="content-section">
        <p>Manage cancellations and fill last-minute openings efficiently.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Waitlist Features</h3>
            <ul>
              <li>Priority ranking</li>
              <li>Auto-notification</li>
              <li>Time preferences</li>
              <li>Procedure preferences</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Add to waitlist</li>
              <li>Remove from waitlist</li>
              <li>Contact clients</li>
              <li>Fill openings</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Analytics</h3>
            <ul>
              <li>Waitlist length</li>
              <li>Fill rate</li>
              <li>Average wait time</li>
              <li>Conversion rate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
