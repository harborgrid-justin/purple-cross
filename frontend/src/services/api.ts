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

  // Medical Records endpoints
  medicalRecords = {
    getAll: (params?: { page?: number; limit?: number; patientId?: string }) =>
      this.get('/medical-records', params),
    getById: (id: string) => this.get(`/medical-records/${id}`),
    create: (data: unknown) => this.post('/medical-records', data),
    update: (id: string, data: unknown) => this.put(`/medical-records/${id}`, data),
    delete: (id: string) => this.delete(`/medical-records/${id}`),
  };

  // Prescription endpoints
  prescriptions = {
    getAll: (params?: { page?: number; limit?: number; patientId?: string }) =>
      this.get('/prescriptions', params),
    getById: (id: string) => this.get(`/prescriptions/${id}`),
    create: (data: unknown) => this.post('/prescriptions', data),
    update: (id: string, data: unknown) => this.put(`/prescriptions/${id}`, data),
    delete: (id: string) => this.delete(`/prescriptions/${id}`),
  };

  // Inventory endpoints
  inventory = {
    getAll: (params?: { page?: number; limit?: number; category?: string; lowStock?: boolean }) =>
      this.get('/inventory', params),
    getById: (id: string) => this.get(`/inventory/${id}`),
    create: (data: unknown) => this.post('/inventory', data),
    update: (id: string, data: unknown) => this.put(`/inventory/${id}`, data),
    delete: (id: string) => this.delete(`/inventory/${id}`),
  };

  // Invoice endpoints
  invoices = {
    getAll: (params?: { page?: number; limit?: number; clientId?: string; status?: string }) =>
      this.get('/invoices', params),
    getById: (id: string) => this.get(`/invoices/${id}`),
    create: (data: unknown) => this.post('/invoices', data),
    update: (id: string, data: unknown) => this.put(`/invoices/${id}`, data),
    delete: (id: string) => this.delete(`/invoices/${id}`),
  };

  // Lab Test endpoints
  labTests = {
    getAll: (params?: { page?: number; limit?: number; patientId?: string; status?: string }) =>
      this.get('/lab-tests', params),
    getById: (id: string) => this.get(`/lab-tests/${id}`),
    create: (data: unknown) => this.post('/lab-tests', data),
    update: (id: string, data: unknown) => this.put(`/lab-tests/${id}`, data),
    delete: (id: string) => this.delete(`/lab-tests/${id}`),
  };

  // Staff endpoints
  staff = {
    getAll: (params?: { page?: number; limit?: number; role?: string; status?: string }) =>
      this.get('/staff', params),
    getById: (id: string) => this.get(`/staff/${id}`),
    create: (data: unknown) => this.post('/staff', data),
    update: (id: string, data: unknown) => this.put(`/staff/${id}`, data),
    delete: (id: string) => this.delete(`/staff/${id}`),
  };

  // Communication endpoints
  communications = {
    getAll: (params?: { page?: number; limit?: number; clientId?: string; type?: string }) =>
      this.get('/communications', params),
    getById: (id: string) => this.get(`/communications/${id}`),
    create: (data: unknown) => this.post('/communications', data),
    update: (id: string, data: unknown) => this.put(`/communications/${id}`, data),
    delete: (id: string) => this.delete(`/communications/${id}`),
  };

  // Document endpoints
  documents = {
    getAll: (params?: { page?: number; limit?: number; entityType?: string; entityId?: string }) =>
      this.get('/documents', params),
    getById: (id: string) => this.get(`/documents/${id}`),
    create: (data: unknown) => this.post('/documents', data),
    update: (id: string, data: unknown) => this.put(`/documents/${id}`, data),
    delete: (id: string) => this.delete(`/documents/${id}`),
  };

  // Analytics endpoints
  analytics = {
    getDashboard: () => this.get('/analytics/dashboard'),
    getPatientDemographics: () => this.get('/analytics/patients'),
    getAppointmentAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/analytics/appointments', params),
    getFinancialReport: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/analytics/financial', params),
    getInventoryReport: () => this.get('/analytics/inventory'),
    getStaffAnalytics: () => this.get('/analytics/staff'),
  };
}

export const api = new ApiClient();
export default api;
