/**
 * WF-COMP-XXX | TestCatalog.tsx - Test Catalog
 * Purpose: React component for TestCatalog functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface CatalogTestRow {
  id: string;
  testName?: string;
  testType?: string;
  labType?: string;
}

interface CatalogEntry {
  testName: string;
  testType: string;
  labType: string;
  count: number;
}

const TestCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useLabTests({ limit: 50 });

  const tests = (data as { data?: CatalogTestRow[] } | undefined)?.data ?? [];

  // Collapse raw lab-test orders into a distinct catalog keyed by test name,
  // counting how often each test has been ordered.
  const catalogMap = new Map<string, CatalogEntry>();
  for (const test of tests) {
    const name = test.testName ?? 'Unknown';
    const key = name.toLowerCase();
    const existing = catalogMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      catalogMap.set(key, {
        testName: name,
        testType: test.testType ?? 'N/A',
        labType: test.labType ?? 'N/A',
        count: 1,
      });
    }
  }
  const catalog = Array.from(catalogMap.values());

  const searchLower = searchTerm.toLowerCase();
  const filtered = searchTerm
    ? catalog.filter(
        (c) =>
          c.testName.toLowerCase().includes(searchLower) ||
          c.testType.toLowerCase().includes(searchLower)
      )
    : catalog;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Test Catalog</h1>
        <p className="page-subtitle">Distinct tests offered, by order frequency</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="catalog-search" className="sr-only">
          Search test catalog
        </label>
        <input
          id="catalog-search"
          type="search"
          placeholder="Search by test name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search test catalog"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading test catalog...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load test catalog. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No tests found in the catalog.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Test catalog">
            <thead>
              <tr>
                <th scope="col">Test Name</th>
                <th scope="col">Type</th>
                <th scope="col">Source</th>
                <th scope="col">Times Ordered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.testName}>
                  <th scope="row">{entry.testName}</th>
                  <td>{entry.testType}</td>
                  <td>{entry.labType}</td>
                  <td>{entry.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TestCatalog;
