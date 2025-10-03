import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Page.css';

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

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.patients.getAll({
          search: searchTerm || undefined,
          limit: 50,
        }) as { status: string; data: Patient[] };
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
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">🐕</span> Patients</h1>
        <button className="btn-primary" aria-label="Add a new patient">
          + Add New Patient
        </button>
      </header>

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
                    <button className="btn-action" aria-label={`Edit information for ${patient.name}`}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Patients;
