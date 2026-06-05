/**
 * WF-COMP-MOBILE-005 | MobileCreate.tsx - Create mobile page
 * Purpose: Form page for creating new mobile
 * Related: Mobile form component, mobile store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const deviceSchema = z.object({
  deviceName: z.string().min(1, 'Device name is required'),
  platform: z.string().min(1, 'Platform is required'),
  owner: z.string().min(1, 'Owner is required'),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

const PLATFORMS = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'windows', label: 'Windows' },
];

const MobileCreate: React.FC = () => {
  const [registered, setRegistered] = useState<DeviceFormData | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(deviceSchema);

  const onSubmit = (data: DeviceFormData): void => {
    setRegistered(data);
    reset();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Register New Device
        </h1>
        <Link to="/mobile" className="btn-secondary">
          Cancel
        </Link>
      </header>
      <p className="page-subtitle">Enroll a new mobile device for staff access.</p>

      {registered && (
        <div className="alert alert-success" role="status">
          <p>
            Device &ldquo;{registered.deviceName}&rdquo; ({registered.platform}) registered to{' '}
            {registered.owner}.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Device Name"
          registration={register('deviceName')}
          error={errors.deviceName}
          required
        />
        <FormField
          label="Platform"
          registration={register('platform')}
          error={errors.platform}
          options={PLATFORMS}
          required
        />
        <FormField label="Owner" registration={register('owner')} error={errors.owner} required />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Register Device
          </button>
          <Link to="/mobile" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default MobileCreate;
