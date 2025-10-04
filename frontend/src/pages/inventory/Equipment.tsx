import '../../styles/Page.css';

const Equipment = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Equipment & Asset Management</h1>
      </header>

      <div className="content-section">
        <p>Manage medical equipment and practice assets.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Asset Tracking</h3>
            <ul>
              <li>Equipment inventory</li>
              <li>Location tracking</li>
              <li>Condition status</li>
              <li>Asset tagging</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Maintenance</h3>
            <ul>
              <li>Service schedules</li>
              <li>Maintenance logs</li>
              <li>Repair tracking</li>
              <li>Warranty management</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Depreciation</h3>
            <ul>
              <li>Asset value</li>
              <li>Depreciation schedules</li>
              <li>Replacement planning</li>
              <li>Capital budgeting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
