/**
 * WF-COMP-XXX | webhooksApi.ts - Webhooks API service module
 * Purpose: Webhooks domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Webhook components and stores
 * Related: Webhook types, integrations pages
 * Exports: webhooksApi instance, types | Key Features: CRUD operations, delivery tracking, analytics
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Component request → API call → Backend → Response transformation → Component update
 * LLM Context: Domain-specific API service for webhook management and monitoring
 */

import { apiInstance } from '../config/apiConfig';
import { buildUrlParams, handleApiError, extractApiData } from '../utils/apiUtils';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookData {
  name: string;
  url: string;
  events: string[];
  active?: boolean;
}

export interface UpdateWebhookData {
  name?: string;
  url?: string;
  events?: string[];
  active?: boolean;
}

export interface WebhookFilters extends Record<string, unknown> {
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  status: string;
  statusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  attempt: number;
  maxAttempts: number;
  deliveredAt?: string;
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;
  webhook?: {
    id: string;
    name: string;
    url: string;
  };
}

export interface WebhookDeliveryFilters extends Record<string, unknown> {
  webhookId?: string;
  status?: string;
  event?: string;
  page?: number;
  limit?: number;
}

export interface WebhookStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  successRate: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// WEBHOOK API CLASS
// ==========================================

class WebhooksApi {
  private basePath = '/webhooks';

  /**
   * Get all webhooks
   */
  async getWebhooks(filters?: WebhookFilters): Promise<PaginatedResponse<Webhook>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await apiInstance.get<{
        status: string;
        data: Webhook[];
        pagination: PaginatedResponse<Webhook>['pagination'];
      }>(`${this.basePath}${params}`);

      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get webhook by ID
   */
  async getWebhookById(id: string): Promise<Webhook> {
    try {
      const response = await apiInstance.get<{ status: string; data: Webhook }>(
        `${this.basePath}/${id}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Create a new webhook
   */
  async createWebhook(data: CreateWebhookData): Promise<Webhook> {
    try {
      const response = await apiInstance.post<{ status: string; data: Webhook }>(
        this.basePath,
        data
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Update a webhook
   */
  async updateWebhook(id: string, data: UpdateWebhookData): Promise<Webhook> {
    try {
      const response = await apiInstance.put<{ status: string; data: Webhook }>(
        `${this.basePath}/${id}`,
        data
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(id: string): Promise<void> {
    try {
      await apiInstance.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Regenerate webhook secret
   */
  async regenerateSecret(id: string): Promise<Webhook> {
    try {
      const response = await apiInstance.post<{ status: string; data: Webhook }>(
        `${this.basePath}/${id}/regenerate-secret`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Test webhook delivery
   */
  async testWebhook(id: string): Promise<{ message: string; webhookId: string; url: string }> {
    try {
      const response = await apiInstance.post<{
        status: string;
        message: string;
        data: { webhookId: string; url: string };
      }>(`${this.basePath}/${id}/test`);
      return {
        message: 'Operation successful',
        ...extractApiData(response),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get webhook deliveries
   */
  async getWebhookDeliveries(
    webhookId: string,
    filters?: WebhookDeliveryFilters
  ): Promise<PaginatedResponse<WebhookDelivery>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await apiInstance.get<{
        status: string;
        data: WebhookDelivery[];
        pagination: PaginatedResponse<WebhookDelivery>['pagination'];
      }>(`${this.basePath}/${webhookId}/deliveries${params}`);

      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get all webhook deliveries (admin view)
   */
  async getAllDeliveries(filters?: WebhookDeliveryFilters): Promise<PaginatedResponse<WebhookDelivery>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await apiInstance.get<{
        status: string;
        data: WebhookDelivery[];
        pagination: PaginatedResponse<WebhookDelivery>['pagination'];
      }>(`${this.basePath}/deliveries/all${params}`);

      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get webhook delivery statistics
   */
  async getWebhookStats(webhookId: string): Promise<WebhookStats> {
    try {
      const response = await apiInstance.get<{ status: string; data: WebhookStats }>(
        `${this.basePath}/${webhookId}/stats`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get overall webhook analytics
   */
  async getWebhookAnalytics(): Promise<WebhookStats> {
    try {
      const response = await apiInstance.get<{ status: string; data: WebhookStats }>(
        `${this.basePath}/analytics`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const webhooksApi = new WebhooksApi();
