import '../../styles/Page.css';

const DosageCalculator = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Dosage Calculators</h1>
      </header>

      <div className="content-section">
        <p>Calculate accurate dosages based on patient weight and condition.</p>
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
            <h3>Calculators</h3>
            <ul>
              <li>Weight-based dosing</li>
              <li>Body surface area</li>
              <li>Renal dosing</li>
              <li>Hepatic dosing</li>
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
              <li>Unit conversion</li>
              <li>Dilution calculations</li>
              <li>Infusion rates</li>
              <li>Custom formulas</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Safety</h3>
            <ul>
              <li>Max dose warnings</li>
              <li>Range checking</li>
              <li>Drug-specific rules</li>
              <li>Allergy alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosageCalculator;
