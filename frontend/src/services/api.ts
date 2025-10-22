/**
 * WF-COMP-XXX | api.ts - Legacy API client (preserved for backward compatibility)
 * Purpose: Maintains backward compatibility with existing code
 * Note: New code should use the services/modules APIs instead
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  API_CONFIG,
  HTTP_STATUS,
  STORAGE_KEYS,
  ROUTES,
  HTTP_HEADERS,
  CONTENT_TYPE,
  API_ENDPOINTS,
} from '../constants';

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

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `${HTTP_HEADERS.BEARER_PREFIX} ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          window.location.href = ROUTES.LOGIN;
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
      this.get(API_ENDPOINTS.PATIENTS, params),
    getById: (id: string) => this.get(API_ENDPOINTS.PATIENT_BY_ID(id)),
    create: (data: unknown) => this.post(API_ENDPOINTS.PATIENTS, data),
    update: (id: string, data: unknown) => this.put(API_ENDPOINTS.PATIENT_BY_ID(id), data),
    delete: (id: string) => this.delete(API_ENDPOINTS.PATIENT_BY_ID(id)),
  };

  // Client endpoints
  clients = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      this.get(API_ENDPOINTS.CLIENTS, params),
    getById: (id: string) => this.get(API_ENDPOINTS.CLIENT_BY_ID(id)),
    create: (data: unknown) => this.post(API_ENDPOINTS.CLIENTS, data),
    update: (id: string, data: unknown) => this.put(API_ENDPOINTS.CLIENT_BY_ID(id), data),
    delete: (id: string) => this.delete(API_ENDPOINTS.CLIENT_BY_ID(id)),
  };

  // Appointment endpoints
  appointments = {
    getAll: (params?: { page?: number; limit?: number; date?: string }) =>
      this.get(API_ENDPOINTS.APPOINTMENTS, params),
    getById: (id: string) => this.get(API_ENDPOINTS.APPOINTMENT_BY_ID(id)),
    create: (data: unknown) => this.post(API_ENDPOINTS.APPOINTMENTS, data),
    update: (id: string, data: unknown) => this.put(API_ENDPOINTS.APPOINTMENT_BY_ID(id), data),
    complete: (id: string) => this.patch(`/appointments/${id}/complete`),
    delete: (id: string) => this.delete(API_ENDPOINTS.APPOINTMENT_BY_ID(id)),
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

  // Breed Info endpoints
  breedInfo = {
    getAll: (params?: { page?: number; limit?: number; species?: string }) =>
      this.get('/breed-info', params),
    getById: (id: string) => this.get(`/breed-info/${id}`),
    getByBreed: (breed: string) => this.get(`/breed-info/breed/${breed}`),
    create: (data: unknown) => this.post('/breed-info', data),
    update: (id: string, data: unknown) => this.put(`/breed-info/${id}`, data),
    delete: (id: string) => this.delete(`/breed-info/${id}`),
  };

  // Patient Relationship endpoints
  patientRelationships = {
    getById: (id: string) => this.get(`/patient-relationships/${id}`),
    getPatientRelationships: (patientId: string) =>
      this.get(`/patient-relationships/patient/${patientId}`),
    getPatientFamily: (patientId: string) =>
      this.get(`/patient-relationships/patient/${patientId}/family`),
    create: (data: unknown) => this.post('/patient-relationships', data),
    update: (id: string, data: unknown) => this.put(`/patient-relationships/${id}`, data),
    delete: (id: string) => this.delete(`/patient-relationships/${id}`),
  };

  // Patient Reminder endpoints
  patientReminders = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/patient-reminders', params),
    getById: (id: string) => this.get(`/patient-reminders/${id}`),
    getDue: () => this.get('/patient-reminders/due'),
    create: (data: unknown) => this.post('/patient-reminders', data),
    update: (id: string, data: unknown) => this.put(`/patient-reminders/${id}`, data),
    complete: (id: string) => this.post(`/patient-reminders/${id}/complete`),
    delete: (id: string) => this.delete(`/patient-reminders/${id}`),
  };

  // Client Portal endpoints
  clientPortal = {
    getById: (id: string) => this.get(`/client-portal/${id}`),
    login: (credentials: { email: string; password: string }) =>
      this.post('/client-portal/login', credentials),
    create: (data: unknown) => this.post('/client-portal', data),
    update: (id: string, data: unknown) => this.put(`/client-portal/${id}`, data),
    updatePassword: (id: string, newPassword: string) =>
      this.put(`/client-portal/${id}/password`, { newPassword }),
    enableTwoFactor: (id: string, secret: string) =>
      this.post(`/client-portal/${id}/2fa/enable`, { secret }),
    disableTwoFactor: (id: string) => this.post(`/client-portal/${id}/2fa/disable`),
    delete: (id: string) => this.delete(`/client-portal/${id}`),
  };

  // Loyalty Program endpoints
  loyaltyPrograms = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/loyalty-programs', params),
    getById: (id: string) => this.get(`/loyalty-programs/${id}`),
    getByClient: (clientId: string) => this.get(`/loyalty-programs/client/${clientId}`),
    getTransactions: (loyaltyProgramId: string) =>
      this.get(`/loyalty-programs/${loyaltyProgramId}/transactions`),
    create: (data: unknown) => this.post('/loyalty-programs', data),
    update: (id: string, data: unknown) => this.put(`/loyalty-programs/${id}`, data),
    addPoints: (data: { loyaltyProgramId: string; points: number; reason?: string }) =>
      this.post('/loyalty-programs/points/add', data),
    redeemPoints: (data: { loyaltyProgramId: string; points: number; reason?: string }) =>
      this.post('/loyalty-programs/points/redeem', data),
    delete: (id: string) => this.delete(`/loyalty-programs/${id}`),
  };

  // Feedback endpoints
  feedback = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/feedback', params),
    getById: (id: string) => this.get(`/feedback/${id}`),
    getNPSScore: () => this.get('/feedback/nps'),
    create: (data: unknown) => this.post('/feedback', data),
    update: (id: string, data: unknown) => this.put(`/feedback/${id}`, data),
    review: (id: string, reviewData: unknown) => this.post(`/feedback/${id}/review`, reviewData),
    delete: (id: string) => this.delete(`/feedback/${id}`),
    // Survey endpoints
    createSurvey: (data: unknown) => this.post('/feedback/surveys', data),
    getSurvey: (id: string) => this.get(`/feedback/surveys/${id}`),
    publishSurvey: (id: string) => this.post(`/feedback/surveys/${id}/publish`),
    submitSurveyResponse: (data: unknown) => this.post('/feedback/surveys/responses', data),
  };

  // Waitlist endpoints
  waitlist = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/waitlist', params),
    getById: (id: string) => this.get(`/waitlist/${id}`),
    create: (data: unknown) => this.post('/waitlist', data),
    update: (id: string, data: unknown) => this.put(`/waitlist/${id}`, data),
    notify: (id: string) => this.post(`/waitlist/${id}/notify`),
    book: (id: string, appointmentData: unknown) =>
      this.post(`/waitlist/${id}/book`, appointmentData),
    cancel: (id: string) => this.post(`/waitlist/${id}/cancel`),
    delete: (id: string) => this.delete(`/waitlist/${id}`),
  };

  // Time Block endpoints
  timeBlocks = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/time-blocks', params),
    getById: (id: string) => this.get(`/time-blocks/${id}`),
    create: (data: unknown) => this.post('/time-blocks', data),
    update: (id: string, data: unknown) => this.put(`/time-blocks/${id}`, data),
    delete: (id: string) => this.delete(`/time-blocks/${id}`),
  };

  // Estimate endpoints
  estimates = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/estimates', params),
    getById: (id: string) => this.get(`/estimates/${id}`),
    create: (data: unknown) => this.post('/estimates', data),
    update: (id: string, data: unknown) => this.put(`/estimates/${id}`, data),
    approve: (id: string) => this.post(`/estimates/${id}/approve`),
    reject: (id: string) => this.post(`/estimates/${id}/reject`),
    convertToInvoice: (id: string) => this.post(`/estimates/${id}/convert`),
    delete: (id: string) => this.delete(`/estimates/${id}`),
  };

  // Payment Plan endpoints
  paymentPlans = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/payment-plans', params),
    getById: (id: string) => this.get(`/payment-plans/${id}`),
    getDueInstallments: (clientId: string) => this.get(`/payment-plans/client/${clientId}/due`),
    create: (data: unknown) => this.post('/payment-plans', data),
    update: (id: string, data: unknown) => this.put(`/payment-plans/${id}`, data),
    recordPayment: (paymentData: unknown) => this.post('/payment-plans/payment', paymentData),
    cancel: (id: string) => this.post(`/payment-plans/${id}/cancel`),
    delete: (id: string) => this.delete(`/payment-plans/${id}`),
  };

  // Purchase Order endpoints
  purchaseOrders = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/purchase-orders', params),
    getById: (id: string) => this.get(`/purchase-orders/${id}`),
    create: (data: unknown) => this.post('/purchase-orders', data),
    update: (id: string, data: unknown) => this.put(`/purchase-orders/${id}`, data),
    approve: (id: string) => this.post(`/purchase-orders/${id}/approve`),
    receiveItems: (id: string, itemsData: unknown) =>
      this.post(`/purchase-orders/${id}/receive`, itemsData),
    cancel: (id: string) => this.post(`/purchase-orders/${id}/cancel`),
    delete: (id: string) => this.delete(`/purchase-orders/${id}`),
  };

  // Equipment endpoints
  equipment = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/equipment', params),
    getById: (id: string) => this.get(`/equipment/${id}`),
    create: (data: unknown) => this.post('/equipment', data),
    update: (id: string, data: unknown) => this.put(`/equipment/${id}`, data),
    scheduleMaintenance: (maintenanceData: unknown) =>
      this.post('/equipment/maintenance', maintenanceData),
    completeMaintenance: (maintenanceId: string) =>
      this.post(`/equipment/maintenance/${maintenanceId}/complete`),
    getMaintenanceSchedule: () => this.get('/equipment/maintenance/schedule'),
    getUpcomingMaintenance: () => this.get('/equipment/maintenance/upcoming'),
    delete: (id: string) => this.delete(`/equipment/${id}`),
  };

  // Insurance Claim endpoints
  insuranceClaims = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/insurance-claims', params),
    getById: (id: string) => this.get(`/insurance-claims/${id}`),
    create: (data: unknown) => this.post('/insurance-claims', data),
    update: (id: string, data: unknown) => this.put(`/insurance-claims/${id}`, data),
    updateStatus: (id: string, statusData: unknown) =>
      this.put(`/insurance-claims/${id}/status`, statusData),
    processClaim: (id: string) => this.post(`/insurance-claims/${id}/process`),
    delete: (id: string) => this.delete(`/insurance-claims/${id}`),
  };

  // Refund endpoints
  refunds = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/refunds', params),
    getById: (id: string) => this.get(`/refunds/${id}`),
    create: (data: unknown) => this.post('/refunds', data),
    update: (id: string, data: unknown) => this.put(`/refunds/${id}`, data),
    process: (id: string) => this.post(`/refunds/${id}/process`),
    delete: (id: string) => this.delete(`/refunds/${id}`),
  };

  // Marketing Campaign endpoints
  marketingCampaigns = {
    getAll: (params?: { page?: number; limit?: number }) =>
      this.get('/marketing-campaigns', params),
    getById: (id: string) => this.get(`/marketing-campaigns/${id}`),
    create: (data: unknown) => this.post('/marketing-campaigns', data),
    update: (id: string, data: unknown) => this.put(`/marketing-campaigns/${id}`, data),
    launch: (id: string) => this.post(`/marketing-campaigns/${id}/launch`),
    updateMetrics: (id: string, metrics: unknown) =>
      this.put(`/marketing-campaigns/${id}/metrics`, metrics),
    complete: (id: string) => this.post(`/marketing-campaigns/${id}/complete`),
    delete: (id: string) => this.delete(`/marketing-campaigns/${id}`),
  };

  // Policy endpoints
  policies = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/policies', params),
    getById: (id: string) => this.get(`/policies/${id}`),
    getUserAcknowledgments: (userId: string) =>
      this.get(`/policies/user/${userId}/acknowledgments`),
    create: (data: unknown) => this.post('/policies', data),
    update: (id: string, data: unknown) => this.put(`/policies/${id}`, data),
    acknowledge: (id: string, acknowledgmentData: unknown) =>
      this.post(`/policies/${id}/acknowledge`, acknowledgmentData),
    delete: (id: string) => this.delete(`/policies/${id}`),
  };

  // Report Template endpoints
  reportTemplates = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/report-templates', params),
    getById: (id: string) => this.get(`/report-templates/${id}`),
    getScheduledReports: () => this.get('/report-templates/schedule/due'),
    create: (data: unknown) => this.post('/report-templates', data),
    update: (id: string, data: unknown) => this.put(`/report-templates/${id}`, data),
    incrementUsage: (id: string) => this.post(`/report-templates/${id}/use`),
    scheduleReport: (scheduleData: unknown) =>
      this.post('/report-templates/schedule', scheduleData),
    delete: (id: string) => this.delete(`/report-templates/${id}`),
  };

  // Document Template endpoints
  documentTemplates = {
    getAll: (params?: { page?: number; limit?: number }) => this.get('/document-templates', params),
    getById: (id: string) => this.get(`/document-templates/${id}`),
    getDocumentSignatures: (documentId: string) =>
      this.get(`/document-templates/documents/${documentId}/signatures`),
    create: (data: unknown) => this.post('/document-templates', data),
    update: (id: string, data: unknown) => this.put(`/document-templates/${id}`, data),
    incrementUsage: (id: string) => this.post(`/document-templates/${id}/use`),
    signDocument: (signatureData: unknown) =>
      this.post('/document-templates/signatures', signatureData),
    createWorkflow: (workflowData: unknown) =>
      this.post('/document-templates/workflows', workflowData),
    advanceWorkflow: (workflowId: string, data: unknown) =>
      this.post(`/document-templates/workflows/${workflowId}/advance`, data),
    delete: (id: string) => this.delete(`/document-templates/${id}`),
  };
}

export const api = new ApiClient();
export default api;
