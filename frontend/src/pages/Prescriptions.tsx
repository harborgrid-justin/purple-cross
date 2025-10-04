import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Page.css';

// Lazy load subfeature pages
const EPrescribing = lazy(() => import('./prescriptions/EPrescribing'));
const MedicationDatabase = lazy(() => import('./prescriptions/MedicationDatabase'));
const History = lazy(() => import('./prescriptions/History'));
const DosageCalculator = lazy(() => import('./prescriptions/DosageCalculator'));
const DrugInteractions = lazy(() => import('./prescriptions/DrugInteractions'));
const ControlledSubstances = lazy(() => import('./prescriptions/ControlledSubstances'));
const MedicationReminders = lazy(() => import('./prescriptions/MedicationReminders'));
const Compounding = lazy(() => import('./prescriptions/Compounding'));

const PrescriptionsList = () => {
  const [prescriptions] = useState([
    {
      id: '1',
      patient: 'Max',
      medication: 'Amoxicillin',
      dosage: '250mg',
      frequency: 'Twice daily',
    },
    { id: '2', patient: 'Luna', medication: 'Prednisone', dosage: '10mg', frequency: 'Once daily' },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Prescriptions list">
        <thead>
          <tr>
            <th scope="col">Patient</th>
            <th scope="col">Medication</th>
            <th scope="col">Dosage</th>
            <th scope="col">Frequency</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((rx) => (
            <tr key={rx.id}>
              <th scope="row">{rx.patient}</th>
              <td>{rx.medication}</td>
              <td>{rx.dosage}</td>
              <td>{rx.frequency}</td>
              <td>
                <button className="btn-action" aria-label={`View prescription for ${rx.patient}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Refill prescription for ${rx.patient}`}>
                  Refill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Prescriptions = () => {
  const location = useLocation();
  
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💊</span> Prescriptions
        </h1>
        <button className="btn-primary" aria-label="Create new prescription">
          + New Prescription
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Prescriptions sections">
        <Link to="/prescriptions" className={`sub-nav-link ${location.pathname === '/prescriptions' ? 'active' : ''}`}>All Prescriptions</Link>
        <Link to="/prescriptions/e-prescribing" className={`sub-nav-link ${location.pathname.includes('/e-prescribing') ? 'active' : ''}`}>E-Prescribing</Link>
        <Link to="/prescriptions/medication-database" className={`sub-nav-link ${location.pathname.includes('/medication-database') ? 'active' : ''}`}>Medication Database</Link>
        <Link to="/prescriptions/history" className={`sub-nav-link ${location.pathname.includes('/history') ? 'active' : ''}`}>History</Link>
        <Link to="/prescriptions/dosage-calculator" className={`sub-nav-link ${location.pathname.includes('/dosage-calculator') ? 'active' : ''}`}>Dosage Calculator</Link>
        <Link to="/prescriptions/drug-interactions" className={`sub-nav-link ${location.pathname.includes('/drug-interactions') ? 'active' : ''}`}>Drug Interactions</Link>
        <Link to="/prescriptions/controlled-substances" className={`sub-nav-link ${location.pathname.includes('/controlled-substances') ? 'active' : ''}`}>Controlled Substances</Link>
        <Link to="/prescriptions/reminders" className={`sub-nav-link ${location.pathname.includes('/reminders') ? 'active' : ''}`}>Reminders</Link>
        <Link to="/prescriptions/compounding" className={`sub-nav-link ${location.pathname.includes('/compounding') ? 'active' : ''}`}>Compounding</Link>
      </nav>

      <Suspense fallback={<div role="status"><p>Loading...</p></div>}>
        <Routes>
          <Route path="/" element={<PrescriptionsList />} />
          <Route path="/e-prescribing" element={<EPrescribing />} />
          <Route path="/medication-database" element={<MedicationDatabase />} />
          <Route path="/history" element={<History />} />
          <Route path="/dosage-calculator" element={<DosageCalculator />} />
          <Route path="/drug-interactions" element={<DrugInteractions />} />
          <Route path="/controlled-substances" element={<ControlledSubstances />} />
          <Route path="/reminders" element={<MedicationReminders />} />
          <Route path="/compounding" element={<Compounding />} />
        </Routes>
      </Suspense>
        <Link to="/prescriptions" className="sub-nav-link active">
          All Prescriptions
        </Link>
        <Link to="/prescriptions/e-prescribing" className="sub-nav-link">
          E-Prescribing
        </Link>
        <Link to="/prescriptions/medication-database" className="sub-nav-link">
          Medication Database
        </Link>
        <Link to="/prescriptions/history" className="sub-nav-link">
          History
        </Link>
        <Link to="/prescriptions/dosage-calculator" className="sub-nav-link">
          Dosage Calculator
        </Link>
        <Link to="/prescriptions/drug-interactions" className="sub-nav-link">
          Drug Interactions
        </Link>
        <Link to="/prescriptions/controlled-substances" className="sub-nav-link">
          Controlled Substances
        </Link>
        <Link to="/prescriptions/reminders" className="sub-nav-link">
          Reminders
        </Link>
        <Link to="/prescriptions/compounding" className="sub-nav-link">
          Compounding
        </Link>
      </nav>

      <div className="table-container">
        <table className="data-table" role="table" aria-label="Prescriptions list">
          <thead>
            <tr>
              <th scope="col">Patient</th>
              <th scope="col">Medication</th>
              <th scope="col">Dosage</th>
              <th scope="col">Frequency</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((rx) => (
              <tr key={rx.id}>
                <th scope="row">{rx.patient}</th>
                <td>{rx.medication}</td>
                <td>{rx.dosage}</td>
                <td>{rx.frequency}</td>
                <td>
                  <button className="btn-action" aria-label={`View prescription for ${rx.patient}`}>
                    View
                  </button>
                  <button
                    className="btn-action"
                    aria-label={`Refill prescription for ${rx.patient}`}
                  >
                    Refill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prescriptions;
