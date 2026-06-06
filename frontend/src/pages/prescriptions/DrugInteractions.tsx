/**
 * WF-COMP-XXX | DrugInteractions.tsx - Drug Interactions
 * Purpose: Interactive interaction checker over a static reference dataset (no backend)
 * Dependencies: react local state
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import '../../styles/Page.css';

type Severity = 'critical' | 'moderate' | 'minor';

interface InteractionRule {
  drugs: [string, string];
  severity: Severity;
  description: string;
}

// Static veterinary drug-interaction reference. Names are matched
// case-insensitively against the selected medications.
const INTERACTIONS: InteractionRule[] = [
  {
    drugs: ['ketoconazole', 'cyclosporine'],
    severity: 'critical',
    description:
      'Ketoconazole inhibits cyclosporine metabolism, raising plasma levels and toxicity risk.',
  },
  {
    drugs: ['nsaids', 'corticosteroids'],
    severity: 'critical',
    description:
      'Concurrent NSAIDs and corticosteroids markedly increase gastrointestinal ulceration risk.',
  },
  {
    drugs: ['furosemide', 'gentamicin'],
    severity: 'moderate',
    description: 'Combined use potentiates nephrotoxicity and ototoxicity.',
  },
  {
    drugs: ['digoxin', 'furosemide'],
    severity: 'moderate',
    description: 'Furosemide-induced hypokalemia increases the risk of digoxin toxicity.',
  },
  {
    drugs: ['tramadol', 'fluoxetine'],
    severity: 'critical',
    description: 'Both increase serotonin, raising the risk of serotonin syndrome.',
  },
  {
    drugs: ['metronidazole', 'phenobarbital'],
    severity: 'minor',
    description: 'Phenobarbital may modestly increase metronidazole clearance, reducing efficacy.',
  },
];

const DRUG_OPTIONS = Array.from(new Set(INTERACTIONS.flatMap((rule) => rule.drugs))).sort();

const DrugInteractions = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleDrug = (drug: string): void => {
    setSelected((prev) => (prev.includes(drug) ? prev.filter((d) => d !== drug) : [...prev, drug]));
  };

  const matches = INTERACTIONS.filter(
    (rule) => selected.includes(rule.drugs[0]) && selected.includes(rule.drugs[1])
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>Drug Interaction Checker</h1>
        <p className="page-subtitle">Select two or more medications to check for interactions</p>
      </header>

      <fieldset className="form-container">
        <legend>Select medications</legend>
        {DRUG_OPTIONS.map((drug) => (
          <div className="form-group" key={drug}>
            <label htmlFor={`drug-${drug}`}>
              <input
                id={`drug-${drug}`}
                type="checkbox"
                checked={selected.includes(drug)}
                onChange={() => toggleDrug(drug)}
              />{' '}
              {drug.charAt(0).toUpperCase() + drug.slice(1)}
            </label>
          </div>
        ))}
      </fieldset>

      <div className="table-container" aria-live="polite" role="status">
        {selected.length < 2 ? (
          <p>Select at least two medications to evaluate interactions.</p>
        ) : matches.length === 0 ? (
          <div className="alert alert-success" role="status">
            <p>No known interactions among the selected medications.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Detected interactions">
            <thead>
              <tr>
                <th scope="col">Medications</th>
                <th scope="col">Severity</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((rule) => (
                <tr key={`${rule.drugs[0]}-${rule.drugs[1]}`}>
                  <th scope="row">
                    {rule.drugs[0]} + {rule.drugs[1]}
                  </th>
                  <td>
                    <span
                      className={`status-badge status-${
                        rule.severity === 'critical'
                          ? 'cancelled'
                          : rule.severity === 'moderate'
                            ? 'warning'
                            : 'confirmed'
                      }`}
                      role="status"
                      aria-label={`Severity: ${rule.severity}`}
                    >
                      {rule.severity}
                    </span>
                  </td>
                  <td>{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DrugInteractions;
