import '../../styles/Page.css';

const InHouse = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>In-House Lab Testing</h1>
      </header>

      <div className="content-section">
        <p>Manage internal laboratory testing and equipment.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Testing</h3>
            <ul>
              <li>Blood chemistry</li>
              <li>Hematology</li>
              <li>Urinalysis</li>
              <li>Cytology</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Equipment</h3>
            <ul>
              <li>Analyzers</li>
              <li>Microscopes</li>
              <li>Centrifuges</li>
              <li>QC management</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Workflow</h3>
            <ul>
              <li>Sample processing</li>
              <li>Result entry</li>
              <li>Quality control</li>
              <li>Turnaround time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InHouse;
