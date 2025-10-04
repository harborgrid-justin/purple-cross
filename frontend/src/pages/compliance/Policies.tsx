import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Policies = () => {
  const { data, isLoading, error } = useAPIQuery('compliance/policies');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Policy Management</h1>
      </header>

      <div className="content-section">
        <p>Manage practice policies and procedures.</p>
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
            <h3>Policies</h3>
            <ul>
              <li>Clinical policies</li>
              <li>Administrative policies</li>
              <li>Safety policies</li>
              <li>HR policies</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>Version control</li>
              <li>Review schedules</li>
              <li>Approvals</li>
              <li>Distribution</li>
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
              <li>Staff acknowledgment</li>
              <li>Training</li>
              <li>Updates</li>
              <li>Audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
