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

  // Reporting endpoints
  reports = {
    getAll: (params?: { page?: number; limit?: number; type?: string }) =>
      this.get('/reports', params),
    getById: (id: string) => this.get(`/reports/${id}`),
    create: (data: unknown) => this.post('/reports', data),
    update: (id: string, data: unknown) => this.put(`/reports/${id}`, data),
    delete: (id: string) => this.delete(`/reports/${id}`),
    getClinical: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/reports/clinical', params),
    getFinancial: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/reports/financial', params),
    getOperational: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/reports/operational', params),
    getClientAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/reports/client-analytics', params),
    getTrends: (params?: { metric?: string; period?: string }) =>
      this.get('/reports/trends', params),
    export: (id: string, format: string) => this.get(`/reports/${id}/export`, { format }),
  };

  // Compliance endpoints
  compliance = {
    getHIPAA: (params?: { page?: number; limit?: number }) => this.get('/compliance/hipaa', params),
    getLicenses: (params?: { page?: number; limit?: number; status?: string }) =>
      this.get('/compliance/licenses', params),
    getControlledSubstances: (params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    }) => this.get('/compliance/controlled-substances', params),
    getRecordRetention: () => this.get('/compliance/record-retention'),
    getIncidents: (params?: { page?: number; limit?: number; severity?: string }) =>
      this.get('/compliance/incidents', params),
    createIncident: (data: unknown) => this.post('/compliance/incidents', data),
    getPolicies: (params?: { page?: number; limit?: number; category?: string }) =>
      this.get('/compliance/policies', params),
    getAuditPrep: () => this.get('/compliance/audit-prep'),
    getRegulatoryUpdates: (params?: { page?: number; limit?: number }) =>
      this.get('/compliance/regulatory-updates', params),
  };

  // Integration endpoints
  integrations = {
    getAll: (params?: { page?: number; limit?: number; type?: string; status?: string }) =>
      this.get('/integrations', params),
    getById: (id: string) => this.get(`/integrations/${id}`),
    create: (data: unknown) => this.post('/integrations', data),
    update: (id: string, data: unknown) => this.put(`/integrations/${id}`, data),
    delete: (id: string) => this.delete(`/integrations/${id}`),
    getThirdParty: (params?: { page?: number; limit?: number }) =>
      this.get('/integrations/third-party', params),
    getAPIKeys: (params?: { page?: number; limit?: number }) =>
      this.get('/integrations/api-keys', params),
    createAPIKey: (data: unknown) => this.post('/integrations/api-keys', data),
    revokeAPIKey: (id: string) => this.delete(`/integrations/api-keys/${id}`),
    getWebhooks: (params?: { page?: number; limit?: number }) =>
      this.get('/integrations/webhooks', params),
    createWebhook: (data: unknown) => this.post('/integrations/webhooks', data),
    testWebhook: (id: string) => this.post(`/integrations/webhooks/${id}/test`),
    getSSO: () => this.get('/integrations/sso'),
    updateSSO: (data: unknown) => this.put('/integrations/sso', data),
    getHL7FHIR: (params?: { page?: number; limit?: number }) =>
      this.get('/integrations/hl7-fhir', params),
    getAccounting: (params?: { page?: number; limit?: number }) =>
      this.get('/integrations/accounting', params),
    syncAccounting: (id: string) => this.post(`/integrations/accounting/${id}/sync`),
    getAPIAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      this.get('/integrations/api-analytics', params),
    importData: (data: unknown) => this.post('/integrations/import', data),
    exportData: (params?: { type?: string; format?: string }) =>
      this.get('/integrations/export', params),
  };

  // Mobile endpoints
  mobile = {
    getApplications: () => this.get('/mobile/applications'),
    getDevices: (params?: { page?: number; limit?: number; platform?: string }) =>
      this.get('/mobile/devices', params),
    registerDevice: (data: unknown) => this.post('/mobile/devices', data),
    updateDevice: (id: string, data: unknown) => this.put(`/mobile/devices/${id}`, data),
    getSync: (params?: { lastSync?: string }) => this.get('/mobile/sync', params),
    syncData: (data: unknown) => this.post('/mobile/sync', data),
    getOfflineData: () => this.get('/mobile/offline'),
    getEmergencyAccess: (params?: { page?: number; limit?: number }) =>
      this.get('/mobile/emergency-access', params),
    getFieldService: (params?: { page?: number; limit?: number; status?: string }) =>
      this.get('/mobile/field-service', params),
    getMobileReports: (params?: { page?: number; limit?: number; type?: string }) =>
      this.get('/mobile/reports', params),
  };
}

export const api = new ApiClient();
export default api;
