import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Attachments = () => {
  const { data, isLoading, error } = useAPIQuery('medical-records');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Medical Attachments</h1>
      </header>

      <div className="content-section">
        <p>Attach images, documents, and files to medical records.</p>
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
            <h3>File Types</h3>
            <ul>
              <li>Images</li>
              <li>PDFs</li>
              <li>Lab reports</li>
              <li>X-rays</li>
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
              <li>Upload files</li>
              <li>Organize files</li>
              <li>Tag files</li>
              <li>Share files</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Viewing</h3>
            <ul>
              <li>Built-in viewer</li>
              <li>Annotations</li>
              <li>Zoom</li>
              <li>Compare images</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attachments;
