import { useMobileReports } from '../../hooks/useAPI';
import '../../styles/Page.css';

const MobileReporting = () => {
  const { data: reportsData, isLoading, error } = useMobileReports();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Mobile Reporting</h1>
      </header>

      <div className="content-section">
        <p>Generate and view reports on mobile devices.</p>
        
        {isLoading && <p>Loading mobile reports...</p>}
        {error && <p style={{ color: 'red' }}>Error loading reports</p>}
        {!!reportsData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Mobile reports loaded successfully.</p>
          </div>
        )}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Report Types</h3>
            <ul>
              <li>Daily summaries</li>
              <li>Patient reports</li>
              <li>Financial reports</li>
              <li>Activity logs</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Interactive charts</li>
              <li>Export options</li>
              <li>Scheduled reports</li>
              <li>Share reports</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Optimization</h3>
            <ul>
              <li>Mobile layout</li>
              <li>Touch-friendly</li>
              <li>Fast loading</li>
              <li>Offline viewing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileReporting;
