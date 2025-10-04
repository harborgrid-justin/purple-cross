import { useState, useEffect, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/Page.css';

// Lazy load subfeature pages
const Registration = lazy(() => import('./patients/Registration'));
const Search = lazy(() => import('./patients/Search'));
const Demographics = lazy(() => import('./patients/Demographics'));
const HealthStatus = lazy(() => import('./patients/HealthStatus'));
const Lifecycle = lazy(() => import('./patients/Lifecycle'));
const BreedInfo = lazy(() => import('./patients/BreedInfo'));
const Relationships = lazy(() => import('./patients/Relationships'));
const Reminders = lazy(() => import('./patients/Reminders'));

interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  updatedAt: string;
}

const PatientsList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = (await api.patients.getAll({
          search: searchTerm || undefined,
          limit: 50,
        })) as { status: string; data: Patient[] };
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPatients, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <>
      <div className="search-bar" role="search">
        <label htmlFor="patient-search" className="sr-only">
          Search patients
        </label>
        <input
          id="patient-search"
          type="search"
          placeholder="Search patients by name, owner, or microchip ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search patients by name, owner, or microchip ID"
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No patients found. Add a new patient to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Patients list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Species</th>
                <th scope="col">Breed</th>
                <th scope="col">Owner</th>
                <th scope="col">Last Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <th scope="row">{patient.name}</th>
                  <td>{patient.species}</td>
                  <td>{patient.breed || 'N/A'}</td>
                  <td>
                    {patient.owner
                      ? `${patient.owner.firstName} ${patient.owner.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>
                    <time dateTime={patient.updatedAt}>
                      {new Date(patient.updatedAt).toLocaleDateString()}
                    </time>
                  </td>
                  <td>
                    <button className="btn-action" aria-label={`View details for ${patient.name}`}>
                      View
                    </button>
                    <button
                      className="btn-action"
                      aria-label={`Edit information for ${patient.name}`}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const Patients = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🐕</span> Patients
        </h1>
        <button className="btn-primary" aria-label="Add a new patient">
          + Add New Patient
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Patient sections">
        <Link
          to="/patients"
          className={`sub-nav-link ${location.pathname === '/patients' ? 'active' : ''}`}
        >
          All Patients
        </Link>
        <Link
          to="/patients/registration"
          className={`sub-nav-link ${location.pathname.includes('/registration') ? 'active' : ''}`}
        >
          Registration & Profiles
        </Link>
        <Link
          to="/patients/search"
          className={`sub-nav-link ${location.pathname.includes('/search') ? 'active' : ''}`}
        >
          Search & Filtering
        </Link>
        <Link
          to="/patients/demographics"
          className={`sub-nav-link ${location.pathname.includes('/demographics') ? 'active' : ''}`}
        >
          Demographics
        </Link>
        <Link
          to="/patients/health-status"
          className={`sub-nav-link ${location.pathname.includes('/health-status') ? 'active' : ''}`}
        >
          Health Status
        </Link>
        <Link
          to="/patients/lifecycle"
          className={`sub-nav-link ${location.pathname.includes('/lifecycle') ? 'active' : ''}`}
        >
          Lifecycle Management
        </Link>
        <Link
          to="/patients/breed-info"
          className={`sub-nav-link ${location.pathname.includes('/breed-info') ? 'active' : ''}`}
        >
          Breed Information
        </Link>
        <Link
          to="/patients/relationships"
          className={`sub-nav-link ${location.pathname.includes('/relationships') ? 'active' : ''}`}
        >
          Relationship Mapping
        </Link>
        <Link
          to="/patients/reminders"
          className={`sub-nav-link ${location.pathname.includes('/reminders') ? 'active' : ''}`}
        >
          Reminders & Alerts
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
          <Route path="/" element={<PatientsList />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/search" element={<Search />} />
          <Route path="/demographics" element={<Demographics />} />
          <Route path="/health-status" element={<HealthStatus />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/breed-info" element={<BreedInfo />} />
          <Route path="/relationships" element={<Relationships />} />
          <Route path="/reminders" element={<Reminders />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Patients;
