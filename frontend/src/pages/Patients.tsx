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
        const response: { status: string; data: Patient[] } = await api.patients.getAll({
          search: searchTerm || undefined,
          limit: 50,
        });
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
      <div className="page-header">
        <h1>🐕 Patients</h1>
        <button className="btn-primary">+ Add New Patient</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search patients by name, owner, or microchip ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading patients...</p>
        ) : patients.length === 0 ? (
          <p>No patients found. Add a new patient to get started.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Owner</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.species}</td>
                  <td>{patient.breed || 'N/A'}</td>
                  <td>
                    {patient.owner
                      ? `${patient.owner.firstName} ${patient.owner.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>{new Date(patient.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-action">View</button>
                    <button className="btn-action">Edit</button>
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
