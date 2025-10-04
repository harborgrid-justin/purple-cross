import '../../styles/Page.css';

const DrugInteractions = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Drug Interaction Alerts</h1>
      </header>

      <div className="content-section">
        <p>Real-time alerts for potential drug interactions.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Interactions</h3>
            <ul>
              <li>Drug-drug</li>
              <li>Drug-food</li>
              <li>Drug-condition</li>
              <li>Drug-allergy</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Severity</h3>
            <ul>
              <li>Critical</li>
              <li>Moderate</li>
              <li>Minor</li>
              <li>Informational</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Override options</li>
              <li>Documentation</li>
              <li>Alternative suggestions</li>
              <li>Reference materials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugInteractions;
