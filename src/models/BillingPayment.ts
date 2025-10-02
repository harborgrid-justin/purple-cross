/**
 * Billing & Payment Processing Module
 * Handles invoicing, payments, and financial transactions
 */

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  patientId?: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  balance: number;
  notes?: string;
  terms?: string;
}

export interface InvoiceItem {
  id: string;
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxable: boolean;
  total: number;
  performedBy?: string;
  performedDate?: Date;
}

export interface ServiceCode {
  code: string;
  name: string;
  description: string;
  category: string;
  defaultPrice: number;
  taxable: boolean;
  requiresNotes: boolean;
  active: boolean;
}

export interface PaymentTransaction {
  id: string;
  transactionNumber: string;
  clientId: string;
  invoiceId?: string;
  paymentDate: Date;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'debit_card' | 'ach' | 'wire' | 'other';
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4Digits?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'voided';
  processedBy: string;
  notes?: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  clientId: string;
  insuranceProvider: string;
  policyNumber: string;
  dateOfService: Date;
  claimAmount: number;
  submittedDate?: Date;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'denied' | 'partially_approved';
  approvedAmount?: number;
  denialReason?: string;
  reimbursementDate?: Date;
  items: ClaimItem[];
}

export interface ClaimItem {
  serviceCode: string;
  description: string;
  amount: number;
  approvedAmount?: number;
  denialReason?: string;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  clientId: string;
  patientId?: string;
  estimateDate: Date;
  validUntil: Date;
  status: 'draft' | 'sent' | 'approved' | 'declined' | 'converted' | 'expired';
  items: EstimateItem[];
  options: EstimateOption[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  convertedInvoiceId?: string;
}

export interface EstimateItem {
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  required: boolean;
}

export interface EstimateOption {
  id: string;
  name: string;
  description: string;
  items: EstimateItem[];
  total: number;
  recommended: boolean;
}

export interface PaymentPlan {
  id: string;
  clientId: string;
  totalAmount: number;
  downPayment: number;
  numberOfPayments: number;
  paymentAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  interestRate: number;
  startDate: Date;
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  payments: ScheduledPayment[];
  relatedInvoiceIds: string[];
}

export interface ScheduledPayment {
  id: string;
  dueDate: Date;
  amount: number;
  status: 'scheduled' | 'paid' | 'late' | 'missed';
  paidDate?: Date;
  paidAmount?: number;
  transactionId?: string;
}

export interface AccountReceivable {
  clientId: string;
  totalBalance: number;
  currentAmount: number;
  thirtyDaysAmount: number;
  sixtyDaysAmount: number;
  ninetyPlusDaysAmount: number;
  oldestInvoiceDate?: Date;
  lastPaymentDate?: Date;
  collectionStatus: 'current' | 'watch' | 'collections' | 'write_off';
}

export interface Statement {
  id: string;
  clientId: string;
  statementDate: Date;
  periodStart: Date;
  periodEnd: Date;
  previousBalance: number;
  charges: number;
  payments: number;
  adjustments: number;
  currentBalance: number;
  invoices: StatementInvoice[];
  payments: StatementPayment[];
}

export interface StatementInvoice {
  invoiceNumber: string;
  date: Date;
  amount: number;
  balance: number;
}

export interface StatementPayment {
  date: Date;
  amount: number;
  method: string;
  appliedTo: string[];
}

export interface RefundTransaction {
  id: string;
  refundNumber: string;
  clientId: string;
  originalTransactionId: string;
  refundDate: Date;
  amount: number;
  reason: string;
  method: 'original_payment_method' | 'check' | 'cash' | 'account_credit';
  status: 'pending' | 'completed' | 'failed';
  authorizedBy: string;
  processedBy?: string;
  notes?: string;
}

export interface CreditMemo {
  id: string;
  memoNumber: string;
  clientId: string;
  issueDate: Date;
  amount: number;
  reason: string;
  appliedToInvoices: string[];
  remainingCredit: number;
  expirationDate?: Date;
  authorizedBy: string;
  notes?: string;
}

export interface FinancialReport {
  reportType: 'daily_summary' | 'revenue_analysis' | 'aging_report' | 'payment_methods' | 'profitability';
  periodStart: Date;
  periodEnd: Date;
  data: Record<string, any>;
  generatedAt: Date;
  generatedBy: string;
}
