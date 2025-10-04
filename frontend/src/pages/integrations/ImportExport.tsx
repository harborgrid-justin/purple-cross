import '../../styles/Page.css';

const ImportExport = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Data Import/Export</h1>
      </header>

      <div className="content-section">
        <p>Bulk data import and export capabilities.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Import</h3>
            <ul>
              <li>CSV import</li>
              <li>Excel import</li>
              <li>Bulk upload</li>
              <li>Data validation</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Export</h3>
            <ul>
              <li>CSV export</li>
              <li>Excel export</li>
              <li>PDF export</li>
              <li>Custom formats</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Field mapping</li>
              <li>Data transformation</li>
              <li>Error handling</li>
              <li>Scheduling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
