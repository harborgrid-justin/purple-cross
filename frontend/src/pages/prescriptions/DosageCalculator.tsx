/**
 * WF-COMP-XXX | DosageCalculator.tsx - Dosage Calculator
 * Purpose: Interactive weight-based dosage calculator (client-side, no backend)
 * Dependencies: react local state
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import '../../styles/Page.css';

type WeightUnit = 'kg' | 'lb';

const LB_PER_KG = 2.20462;

const DosageCalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [dosePerKg, setDosePerKg] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [concentration, setConcentration] = useState('');

  const weightNum = Number(weight);
  const doseNum = Number(dosePerKg);
  const freqNum = Number(frequency);
  const concNum = Number(concentration);

  const weightKg = weightUnit === 'lb' ? weightNum / LB_PER_KG : weightNum;
  const validInputs = weightNum > 0 && doseNum > 0;

  const dosePerAdministration = validInputs ? weightKg * doseNum : 0;
  const dailyTotal = validInputs && freqNum > 0 ? dosePerAdministration * freqNum : 0;
  const volumePerDose = validInputs && concNum > 0 ? dosePerAdministration / concNum : null;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dosage Calculator</h1>
        <p className="page-subtitle">Weight-based dosing for a single patient</p>
      </header>

      <form className="form-container" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="form-group">
          <label htmlFor="weight">Patient Weight</label>
          <input
            id="weight"
            type="number"
            min={0}
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 12.5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight-unit">Weight Unit</label>
          <select
            id="weight-unit"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value === 'lb' ? 'lb' : 'kg')}
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="lb">Pounds (lb)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dose-per-kg">Dose (mg per kg)</label>
          <input
            id="dose-per-kg"
            type="number"
            min={0}
            step="0.01"
            value={dosePerKg}
            onChange={(e) => setDosePerKg(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Administrations per Day</label>
          <input
            id="frequency"
            type="number"
            min={1}
            step="1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="concentration">Concentration (mg per mL, optional)</label>
          <input
            id="concentration"
            type="number"
            min={0}
            step="0.01"
            value={concentration}
            onChange={(e) => setConcentration(e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
      </form>

      {validInputs ? (
        <div className="stats-grid" role="status" aria-live="polite">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Dose per Administration</div>
              <div className="stat-value">{dosePerAdministration.toFixed(2)} mg</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Total Daily Dose</div>
              <div className="stat-value">{dailyTotal.toFixed(2)} mg</div>
            </div>
          </div>
          {volumePerDose != null && (
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Volume per Dose</div>
                <div className="stat-value">{volumePerDose.toFixed(2)} mL</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div role="status" aria-live="polite">
          <p>Enter a positive weight and dose to calculate.</p>
        </div>
      )}
    </div>
  );
};

export default DosageCalculator;
