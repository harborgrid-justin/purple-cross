/**
 * WF-COMP-XXX | BreedInfo.tsx - Breed Info
 * Purpose: React component for BreedInfo functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useBreedInfo, useCreateBreedInfo } from '../../hooks/useBreedInfo';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

interface BreedRow {
  id: string;
  breed: string;
  species: string;
  averageLifespan?: string;
  commonConditions?: string;
}

const breedSchema = z.object({
  breed: z.string().min(1, 'Breed is required'),
  species: z.string().min(1, 'Species is required'),
  averageLifespan: z.string().optional(),
  commonConditions: z.string().optional(),
});

type BreedFormData = z.infer<typeof breedSchema>;

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((v) => ({ value: v, label: v }));

const PatientBreedInfo = () => {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError } = useBreedInfo({ limit: 100 });
  const createBreedMutation = useCreateBreedInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(breedSchema);

  const breeds = (data as { data?: BreedRow[] } | undefined)?.data ?? [];

  const onSubmit = (formData: BreedFormData): void => {
    createBreedMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Breed-Specific Information</h1>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
          aria-expanded={showForm}
        >
          {showForm ? 'Close Form' : '+ Add Breed'}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
          {createBreedMutation.isError && (
            <div className="alert alert-error" role="alert">
              {createBreedMutation.error instanceof Error
                ? createBreedMutation.error.message
                : 'Failed to add breed information'}
            </div>
          )}
          <FormField label="Breed" registration={register('breed')} error={errors.breed} required />
          <FormField
            label="Species"
            registration={register('species')}
            error={errors.species}
            options={SPECIES}
            required
          />
          <FormField
            label="Average Lifespan"
            registration={register('averageLifespan')}
            error={errors.averageLifespan}
          />
          <FormField
            label="Common Conditions"
            registration={register('commonConditions')}
            error={errors.commonConditions}
          />
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || createBreedMutation.isPending}
            >
              {createBreedMutation.isPending ? 'Saving...' : 'Save Breed'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading breed information...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load breed information. Please try again.</p>
          </div>
        ) : breeds.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No breed information found. Add a breed to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Breed information">
            <thead>
              <tr>
                <th scope="col">Breed</th>
                <th scope="col">Species</th>
                <th scope="col">Average Lifespan</th>
                <th scope="col">Common Conditions</th>
              </tr>
            </thead>
            <tbody>
              {breeds.map((breed) => (
                <tr key={breed.id}>
                  <th scope="row">{breed.breed}</th>
                  <td>{breed.species}</td>
                  <td>{breed.averageLifespan || 'N/A'}</td>
                  <td>{breed.commonConditions || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientBreedInfo;
