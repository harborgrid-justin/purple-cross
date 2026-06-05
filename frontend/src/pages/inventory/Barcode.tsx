/**
 * WF-COMP-XXX | Barcode.tsx - Barcode
 * Purpose: Scan/enter an item ID to look up inventory details
 * Dependencies: useInventoryItem
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventoryItem } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface ScannedItem {
  id?: string;
  name?: string;
  sku?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  location?: string;
}

const Barcode = () => {
  const [input, setInput] = useState('');
  const [lookupId, setLookupId] = useState('');

  const { data, isLoading: loading, isError } = useInventoryItem(lookupId);
  const item = (data as { data?: ScannedItem } | undefined)?.data;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setLookupId(input.trim());
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Barcode &amp; RFID Lookup</h1>
        <p className="page-subtitle">Scan or enter an item ID to retrieve its record</p>
      </header>

      <form onSubmit={handleSubmit} className="search-bar" role="search">
        <label htmlFor="barcode-input">Item ID / Barcode</label>
        <input
          id="barcode-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scan or type an item ID"
          aria-label="Item ID or barcode"
        />
        <button type="submit" className="btn-primary" disabled={!input.trim()}>
          Look Up
        </button>
      </form>

      {!lookupId ? (
        <div role="status" aria-live="polite">
          <p>Enter an item ID to begin.</p>
        </div>
      ) : loading ? (
        <div role="status" aria-live="polite">
          <p>Looking up item...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Lookup failed. Please verify the item ID and try again.</p>
        </div>
      ) : !item ? (
        <div className="alert alert-warning" role="alert">
          <p>No item found for ID {lookupId}.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <dt>Name</dt>
            <dd>{item.name ?? 'N/A'}</dd>
            <dt>SKU</dt>
            <dd>{item.sku ?? 'N/A'}</dd>
            <dt>Category</dt>
            <dd>{item.category ?? 'N/A'}</dd>
            <dt>Quantity</dt>
            <dd>
              {item.quantity ?? 0}
              {item.unit ? ` ${item.unit}` : ''}
            </dd>
            <dt>Location</dt>
            <dd>{item.location ?? 'N/A'}</dd>
          </dl>
          <Link to={`/inventory/${lookupId}`} className="btn-secondary">
            View Full Record
          </Link>
        </div>
      )}
    </div>
  );
};

export default Barcode;
