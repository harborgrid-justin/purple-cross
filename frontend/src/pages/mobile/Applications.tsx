/**
 * WF-COMP-XXX | Applications.tsx - Applications
 * Purpose: React component for Applications functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const appSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  platform: z.string().min(1, 'Platform is required'),
  version: z.string().min(1, 'Version is required'),
});

type AppFormData = z.infer<typeof appSchema>;

interface MobileApp {
  id: string;
  name: string;
  platform: string;
  version: string;
  published: boolean;
}

const PLATFORMS = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Progressive Web App' },
];

const Applications = () => {
  const [apps, setApps] = useState<MobileApp[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(appSchema);

  const onSubmit = (data: AppFormData): void => {
    setApps((prev) => [
      { id: crypto.randomUUID(), published: false, ...data },
      ...prev,
    ]);
    reset();
  };

  const handleTogglePublish = (id: string): void => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, published: !app.published } : app))
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Mobile Applications</h1>
      </header>
      <p className="page-subtitle">Register and manage client-facing mobile apps.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="App Name" registration={register('name')} error={errors.name} required />
        <FormField
          label="Platform"
          registration={register('platform')}
          error={errors.platform}
          options={PLATFORMS}
          required
        />
        <FormField
          label="Version"
          registration={register('version')}
          error={errors.version}
          placeholder="1.0.0"
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Register App
          </button>
        </div>
      </form>

      <h2>Registered Apps</h2>
      <div className="table-container">
        {apps.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No mobile applications registered yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Mobile applications">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Platform</th>
                <th scope="col">Version</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id}>
                  <th scope="row">{app.name}</th>
                  <td>{app.platform}</td>
                  <td>{app.version}</td>
                  <td>
                    <span
                      className={`status-badge status-${app.published ? 'confirmed' : 'pending'}`}
                      role="status"
                    >
                      {app.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleTogglePublish(app.id)}
                      aria-label={`${app.published ? 'Unpublish' : 'Publish'} ${app.name}`}
                    >
                      {app.published ? 'Unpublish' : 'Publish'}
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

export default Applications;
