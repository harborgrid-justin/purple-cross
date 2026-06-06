/**
 * WF-COMP-XXX | PaymentPlans.tsx - Payment Plans
 * Purpose: List active payment plans and record installment payments
 * Dependencies: usePaymentPlans, useRecordPayment
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { usePaymentPlans, useRecordPayment } from '../../hooks/usePaymentPlans';
import '../../styles/Page.css';

interface PaymentPlanRow {
  id: string;
  totalAmount: number;
  remainingBalance?: number;
  installmentAmount?: number;
  status: string;
  client?: { firstName: string; lastName: string };
}

const PaymentPlans = () => {
  const { data, isLoading: loading, isError } = usePaymentPlans({ limit: 50 });
  const recordPayment = useRecordPayment();

  const plans = (data as { data?: PaymentPlanRow[] } | undefined)?.data ?? [];

  const handleRecordPayment = (plan: PaymentPlanRow): void => {
    recordPayment.mutate({
      paymentPlanId: plan.id,
      amount: plan.installmentAmount ?? 0,
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Payment Plans</h1>
        <p className="page-subtitle">Manage installment plans and record payments</p>
      </header>

      {recordPayment.isError && (
        <div className="alert alert-error" role="alert">
          {recordPayment.error instanceof Error
            ? recordPayment.error.message
            : 'Failed to record payment'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading payment plans...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load payment plans. Please try again.</p>
          </div>
        ) : plans.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No payment plans found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Payment plans">
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Total</th>
                <th scope="col">Remaining</th>
                <th scope="col">Installment</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <th scope="row">
                    {plan.client ? `${plan.client.firstName} ${plan.client.lastName}` : 'Unknown'}
                  </th>
                  <td>${Number(plan.totalAmount).toFixed(2)}</td>
                  <td>
                    {plan.remainingBalance != null
                      ? `$${Number(plan.remainingBalance).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>
                    {plan.installmentAmount != null
                      ? `$${Number(plan.installmentAmount).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${plan.status}`}
                      role="status"
                      aria-label={`Status: ${plan.status}`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => handleRecordPayment(plan)}
                      disabled={recordPayment.isPending}
                      aria-label="Record installment payment"
                    >
                      Record Payment
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

export default PaymentPlans;
