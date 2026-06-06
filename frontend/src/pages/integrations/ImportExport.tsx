/**
 * WF-COMP-XXX | ImportExport.tsx - Import Export
 * Purpose: React component for ImportExport functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientRow {
  id: string;
  name: string;
  species?: string;
  breed?: string;
}

interface ParsedImport {
  headers: string[];
  rows: string[][];
}

const triggerDownload = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const parseCsv = (text: string): ParsedImport => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  const splitLine = (line: string): string[] => line.split(',').map((cell) => cell.trim());
  const [headerLine, ...dataLines] = lines;
  return {
    headers: splitLine(headerLine),
    rows: dataLines.map(splitLine),
  };
};

const ImportExport = () => {
  const { data, isLoading, isError } = usePatients({ limit: 100 });
  const [parsed, setParsed] = useState<ParsedImport | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const patients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];

  const handleExportJson = (): void => {
    triggerDownload('patients-export.json', JSON.stringify(patients, null, 2), 'application/json');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImportError(null);
    setParsed(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = typeof reader.result === 'string' ? reader.result : '';
        const result = parseCsv(text);
        if (result.headers.length === 0) {
          setImportError('The file appears to be empty or could not be parsed.');
          return;
        }
        setParsed(result);
      } catch {
        setImportError('Failed to parse the selected file.');
      }
    };
    reader.onerror = () => setImportError('Failed to read the selected file.');
    reader.readAsText(file);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Data Import/Export</h1>
        <button
          className="btn-primary"
          onClick={handleExportJson}
          disabled={patients.length === 0}
          aria-label="Export patients as JSON"
        >
          Export Patients (JSON)
        </button>
      </header>
      <p className="page-subtitle">
        Export live patient data or preview a CSV file before importing.
      </p>

      <section className="content-section">
        <h2>Export</h2>
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading patients…</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load patients for export.</p>
          </div>
        ) : (
          <p>
            {patients.length.toLocaleString()} patient record(s) ready to export as a JSON file.
          </p>
        )}
      </section>

      <section className="content-section">
        <h2>Import (CSV Preview)</h2>
        <div className="form-group">
          <label htmlFor="import-file">Choose a CSV file</label>
          <input id="import-file" type="file" accept=".csv,text/csv" onChange={handleFileChange} />
        </div>

        {importError && (
          <div className="alert alert-error" role="alert">
            <p>{importError}</p>
          </div>
        )}

        {parsed && (
          <div className="table-container">
            <p role="status" aria-live="polite">
              Parsed {parsed.rows.length.toLocaleString()} row(s). Review before importing.
            </p>
            <table className="data-table" role="table" aria-label="CSV import preview">
              <thead>
                <tr>
                  {parsed.headers.map((header, index) => (
                    <th scope="col" key={`${header}-${index}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.rows.slice(0, 20).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ImportExport;
