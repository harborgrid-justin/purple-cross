import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const LabEquipment = () => {
  const { data, isLoading, error } = useAPIQuery('lab-tests');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Lab Equipment Management</h1>
      </header>

      <div className="content-section">
        <p>Manage laboratory equipment and maintenance.</p>
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
            <h3>Equipment</h3>
            <ul>
              <li>Analyzers</li>
              <li>Microscopes</li>
              <li>Centrifuges</li>
              <li>Incubators</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Maintenance</h3>
            <ul>
              <li>Service schedules</li>
              <li>Calibration</li>
              <li>Repairs</li>
              <li>Replacement planning</li>
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
              <li>Usage logs</li>
              <li>Maintenance logs</li>
              <li>Performance metrics</li>
              <li>Cost tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabEquipment;
