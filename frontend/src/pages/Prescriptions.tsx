/**
 * WF-COMP-XXX | Prescriptions.tsx - Prescriptions
 * Purpose: React component for Prescriptions functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { usePrescriptions } from '../hooks/usePrescriptions';
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
const PrescriptionsCreate = lazy(() => import('./prescriptions/PrescriptionsCreate'));
const PrescriptionsEdit = lazy(() => import('./prescriptions/PrescriptionsEdit'));
const PrescriptionsDetail = lazy(() => import('./prescriptions/PrescriptionsDetail'));

interface Prescription {
  id: string;
  dosage: string;
  frequency: string;
  duration?: string;
  status?: string;
  patient?: { id: string; name: string };
  medication?: { id: string; name: string };
}

const PrescriptionsList = () => {
  const { data, isLoading: loading, isError } = usePrescriptions({ limit: 50 });

  const prescriptions = (data as { data?: Prescription[] } | undefined)?.data ?? [];

  return (
    <div className="table-container">
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading prescriptions...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load prescriptions. Please try again.</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No prescriptions found. Create a new prescription to get started.</p>
        </div>
      ) : (
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
                <th scope="row">{rx.patient?.name ?? 'Unknown'}</th>
                <td>{rx.medication?.name ?? 'N/A'}</td>
                <td>{rx.dosage}</td>
                <td>{rx.frequency}</td>
                <td>
                  <Link
                    to={`/prescriptions/${rx.id}/edit`}
                    className="btn-action"
                    aria-label={`Edit prescription for ${rx.patient?.name ?? 'patient'}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
        <Link to="/prescriptions/create" className="btn-primary" aria-label="Create new prescription">
          + New Prescription
        </Link>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Prescriptions sections">
        <Link
          to="/prescriptions"
          className={`sub-nav-link ${location.pathname === '/prescriptions' ? 'active' : ''}`}
        >
          All Prescriptions
        </Link>
        <Link
          to="/prescriptions/e-prescribing"
          className={`sub-nav-link ${location.pathname.includes('/e-prescribing') ? 'active' : ''}`}
        >
          E-Prescribing
        </Link>
        <Link
          to="/prescriptions/medication-database"
          className={`sub-nav-link ${location.pathname.includes('/medication-database') ? 'active' : ''}`}
        >
          Medication Database
        </Link>
        <Link
          to="/prescriptions/history"
          className={`sub-nav-link ${location.pathname.includes('/history') ? 'active' : ''}`}
        >
          History
        </Link>
        <Link
          to="/prescriptions/dosage-calculator"
          className={`sub-nav-link ${location.pathname.includes('/dosage-calculator') ? 'active' : ''}`}
        >
          Dosage Calculator
        </Link>
        <Link
          to="/prescriptions/drug-interactions"
          className={`sub-nav-link ${location.pathname.includes('/drug-interactions') ? 'active' : ''}`}
        >
          Drug Interactions
        </Link>
        <Link
          to="/prescriptions/controlled-substances"
          className={`sub-nav-link ${location.pathname.includes('/controlled-substances') ? 'active' : ''}`}
        >
          Controlled Substances
        </Link>
        <Link
          to="/prescriptions/reminders"
          className={`sub-nav-link ${location.pathname.includes('/reminders') ? 'active' : ''}`}
        >
          Reminders
        </Link>
        <Link
          to="/prescriptions/compounding"
          className={`sub-nav-link ${location.pathname.includes('/compounding') ? 'active' : ''}`}
        >
          Compounding
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<PrescriptionsList />} />
          <Route path="/create" element={<PrescriptionsCreate />} />
          <Route path="/:id/edit" element={<PrescriptionsEdit />} />
          <Route path="/e-prescribing" element={<EPrescribing />} />
          <Route path="/:id" element={<PrescriptionsDetail />} />
          <Route path="/medication-database" element={<MedicationDatabase />} />
          <Route path="/history" element={<History />} />
          <Route path="/dosage-calculator" element={<DosageCalculator />} />
          <Route path="/drug-interactions" element={<DrugInteractions />} />
          <Route path="/controlled-substances" element={<ControlledSubstances />} />
          <Route path="/reminders" element={<MedicationReminders />} />
          <Route path="/compounding" element={<Compounding />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Prescriptions;
