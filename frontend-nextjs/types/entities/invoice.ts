import type { Client } from './client';

export interface Invoice {
  id: string;
  clientId: string;
  client?: Client;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  paidAmount: number;
  status: string;
  notes?: string;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateInvoiceDto {
  clientId: string;
  invoiceDate: Date;
  dueDate: Date;
  items: CreateInvoiceItemDto[];
  notes?: string;
}

export interface CreateInvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateInvoiceDto {
  invoiceDate?: Date;
  dueDate?: Date;
  status?: string;
  paidAmount?: number;
  notes?: string;
}
