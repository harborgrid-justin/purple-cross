import '../../styles/Page.css';

const SearchRetrieval = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Search & Retrieval</h1>
      </header>

      <div className="content-section">
        <p>Full-text search and document retrieval.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Search</h3>
            <ul>
              <li>Full-text search</li>
              <li>Metadata search</li>
              <li>Advanced filters</li>
              <li>Boolean operators</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Auto-suggestions</li>
              <li>Spell check</li>
              <li>Synonyms</li>
              <li>Fuzzy matching</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Results</h3>
            <ul>
              <li>Relevance ranking</li>
              <li>Quick preview</li>
              <li>Highlighting</li>
              <li>Batch operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRetrieval;
