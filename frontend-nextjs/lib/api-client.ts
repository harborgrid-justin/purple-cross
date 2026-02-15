import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { API_CONFIG, HTTP_HEADERS, CONTENT_TYPE } from '@/constants';

/**
 * API Client Configuration
 * Axios instance configured for NestJS backend communication
 */

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add correlation ID for request tracking
        const correlationId = uuidv4();
        config.headers.set(HTTP_HEADERS.CORRELATION_ID, correlationId);

        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.set(HTTP_HEADERS.AUTHORIZATION, `${HTTP_HEADERS.BEARER_PREFIX} ${token}`);
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - attempt to refresh token
        if (error.response?.status === 401 && originalRequest && !originalRequest.headers.get('X-Retry')) {
          try {
            const newToken = await this.refreshAuthToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.set('X-Retry', 'true');
              originalRequest.headers.set(
                HTTP_HEADERS.AUTHORIZATION,
                `${HTTP_HEADERS.BEARER_PREFIX} ${newToken}`
              );
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // Enhanced error logging
        console.error('[API Client Error]', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    // Token will be managed by NextAuth, this is a fallback
    return localStorage.getItem('token');
  }

  private async refreshAuthToken(): Promise<string | null> {
    // Token refresh will be handled by NextAuth
    // This is a placeholder for custom token refresh logic if needed
    return null;
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
