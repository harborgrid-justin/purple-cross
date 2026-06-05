/**
 * WF-COMP-XXX | Receivables.tsx - Receivables
 * Purpose: Track outstanding balances (overdue invoices) and total AR
 * Dependencies: useInvoices
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useInvoices } from '../../hooks/useInvoices';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

interface ReceivableRow {
  id: string;
  invoiceNumber: string;
  total: number;
  dueDate: string;
  status: string;
  client?: { firstName: string; lastName: string };
}

const Receivables = () => {
  const { data, isLoading: loading, isError } = useInvoices({ status: 'overdue', limit: 100 });

  const invoices = (data as { data?: ReceivableRow[] } | undefined)?.data ?? [];
  const totalOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Account Receivables</h1>
        <p className="page-subtitle">Outstanding balances and overdue collections</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Overdue Invoices</div>
            <div className="stat-value">{invoices.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Outstanding</div>
            <div className="stat-value">${totalOutstanding.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading receivables...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load receivables. Please try again.</p>
          </div>
        ) : invoices.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No overdue invoices. All accounts are current.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Overdue invoices">
            <thead>
              <tr>
                <th scope="col">Invoice #</th>
                <th scope="col">Client</th>
                <th scope="col">Balance</th>
                <th scope="col">Due Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <th scope="row">{invoice.invoiceNumber}</th>
                  <td>
                    {invoice.client
                      ? `${invoice.client.firstName} ${invoice.client.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>${Number(invoice.total).toFixed(2)}</td>
                  <td>
                    <time dateTime={invoice.dueDate}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </time>
                  </td>
                  <td>
                    <Link
                      to={`/billing/${invoice.id}`}
                      className="btn-action"
                      aria-label={`View invoice ${invoice.invoiceNumber}`}
                    >
                      View
                    </Link>
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

export default Receivables;
