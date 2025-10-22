/**
 * WF-COMP-XXX | BaseApiService.ts - Base API service abstract class
 * Purpose: Provides reusable CRUD patterns for all API modules
 * Dependencies: axios, zod
 * Exports: BaseApiService class, interfaces
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosInstance } from 'axios';
import { ZodSchema } from 'zod';
import {
  PaginatedResponse,
  handleApiError,
  extractApiData,
  buildUrlParams,
} from '../utils/apiUtils';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams extends PaginationParams {
  [key: string]: unknown;
}

export interface CrudOperations<T extends BaseEntity, TCreate, TUpdate = Partial<TCreate>> {
  getAll(filters?: FilterParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

// ==========================================
// BASE API SERVICE CLASS
// ==========================================

export abstract class BaseApiService<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>,
> implements CrudOperations<TEntity, TCreateDto, TUpdateDto>
{
  protected client: AxiosInstance;
  protected baseEndpoint: string;
  protected createSchema?: ZodSchema<TCreateDto>;
  protected updateSchema?: ZodSchema<TUpdateDto>;

  constructor(
    client: AxiosInstance,
    baseEndpoint: string,
    options?: {
      createSchema?: ZodSchema<TCreateDto>;
      updateSchema?: ZodSchema<TUpdateDto>;
    }
  ) {
    this.client = client;
    this.baseEndpoint = baseEndpoint;
    this.createSchema = options?.createSchema;
    this.updateSchema = options?.updateSchema;
  }

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  /**
   * Get all entities with optional filters
   */
  async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    try {
      const params = buildUrlParams(filters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await this.client.get(url);
      return extractApiData<PaginatedResponse<TEntity>>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get a single entity by ID
   */
  async getById(id: string): Promise<TEntity> {
    try {
      const response = await this.client.get(`${this.baseEndpoint}/${id}`);
      return extractApiData<TEntity>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Create a new entity
   */
  async create(data: TCreateDto): Promise<TEntity> {
    try {
      // Validate input if schema provided
      const validatedData = this.createSchema ? this.createSchema.parse(data) : data;

      const response = await this.client.post(this.baseEndpoint, validatedData);
      return extractApiData<TEntity>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Update an existing entity
   */
  async update(id: string, data: TUpdateDto): Promise<TEntity> {
    try {
      // Validate input if schema provided
      const validatedData = this.updateSchema ? this.updateSchema.parse(data) : data;

      const response = await this.client.put(`${this.baseEndpoint}/${id}`, validatedData);
      return extractApiData<TEntity>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete an entity
   */
  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Build URL with path
   */
  protected buildUrl(path: string): string {
    return `${this.baseEndpoint}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * Make a GET request
   */
  protected async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const queryParams = buildUrlParams(params);
      const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;

      const response = await this.client.get(fullUrl);
      return extractApiData<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a POST request
   */
  protected async post<T>(path: string, data?: unknown): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const response = await this.client.post(url, data);
      return extractApiData<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PUT request
   */
  protected async put<T>(path: string, data?: unknown): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const response = await this.client.put(url, data);
      return extractApiData<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PATCH request
   */
  protected async patch<T>(path: string, data?: unknown): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const response = await this.client.patch(url, data);
      return extractApiData<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  protected async deleteRequest<T>(path: string): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const response = await this.client.delete(url);
      return extractApiData<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
