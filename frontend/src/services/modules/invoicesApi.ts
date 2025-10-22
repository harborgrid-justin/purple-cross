/**
 * WF-COMP-XXX | invoicesApi.ts - Invoices API service module
 * Purpose: Invoices domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Invoice components and stores
 * Related: Invoice types, invoices Redux slice
 * Exports: invoicesApi instance, types | Key Features: CRUD operations, validation, error handling
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Component request → API call → Backend → Response transformation → Component update
 * LLM Context: Domain-specific API service with comprehensive type safety and validation
 */

import { apiInstance } from '../config/apiConfig';
import { buildUrlParams, handleApiError, extractApiData, withRetry } from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  notes?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateInvoiceData {
  clientId: string;
  invoiceDate: string;
  dueDate: string;
  notes?: string;
  items: Omit<InvoiceItem, 'id'>[];
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  status?: string;
  paidAmount?: number;
}

export interface InvoiceFilters {
  clientId?: string;
  status?: string[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedInvoiceResponse {
  data: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvoiceStatistics {
  total: number;
  byStatus: Record<string, number>;
  totalRevenue: number;
  outstandingAmount: number;
  averageInvoiceAmount: number;
}

export interface InvoicesApi {
  // Basic CRUD operations
  getAll(filters?: InvoiceFilters): Promise<PaginatedInvoiceResponse>;
  getById(id: string): Promise<Invoice>;
  create(data: CreateInvoiceData): Promise<Invoice>;
  update(id: string, data: UpdateInvoiceData): Promise<Invoice>;
  delete(id: string): Promise<void>;

  // Advanced operations
  getStatistics(filters?: InvoiceFilters): Promise<InvoiceStatistics>;
  getByClient(clientId: string, filters?: InvoiceFilters): Promise<Invoice[]>;
  recordPayment(id: string, amount: number, paymentMethod?: string): Promise<Invoice>;
  sendInvoice(id: string, email: string): Promise<void>;
  downloadPdf(id: string): Promise<Blob>;
  search(query: string, filters?: InvoiceFilters): Promise<Invoice[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
  totalPrice: z.number().nonnegative('Total price must be non-negative'),
});

const createInvoiceSchema = z.object({
  clientId: z.string().regex(ID_REGEX, 'Invalid client ID format'),
  invoiceDate: z.string().datetime('Invalid invoice date format'),
  dueDate: z.string().datetime('Invalid due date format'),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: z.enum(['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled']).optional(),
  paidAmount: z.number().nonnegative('Paid amount must be non-negative').optional(),
});

const invoiceFiltersSchema = z.object({
  clientId: z.string().regex(ID_REGEX).optional(),
  status: z.array(z.enum(['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'])).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().nonnegative().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class InvoicesApiImpl implements InvoicesApi {
  private readonly baseEndpoint = '/invoices';
  private readonly auditResource: AuditResourceType = 'INVOICE' as AuditResourceType;

  async getAll(filters?: InvoiceFilters): Promise<PaginatedInvoiceResponse> {
    try {
      const validatedFilters = filters ? invoiceFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000,
      });

      const data = extractApiData<PaginatedInvoiceResponse>(response);

      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters: validatedFilters, count: data.data?.length || 0 },
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async getById(id: string): Promise<Invoice> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Invoice>(response);

      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async create(data: CreateInvoiceData): Promise<Invoice> {
    try {
      const validatedData = createInvoiceSchema.parse(data);

      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<Invoice>(response);

      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdItem.id,
        status: AuditStatus.SUCCESS,
        details: { created: validatedData },
      });

      return createdItem;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: 'new',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data },
      });

      throw handleApiError(error);
    }
  }

  async update(id: string, data: UpdateInvoiceData): Promise<Invoice> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const validatedData = updateInvoiceSchema.parse(data);

      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<Invoice>(response);

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData },
      });

      return updatedItem;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data },
      });

      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      await apiInstance.delete(`${this.baseEndpoint}/${id}`);

      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async getStatistics(filters?: InvoiceFilters): Promise<InvoiceStatistics> {
    try {
      const validatedFilters = filters ? invoiceFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await apiInstance.get(url);
      return extractApiData<InvoiceStatistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getByClient(clientId: string, filters?: InvoiceFilters): Promise<Invoice[]> {
    try {
      if (!ID_REGEX.test(clientId)) {
        throw new Error('Invalid client ID format');
      }

      const validatedFilters = filters ? invoiceFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, clientId });

      const response = await apiInstance.get(
        `${this.baseEndpoint}/client/${clientId}?${params.toString()}`
      );
      return extractApiData<Invoice[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async recordPayment(id: string, amount: number, paymentMethod?: string): Promise<Invoice> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.post(`${this.baseEndpoint}/${id}/payment`, {
        amount,
        paymentMethod,
      });
      const data = extractApiData<Invoice>(response);

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'payment', amount, paymentMethod },
      });

      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async sendInvoice(id: string, email: string): Promise<void> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      await apiInstance.post(`${this.baseEndpoint}/${id}/send`, { email });

      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'send', email },
      });
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw handleApiError(error);
    }
  }

  async downloadPdf(id: string): Promise<Blob> {
    try {
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await apiInstance.get(`${this.baseEndpoint}/${id}/pdf`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async search(query: string, filters?: InvoiceFilters): Promise<Invoice[]> {
    try {
      const validatedFilters = filters ? invoiceFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);

      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Invoice[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const invoicesApi: InvoicesApi = new InvoicesApiImpl();
