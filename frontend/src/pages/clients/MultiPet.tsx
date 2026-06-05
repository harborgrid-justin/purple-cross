/**
 * WF-COMP-XXX | MultiPet.tsx - Multi Pet
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for MultiPet functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface PatientRow {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
}

const MultiPet = () => {
  const [selectedClientId, setSelectedClientId] = useState('');

  const { data: clientsData, isLoading: clientsLoading } = useClients({ limit: 100 });
  const clients = (clientsData as { data?: ClientOption[] } | undefined)?.data ?? [];

  const { data: patientsData, isLoading: patientsLoading, isError } = usePatients({
    ownerId: selectedClientId || undefined,
    limit: 100,
  });
  const pets = selectedClientId
    ? (patientsData as { data?: PatientRow[] } | undefined)?.data ?? []
    : [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Multi-Pet Household Management</h1>
        <p className="page-subtitle">View all pets registered under a single client</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="household-client" className="sr-only">
          Select a client household
        </label>
        <select
          id="household-client"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          aria-label="Select a client household"
          disabled={clientsLoading}
        >
          <option value="">Select a client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {!selectedClientId ? (
          <div role="status" aria-live="polite">
            <p>Select a client to view their household pets.</p>
          </div>
        ) : patientsLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading household pets...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load pets. Please try again.</p>
          </div>
        ) : pets.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>This client has no pets registered.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Household pets">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Species</th>
                <th scope="col">Breed</th>
                <th scope="col">Date of Birth</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <th scope="row">{pet.name}</th>
                  <td>{pet.species}</td>
                  <td>{pet.breed || 'N/A'}</td>
                  <td>
                    {pet.dateOfBirth ? (
                      <time dateTime={pet.dateOfBirth}>
                        {new Date(pet.dateOfBirth).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/patients/${pet.id}`}
                      className="btn-action"
                      aria-label={`View details for ${pet.name}`}
                    >
                      View
                    </Link>
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

export default MultiPet;
