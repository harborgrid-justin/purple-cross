/**
 * Invoice Entity Types
 * Aligned with backend Prisma schema
 */

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: string;
  clientId: string;
  patientId: string | null;
  invoiceNumber: string;
  issueDate: string; // ISO datetime
  dueDate: string; // ISO datetime
  subtotal: number; // Added - from backend schema
  tax: number; // Added - from backend schema
  discount: number; // Added - from backend schema
  total: number; // Total amount (replaces totalAmount)
  paidAmount: number;
  status: InvoiceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceWithDetails extends Invoice {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  patient?: {
    id: string;
    name: string;
    species: string;
  } | null;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  clientId: string;
  patientId?: string | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paidAmount?: number;
  status?: InvoiceStatus;
  notes?: string | null;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface UpdateInvoiceData {
  clientId?: string;
  patientId?: string | null;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  paidAmount?: number;
  status?: InvoiceStatus;
  notes?: string | null;
}

export interface InvoiceFilters {
  clientId?: string;
  patientId?: string;
  status?: InvoiceStatus | InvoiceStatus[];
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
