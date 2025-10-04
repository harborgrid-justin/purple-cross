import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Prescriptions = () => {
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
