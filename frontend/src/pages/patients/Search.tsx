import '../../styles/Page.css';

const PatientSearch = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Search & Filtering</h1>
      </header>

      <div className="content-section">
        <p>Advanced search and filtering capabilities to quickly locate patient records.</p>
        <div className="search-bar" role="search" style={{ marginBottom: '2rem' }}>
          <input type="search" placeholder="Search by name, microchip, owner, or species..." style={{ flex: 1 }} />
          <button className="btn-secondary">Advanced Filters</button>
        </div>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Search Options</h3>
            <ul>
              <li>Name & microchip search</li>
              <li>Species & breed filters</li>
              <li>Owner name search</li>
              <li>Age range filters</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Advanced Filters</h3>
            <ul>
              <li>Medical condition filters</li>
              <li>Vaccination status</li>
              <li>Last visit date range</li>
              <li>Active/inactive status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSearch;
