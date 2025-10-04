import { useState } from 'react';
import '../../styles/Page.css';

const ImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Data Import/Export</h1>
      </header>

      <div className="content-section">
        <p>Import and export data in various formats.</p>

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Import</h3>
            <ul>
              <li>CSV files</li>
              <li>Excel files</li>
              <li>JSON format</li>
              <li>XML format</li>
            </ul>
            <button 
              className="btn-primary" 
              style={{ marginTop: '0.5rem' }}
              onClick={() => setImporting(true)}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import Data'}
            </button>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Export</h3>
            <ul>
              <li>CSV format</li>
              <li>Excel format</li>
              <li>PDF reports</li>
              <li>JSON format</li>
            </ul>
            <button 
              className="btn-primary" 
              style={{ marginTop: '0.5rem' }}
              onClick={() => setExporting(true)}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Data validation</li>
              <li>Error handling</li>
              <li>Progress tracking</li>
              <li>Scheduled exports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
