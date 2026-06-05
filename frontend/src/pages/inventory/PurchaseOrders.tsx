/**
 * WF-COMP-XXX | PurchaseOrders.tsx - Purchase Orders
 * Purpose: List purchase orders and approve, receive, or cancel them
 * Dependencies: usePurchaseOrders, useApprovePurchaseOrder, useReceivePurchaseOrderItems, useCancelPurchaseOrder
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import {
  usePurchaseOrders,
  useApprovePurchaseOrder,
  useReceivePurchaseOrderItems,
  useCancelPurchaseOrder,
} from '../../hooks/usePurchaseOrders';
import '../../styles/Page.css';

interface PurchaseOrderRow {
  id: string;
  orderNumber?: string;
  supplier?: string;
  totalAmount?: number;
  status: string;
  items?: Array<{ id: string; quantity: number }>;
}

const PurchaseOrders = () => {
  const { data, isLoading: loading, isError } = usePurchaseOrders({ limit: 50 });
  const approve = useApprovePurchaseOrder();
  const receive = useReceivePurchaseOrderItems();
  const cancel = useCancelPurchaseOrder();

  const orders = (data as { data?: PurchaseOrderRow[] } | undefined)?.data ?? [];
  const busy = approve.isPending || receive.isPending || cancel.isPending;
  const actionError = approve.error || receive.error || cancel.error;
  const hasError = approve.isError || receive.isError || cancel.isError;

  const handleReceive = (order: PurchaseOrderRow): void => {
    const itemsData = {
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        quantityReceived: item.quantity,
      })),
    };
    receive.mutate({ id: order.id, itemsData });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Purchase Order Management</h1>
        <p className="page-subtitle">Approve, receive, and cancel purchase orders</p>
      </header>

      {hasError && (
        <div className="alert alert-error" role="alert">
          {actionError instanceof Error ? actionError.message : 'Action failed. Please try again.'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading purchase orders...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load purchase orders. Please try again.</p>
          </div>
        ) : orders.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No purchase orders found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Purchase orders">
            <thead>
              <tr>
                <th scope="col">Order #</th>
                <th scope="col">Supplier</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <th scope="row">{order.orderNumber ?? order.id.slice(0, 8)}</th>
                  <td>{order.supplier ?? 'N/A'}</td>
                  <td>
                    {order.totalAmount != null
                      ? `$${Number(order.totalAmount).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${order.status}`}
                      role="status"
                      aria-label={`Status: ${order.status}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => approve.mutate(order.id)}
                      disabled={busy}
                      aria-label="Approve purchase order"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => handleReceive(order)}
                      disabled={busy}
                      aria-label="Receive items for purchase order"
                    >
                      Receive
                    </button>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => cancel.mutate(order.id)}
                      disabled={busy}
                      aria-label="Cancel purchase order"
                    >
                      Cancel
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

export default PurchaseOrders;
