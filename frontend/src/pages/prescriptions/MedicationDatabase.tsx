/**
 * WF-COMP-XXX | MedicationDatabase.tsx - Medication Database
 * Purpose: Searchable list of medications drawn from prescription records
 * Dependencies: usePrescriptions
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import '../../styles/Page.css';

interface MedicationRef {
  id?: string;
  name?: string;
  category?: string;
  schedule?: string;
}

interface PrescriptionWithMed {
  medication?: MedicationRef;
}

interface MedicationEntry {
  id: string;
  name: string;
  category: string;
  schedule: string;
  prescribedCount: number;
}

const MedicationDatabase = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading: loading, isError } = usePrescriptions({ limit: 200 });

  const prescriptions = (data as { data?: PrescriptionWithMed[] } | undefined)?.data ?? [];

  const medMap = new Map<string, MedicationEntry>();
  for (const rx of prescriptions) {
    const med = rx.medication;
    if (!med?.name) continue;
    const key = med.id ?? med.name;
    const existing = medMap.get(key) ?? {
      id: key,
      name: med.name,
      category: med.category ?? 'N/A',
      schedule: med.schedule ?? '—',
      prescribedCount: 0,
    };
    existing.prescribedCount += 1;
    medMap.set(key, existing);
  }

  const term = search.trim().toLowerCase();
  const medications = Array.from(medMap.values())
    .filter((m) => !term || m.name.toLowerCase().includes(term))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page">
      <header className="page-header">
        <h1>Medication Database</h1>
        <p className="page-subtitle">Medications referenced across prescriptions</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="med-search" className="sr-only">
          Search medications
        </label>
        <input
          id="med-search"
          type="search"
          placeholder="Search medications by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search medications by name"
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading medications...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load medications. Please try again.</p>
          </div>
        ) : medications.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No medications found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Medication database">
            <thead>
              <tr>
                <th scope="col">Medication</th>
                <th scope="col">Category</th>
                <th scope="col">Schedule</th>
                <th scope="col">Times Prescribed</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med.id}>
                  <th scope="row">{med.name}</th>
                  <td>{med.category}</td>
                  <td>{med.schedule}</td>
                  <td>{med.prescribedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MedicationDatabase;
