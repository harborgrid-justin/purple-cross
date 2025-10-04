import { useHL7FHIR } from '../../hooks/useAPI';
import '../../styles/Page.css';

const HL7FHIR = () => {
  const { data: hl7Data, isLoading, error } = useHL7FHIR();

  return (
    <div className="page">
      <header className="page-header">
        <h1>HL7/FHIR Standards</h1>
      </header>

      <div className="content-section">
        <p>Healthcare interoperability standards compliance.</p>

        {isLoading && <p>Loading HL7/FHIR data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading HL7/FHIR data</p>}
        {!!hl7Data && (
          <div style={{ marginBottom: '1rem' }}>
            <p>HL7/FHIR integration data loaded.</p>
          </div>
        )}

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
            <h3>HL7 v2.x</h3>
            <ul>
              <li>Message parsing</li>
              <li>ADT messages</li>
              <li>ORM messages</li>
              <li>ORU messages</li>
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
              <li>Patient resources</li>
              <li>Observation resources</li>
              <li>Condition resources</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>Bidirectional sync</li>
              <li>Real-time updates</li>
              <li>Data validation</li>
              <li>Error handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HL7FHIR;
