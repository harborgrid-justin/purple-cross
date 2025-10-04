import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Feedback = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Feedback & Surveys</h1>
      </header>

      <div className="content-section">
        <p>Collect and analyze client feedback and satisfaction data.</p>
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
            <h3>Surveys</h3>
            <ul>
              <li>Visit surveys</li>
              <li>Service satisfaction</li>
              <li>NPS surveys</li>
              <li>Custom surveys</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Review Management</h3>
            <ul>
              <li>Online reviews</li>
              <li>Testimonials</li>
              <li>Rating system</li>
              <li>Response management</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Analytics</h3>
            <ul>
              <li>Satisfaction scores</li>
              <li>Trend analysis</li>
              <li>Improvement areas</li>
              <li>Benchmark comparison</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
