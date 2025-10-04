import '../../styles/Page.css';

const PatientDemographics = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Demographics</h1>
        <button className="btn-primary">Generate Report</button>
      </header>

      <div className="content-section">
        <p>Statistical analysis and demographic breakdowns of patient population.</p>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🐕</span>
            <div className="stat-content">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">1,247</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🐱</span>
            <div className="stat-content">
              <div className="stat-label">Cats</div>
              <div className="stat-value">523</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🐶</span>
            <div className="stat-content">
              <div className="stat-label">Dogs</div>
              <div className="stat-value">642</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🐾</span>
            <div className="stat-content">
              <div className="stat-label">Other Species</div>
              <div className="stat-value">82</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDemographics;
