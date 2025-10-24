/**
 * WF-COMP-014 | PatientsCreate.tsx - Create patient page
 * Purpose: Form page for creating new patients
 * Related: Patient form component, TanStack Query hooks
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreatePatient } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientFormData {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  microchipId?: string;
  ownerId: string;
}

const PatientsCreate: React.FC = () => {
  const navigate = useNavigate();
  const createPatientMutation = useCreatePatient();

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    microchipId: '',
    ownerId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createPatientMutation.mutate(formData, {
      onSuccess: (response) => {
        const patientId = (response as { data?: { id?: string } })?.data?.id;
        if (patientId) {
          navigate(`/patients/${patientId}`);
        } else {
          navigate('/patients');
        }
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Create New Patient</h1>
        <p className="page-subtitle">Register a new patient in the system</p>
      </header>

      {createPatientMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createPatientMutation.error instanceof Error
            ? createPatientMutation.error.message
            : 'Failed to create patient'}
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
          <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} />
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
            disabled={createPatientMutation.isPending}
          >
            {createPatientMutation.isPending ? 'Creating...' : 'Create Patient'}
          </button>
          <Link to="/patients" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PatientsCreate;
