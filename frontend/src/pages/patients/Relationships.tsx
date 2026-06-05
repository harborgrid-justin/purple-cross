/**
 * WF-COMP-XXX | Relationships.tsx - Relationships
 * Purpose: React component for Relationships functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import {
  usePatientRelationships,
  useCreatePatientRelationship,
  useDeletePatientRelationship,
} from '../../hooks/usePatientRelationships';
import '../../styles/Page.css';

interface PatientOption {
  id: string;
  name: string;
  species: string;
}

interface RelationshipRow {
  id: string;
  relationshipType: string;
  relatedPatientId: string;
  relatedPatient?: { id: string; name: string; species: string };
}

const RELATIONSHIP_TYPES = ['parent', 'offspring', 'sibling', 'mate'];

const PatientRelationships = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [relatedPatientId, setRelatedPatientId] = useState('');
  const [relationshipType, setRelationshipType] = useState('sibling');

  const { data: patientsData, isLoading: patientsLoading } = usePatients({ limit: 100 });
  const patients = (patientsData as { data?: PatientOption[] } | undefined)?.data ?? [];

  const {
    data: relationshipsData,
    isLoading: relLoading,
    isError: relError,
  } = usePatientRelationships(selectedPatientId);
  const relationships =
    (relationshipsData as { data?: RelationshipRow[] } | undefined)?.data ?? [];

  const createRelationship = useCreatePatientRelationship();
  const deleteRelationship = useDeletePatientRelationship();

  const handleAdd = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!selectedPatientId || !relatedPatientId) return;
    createRelationship.mutate(
      { patientId: selectedPatientId, relatedPatientId, relationshipType },
      {
        onSuccess: () => {
          setRelatedPatientId('');
        },
      }
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Relationship Mapping</h1>
        <p className="page-subtitle">Map family ties and breeding lineage between patients</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="patient-select" className="sr-only">
          Select a patient
        </label>
        <select
          id="patient-select"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          aria-label="Select a patient to view relationships"
          disabled={patientsLoading}
        >
          <option value="">Select a patient...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.species})
            </option>
          ))}
        </select>
      </div>

      {selectedPatientId && (
        <form onSubmit={handleAdd} className="form-container" noValidate>
          {createRelationship.isError && (
            <div className="alert alert-error" role="alert">
              {createRelationship.error instanceof Error
                ? createRelationship.error.message
                : 'Failed to add relationship'}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="related-patient">
              Related Patient <span className="required"> *</span>
            </label>
            <select
              id="related-patient"
              value={relatedPatientId}
              onChange={(e) => setRelatedPatientId(e.target.value)}
              required
              aria-required="true"
            >
              <option value="">Select related patient...</option>
              {patients
                .filter((p) => p.id !== selectedPatientId)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="relationship-type">
              Relationship Type <span className="required"> *</span>
            </label>
            <select
              id="relationship-type"
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              required
              aria-required="true"
            >
              {RELATIONSHIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={createRelationship.isPending || !relatedPatientId}
            >
              {createRelationship.isPending ? 'Adding...' : 'Add Relationship'}
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        {!selectedPatientId ? (
          <div role="status" aria-live="polite">
            <p>Select a patient to view their relationships.</p>
          </div>
        ) : relLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading relationships...</p>
          </div>
        ) : relError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load relationships. Please try again.</p>
          </div>
        ) : relationships.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No relationships recorded for this patient yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Patient relationships">
            <thead>
              <tr>
                <th scope="col">Related Patient</th>
                <th scope="col">Species</th>
                <th scope="col">Relationship</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((rel) => (
                <tr key={rel.id}>
                  <th scope="row">{rel.relatedPatient?.name ?? rel.relatedPatientId}</th>
                  <td>{rel.relatedPatient?.species ?? 'N/A'}</td>
                  <td>{rel.relationshipType}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => deleteRelationship.mutate(rel.id)}
                      disabled={deleteRelationship.isPending}
                      aria-label={`Remove relationship with ${rel.relatedPatient?.name ?? 'patient'}`}
                    >
                      Remove
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

export default PatientRelationships;
