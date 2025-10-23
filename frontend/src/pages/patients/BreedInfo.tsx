/**
 * WF-COMP-XXX | BreedInfo.tsx - Breed Info
 * Purpose: React component for BreedInfo functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import '../../styles/Page.css';

const PatientBreedInfo = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Breed-Specific Information</h1>
      </header>

      <div className="content-section">
        <p>Access breed-specific health information, common conditions, and care guidelines.</p>
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
            <h3>Common Conditions</h3>
            <ul>
              <li>Breed-specific diseases</li>
              <li>Genetic predispositions</li>
              <li>Hereditary conditions</li>
              <li>Congenital defects</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Care Guidelines</h3>
            <ul>
              <li>Nutrition recommendations</li>
              <li>Exercise requirements</li>
              <li>Grooming needs</li>
              <li>Behavioral traits</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Breed Database</h3>
            <ul>
              <li>500+ dog breeds</li>
              <li>100+ cat breeds</li>
              <li>Exotic species</li>
              <li>Mixed breed profiles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBreedInfo;
