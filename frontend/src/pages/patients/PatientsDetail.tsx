/**
 * WF-COMP-013 | PatientsDetail.tsx - Patient detail page
 * Purpose: Display detailed information for a single patient
 * Related: Patient details component, patients store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatient } from '../../hooks/usePatients';
import '../../styles/Page.css';

const PatientsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading: loading, error } = usePatient(id || '');
  const patient = (response as { data?: any })?.data;

  if (loading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error" role="alert">
          <p>Error: {error instanceof Error ? error.message : 'Failed to load patient details'}</p>
        </div>
        <Link to="/patients" className="btn-secondary">
          Back to Patients
        </Link>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Patient not found</p>
        </div>
        <Link to="/patients" className="btn-secondary">
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🐕</span> {patient.name}
        </h1>
        <div>
          <Link to={`/patients/${patient.id}/edit`} className="btn-primary">
            Edit Patient
          </Link>
          <Link to="/patients" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Basic Information</h2>
            <dl>
              <dt>Name:</dt>
              <dd>{patient.name}</dd>
              <dt>Species:</dt>
              <dd>{patient.species}</dd>
              <dt>Breed:</dt>
              <dd>{patient.breed || 'N/A'}</dd>
              {patient.dateOfBirth && (
                <>
                  <dt>Date of Birth:</dt>
                  <dd>{new Date(patient.dateOfBirth).toLocaleDateString()}</dd>
                </>
              )}
              {patient.microchipId && (
                <>
                  <dt>Microchip ID:</dt>
                  <dd>{patient.microchipId}</dd>
                </>
              )}
            </dl>
          </div>

          <div className="detail-section">
            <h2>Owner Information</h2>
            {patient.owner ? (
              <dl>
                <dt>Owner:</dt>
                <dd>
                  {patient.owner.firstName} {patient.owner.lastName}
                </dd>
                <dt>Owner ID:</dt>
                <dd>{patient.owner.id}</dd>
              </dl>
            ) : (
              <p>No owner information available</p>
            )}
          </div>

          <div className="detail-section">
            <h2>Record Information</h2>
            <dl>
              <dt>Created:</dt>
              <dd>{new Date(patient.createdAt).toLocaleDateString()}</dd>
              <dt>Last Updated:</dt>
              <dd>{new Date(patient.updatedAt).toLocaleDateString()}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsDetail;
