/**
 * WF-COMP-XXX | Equipment.tsx - Equipment
 * Purpose: List equipment assets and schedule maintenance
 * Dependencies: useEquipment, useScheduleMaintenance
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useEquipment, useScheduleMaintenance } from '../../hooks/useEquipment';
import '../../styles/Page.css';

interface EquipmentRow {
  id: string;
  name: string;
  serialNumber?: string;
  location?: string;
  status: string;
  nextMaintenanceDate?: string;
}

const Equipment = () => {
  const { data, isLoading: loading, isError } = useEquipment({ limit: 50 });
  const scheduleMaintenance = useScheduleMaintenance();

  const equipment = (data as { data?: EquipmentRow[] } | undefined)?.data ?? [];

  const handleSchedule = (item: EquipmentRow): void => {
    scheduleMaintenance.mutate({
      equipmentId: item.id,
      scheduledDate: new Date().toISOString(),
      type: 'routine',
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Equipment &amp; Asset Management</h1>
        <p className="page-subtitle">Track assets and schedule maintenance</p>
      </header>

      {scheduleMaintenance.isError && (
        <div className="alert alert-error" role="alert">
          {scheduleMaintenance.error instanceof Error
            ? scheduleMaintenance.error.message
            : 'Failed to schedule maintenance'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading equipment...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load equipment. Please try again.</p>
          </div>
        ) : equipment.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No equipment found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Equipment">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Serial #</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
                <th scope="col">Next Maintenance</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.name}</th>
                  <td>{item.serialNumber ?? 'N/A'}</td>
                  <td>{item.location ?? 'N/A'}</td>
                  <td>
                    <span
                      className={`status-badge status-${item.status}`}
                      role="status"
                      aria-label={`Status: ${item.status}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.nextMaintenanceDate
                      ? new Date(item.nextMaintenanceDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => handleSchedule(item)}
                      disabled={scheduleMaintenance.isPending}
                      aria-label={`Schedule maintenance for ${item.name}`}
                    >
                      Schedule Maintenance
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

export default Equipment;
