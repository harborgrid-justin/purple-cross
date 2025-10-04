import '../../styles/Page.css';

const Education = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Continuing Education</h1>
      </header>

      <div className="content-section">
        <p>Track CE credits and professional development.</p>
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
            <h3>CE Management</h3>
            <ul>
              <li>Credit tracking</li>
              <li>License requirements</li>
              <li>Renewal deadlines</li>
              <li>Course catalog</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Learning</h3>
            <ul>
              <li>Online courses</li>
              <li>Webinars</li>
              <li>Conferences</li>
              <li>In-house training</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Compliance</h3>
            <ul>
              <li>State requirements</li>
              <li>Professional associations</li>
              <li>Specialty certifications</li>
              <li>Documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
