import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, params?: Record<string, unknown>) {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown) {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown) {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown) {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Patient endpoints
  patients = {
    getAll: (params?: { page?: number; limit?: number; search?: string; ownerId?: string }) =>
      this.get('/patients', params),
    getById: (id: string) => this.get(`/patients/${id}`),
    create: (data: unknown) => this.post('/patients', data),
    update: (id: string, data: unknown) => this.put(`/patients/${id}`, data),
    delete: (id: string) => this.delete(`/patients/${id}`),
  };

  // Client endpoints
  clients = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      this.get('/clients', params),
    getById: (id: string) => this.get(`/clients/${id}`),
    create: (data: unknown) => this.post('/clients', data),
    update: (id: string, data: unknown) => this.put(`/clients/${id}`, data),
    delete: (id: string) => this.delete(`/clients/${id}`),
  };

  // Appointment endpoints
  appointments = {
    getAll: (params?: { page?: number; limit?: number; date?: string }) =>
      this.get('/appointments', params),
    getById: (id: string) => this.get(`/appointments/${id}`),
    create: (data: unknown) => this.post('/appointments', data),
    update: (id: string, data: unknown) => this.put(`/appointments/${id}`, data),
    delete: (id: string) => this.delete(`/appointments/${id}`),
  };
}

export const api = new ApiClient();
export default api;
