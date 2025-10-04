import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PatientRelationships = () => {
  const { data, isLoading, error } = useAPIQuery('patients');
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Relationship Mapping</h1>
      </header>

      <div className="content-section">
        <p>Track family relationships, breeding history, and pedigree information.</p>
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
            <h3>Family Trees</h3>
            <ul>
              <li>Parent relationships</li>
              <li>Sibling tracking</li>
              <li>Offspring records</li>
              <li>Multi-generation trees</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Breeding Records</h3>
            <ul>
              <li>Litter information</li>
              <li>Breeding dates</li>
              <li>Genetic lineage</li>
              <li>Registration numbers</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Pedigree</h3>
            <ul>
              <li>Championship titles</li>
              <li>Show records</li>
              <li>Certifications</li>
              <li>Genetic testing results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRelationships;
