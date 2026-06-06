/**
 * WF-COMP-XXX | ThirdParty.tsx - Third Party
 * Purpose: React component for ThirdParty functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const thirdPartySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  apiUrl: z.string().url('Must be a valid URL'),
});

type ThirdPartyFormData = z.infer<typeof thirdPartySchema>;

interface ThirdPartyIntegration {
  id: string;
  name: string;
  category: string;
  apiUrl: string;
  enabled: boolean;
}

const CATEGORIES = [
  { value: 'lab', label: 'Laboratory' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'payment', label: 'Payment Gateway' },
  { value: 'communication', label: 'Communication' },
];

const ThirdParty = () => {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(thirdPartySchema);

  const onSubmit = (data: ThirdPartyFormData): void => {
    const integration: ThirdPartyIntegration = {
      id: crypto.randomUUID(),
      name: data.name,
      category: data.category,
      apiUrl: data.apiUrl,
      enabled: true,
    };
    setIntegrations((prev) => [integration, ...prev]);
    reset();
  };

  const handleToggle = (id: string): void => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleRemove = (id: string): void => {
    setIntegrations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Third-Party Integrations</h1>
      </header>
      <p className="page-subtitle">Register and manage external service integrations.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Name" registration={register('name')} error={errors.name} required />
        <FormField
          label="Category"
          registration={register('category')}
          error={errors.category}
          options={CATEGORIES}
          required
        />
        <FormField
          label="API URL"
          registration={register('apiUrl')}
          error={errors.apiUrl}
          placeholder="https://api.example.com"
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Integration
          </button>
        </div>
      </form>

      <h2>Registered Integrations</h2>
      <div className="table-container">
        {integrations.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No third-party integrations registered yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Third-party integrations">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">API URL</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.name}</th>
                  <td>{item.category}</td>
                  <td>{item.apiUrl}</td>
                  <td>
                    <span
                      className={`status-badge status-${item.enabled ? 'confirmed' : 'cancelled'}`}
                      role="status"
                    >
                      {item.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleToggle(item.id)}
                      aria-label={`${item.enabled ? 'Disable' : 'Enable'} ${item.name}`}
                    >
                      {item.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
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

export default ThirdParty;
