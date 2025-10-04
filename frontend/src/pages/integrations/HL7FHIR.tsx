import '../../styles/Page.css';

const HL7FHIR = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>HL7/FHIR Standards</h1>
      </header>

      <div className="content-section">
        <p>Healthcare interoperability standards support.</p>
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
            <h3>HL7</h3>
            <ul>
              <li>HL7 v2</li>
              <li>HL7 v3</li>
              <li>Message types</li>
              <li>Integration engine</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>FHIR</h3>
            <ul>
              <li>FHIR R4</li>
              <li>Resources</li>
              <li>REST API</li>
              <li>Bundles</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Use Cases</h3>
            <ul>
              <li>Lab results</li>
              <li>Referrals</li>
              <li>Medication orders</li>
              <li>Health records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HL7FHIR;
