/**
 * WF-COMP-015 | PatientsEdit.tsx - Edit patient page
 * Purpose: Form page for editing existing patients
 * Related: Patient form component, TanStack Query hooks
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePatient, useUpdatePatient } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientFormData {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  microchipId?: string;
  ownerId: string;
}

const PatientsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: fetchLoading } = usePatient(id || '');
  const patient = response?.data;
  const updatePatientMutation = useUpdatePatient();

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    microchipId: '',
    ownerId: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        species: patient.species || '',
        breed: patient.breed || '',
        dateOfBirth: patient.dateOfBirth
          ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
          : '',
        microchipId: patient.microchipId || '',
        ownerId: patient.ownerId || '',
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    updatePatientMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate(`/patients/${id}`);
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading patient details...</p>
        </div>
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
        <h1>Edit Patient</h1>
        <p className="page-subtitle">Update patient information for {patient.name}</p>
      </header>

      {updatePatientMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updatePatientMutation.error instanceof Error
            ? updatePatientMutation.error.message
            : 'Failed to update patient'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="species">
            Species <span className="required">*</span>
          </label>
          <select
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">Select Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="microchipId">Microchip ID</label>
          <input
            type="text"
            id="microchipId"
            name="microchipId"
            value={formData.microchipId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ownerId">
            Owner ID <span className="required">*</span>
          </label>
          <input
            type="text"
            id="ownerId"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={updatePatientMutation.isPending}
          >
            {updatePatientMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/patients/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PatientsEdit;
