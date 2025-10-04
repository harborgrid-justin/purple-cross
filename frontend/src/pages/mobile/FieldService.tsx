import '../../styles/Page.css';

const FieldService = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Field Service Management</h1>
      </header>

      <div className="content-section">
        <p>Tools for mobile veterinary services.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Mobile appointments</li>
              <li>GPS routing</li>
              <li>Service tracking</li>
              <li>Offline access</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Capabilities</h3>
            <ul>
              <li>Patient records</li>
              <li>Invoicing</li>
              <li>Payment processing</li>
              <li>Inventory</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Route optimization</li>
              <li>Schedule management</li>
              <li>Resource allocation</li>
              <li>Time tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldService;
