/**
 * WF-COMP-STAFF-005 | StaffCreate.tsx - Create staff page
 * Purpose: Form page for creating new staff
 * Related: useZodForm, FormField, useCreateStaffMember
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateStaffMember } from '../../hooks/useStaff';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-staff validation: firstName, lastName, email,
// phone, role, employmentType and hireDate are required.
const staffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.string().min(1, 'Role is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

const ROLES = ['veterinarian', 'technician', 'receptionist', 'admin', 'manager'].map((v) => ({
  value: v,
  label: v,
}));
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'locum'].map((v) => ({
  value: v,
  label: v,
}));

const StaffCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateStaffMember();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(staffSchema);

  const onSubmit = (data: StaffFormData): void => {
    const payload = {
      ...data,
      specialization: data.specialization || undefined,
      licenseNumber: data.licenseNumber || undefined,
    };
    createMutation.mutate(payload, {
      onSuccess: (response) => {
        const staffId = (response as { data?: { id?: string } })?.data?.id;
        navigate(staffId ? `/staff/${staffId}` : '/staff');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👨‍⚕️</span> Create New Staff
        </h1>
        <p className="page-subtitle">Register a new staff member</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create staff member'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="First Name"
          registration={register('firstName')}
          error={errors.firstName}
          required
        />
        <FormField
          label="Last Name"
          registration={register('lastName')}
          error={errors.lastName}
          required
        />
        <FormField
          label="Email"
          type="email"
          registration={register('email')}
          error={errors.email}
          required
        />
        <FormField label="Phone" registration={register('phone')} error={errors.phone} required />
        <FormField
          label="Role"
          registration={register('role')}
          error={errors.role}
          options={ROLES}
          required
        />
        <FormField
          label="Employment Type"
          registration={register('employmentType')}
          error={errors.employmentType}
          options={EMPLOYMENT_TYPES}
          required
        />
        <FormField
          label="Hire Date"
          type="date"
          registration={register('hireDate')}
          error={errors.hireDate}
          required
        />
        <FormField
          label="Specialization"
          registration={register('specialization')}
          error={errors.specialization}
        />
        <FormField
          label="License Number"
          registration={register('licenseNumber')}
          error={errors.licenseNumber}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Staff'}
          </button>
          <Link to="/staff" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default StaffCreate;
