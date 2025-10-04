import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const AuditPrep = () => {
  const { data, isLoading, error } = useAPIQuery('compliance/audit-prep');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Audit Preparation</h1>
      </header>

      <div className="content-section">
        <p>Prepare for regulatory and compliance audits.</p>
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
            <h3>Preparation</h3>
            <ul>
              <li>Audit checklists</li>
              <li>Document gathering</li>
              <li>Mock audits</li>
              <li>Gap analysis</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Documentation</h3>
            <ul>
              <li>Compliance evidence</li>
              <li>Policy documentation</li>
              <li>Training records</li>
              <li>Audit trails</li>
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
              <li>Corrective actions</li>
              <li>Follow-up items</li>
              <li>Audit history</li>
              <li>Remediation tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPrep;
