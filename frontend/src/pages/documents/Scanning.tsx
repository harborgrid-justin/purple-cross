import '../../styles/Page.css';

const Scanning = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Scanning</h1>
      </header>

      <div className="content-section">
        <p>OCR and document digitization.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Scanning</h3>
            <ul>
              <li>Flatbed scanning</li>
              <li>Sheet-fed scanning</li>
              <li>Mobile scanning</li>
              <li>Batch scanning</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>OCR</h3>
            <ul>
              <li>Text recognition</li>
              <li>Searchable PDFs</li>
              <li>Data extraction</li>
              <li>Multi-language</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Processing</h3>
            <ul>
              <li>Auto-crop</li>
              <li>Deskew</li>
              <li>Enhancement</li>
              <li>Compression</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanning;
