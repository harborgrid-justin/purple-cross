import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Generic hook factory for creating data fetching hooks
 */
export const createUseQuery = <TData = unknown>(
  queryKey: string | string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) => {
  return () =>
    useQuery({
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      queryFn,
      ...options,
    });
};

/**
 * Generic hook for fetching list data with parameters
 */
export const useAPIQuery = <TData = unknown>(
  endpoint: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => api.get<TData>(endpoint, params),
    ...options,
  });
};

// Reports hooks
export const useReports = (params?: { page?: number; limit?: number; type?: string }) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => api.reports.getAll(params),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => api.reports.getById(id),
    enabled: !!id,
  });
};

export const useClinicalReports = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['reports', 'clinical', params],
    queryFn: () => api.reports.getClinical(params),
  });
};

export const useFinancialReports = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['reports', 'financial', params],
    queryFn: () => api.reports.getFinancial(params),
  });
};

export const useOperationalReports = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['reports', 'operational', params],
    queryFn: () => api.reports.getOperational(params),
  });
};

export const useClientAnalytics = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['reports', 'client-analytics', params],
    queryFn: () => api.reports.getClientAnalytics(params),
  });
};

export const useTrends = (params?: { metric?: string; period?: string }) => {
  return useQuery({
    queryKey: ['reports', 'trends', params],
    queryFn: () => api.reports.getTrends(params),
  });
};

// Compliance hooks
export const useHIPAACompliance = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['compliance', 'hipaa', params],
    queryFn: () => api.compliance.getHIPAA(params),
  });
};

export const useLicenses = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['compliance', 'licenses', params],
    queryFn: () => api.compliance.getLicenses(params),
  });
};

export const useControlledSubstances = (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['compliance', 'controlled-substances', params],
    queryFn: () => api.compliance.getControlledSubstances(params),
  });
};

export const useRecordRetention = () => {
  return useQuery({
    queryKey: ['compliance', 'record-retention'],
    queryFn: () => api.compliance.getRecordRetention(),
  });
};

export const useIncidents = (params?: { page?: number; limit?: number; severity?: string }) => {
  return useQuery({
    queryKey: ['compliance', 'incidents', params],
    queryFn: () => api.compliance.getIncidents(params),
  });
};

export const usePolicies = (params?: { page?: number; limit?: number; category?: string }) => {
  return useQuery({
    queryKey: ['compliance', 'policies', params],
    queryFn: () => api.compliance.getPolicies(params),
  });
};

export const useAuditPrep = () => {
  return useQuery({
    queryKey: ['compliance', 'audit-prep'],
    queryFn: () => api.compliance.getAuditPrep(),
  });
};

export const useRegulatoryUpdates = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['compliance', 'regulatory-updates', params],
    queryFn: () => api.compliance.getRegulatoryUpdates(params),
  });
};

// Integration hooks
export const useIntegrations = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['integrations', params],
    queryFn: () => api.integrations.getAll(params),
  });
};

export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: ['integration', id],
    queryFn: () => api.integrations.getById(id),
    enabled: !!id,
  });
};

export const useThirdPartyIntegrations = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['integrations', 'third-party', params],
    queryFn: () => api.integrations.getThirdParty(params),
  });
};

export const useAPIKeys = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['integrations', 'api-keys', params],
    queryFn: () => api.integrations.getAPIKeys(params),
  });
};

export const useWebhooks = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['integrations', 'webhooks', params],
    queryFn: () => api.integrations.getWebhooks(params),
  });
};

export const useSSO = () => {
  return useQuery({
    queryKey: ['integrations', 'sso'],
    queryFn: () => api.integrations.getSSO(),
  });
};

export const useHL7FHIR = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['integrations', 'hl7-fhir', params],
    queryFn: () => api.integrations.getHL7FHIR(params),
  });
};

export const useAccountingIntegrations = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['integrations', 'accounting', params],
    queryFn: () => api.integrations.getAccounting(params),
  });
};

export const useAPIAnalytics = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['integrations', 'api-analytics', params],
    queryFn: () => api.integrations.getAPIAnalytics(params),
  });
};

// Mobile hooks
export const useMobileApplications = () => {
  return useQuery({
    queryKey: ['mobile', 'applications'],
    queryFn: () => api.mobile.getApplications(),
  });
};

export const useMobileDevices = (params?: { page?: number; limit?: number; platform?: string }) => {
  return useQuery({
    queryKey: ['mobile', 'devices', params],
    queryFn: () => api.mobile.getDevices(params),
  });
};

export const useMobileSync = (params?: { lastSync?: string }) => {
  return useQuery({
    queryKey: ['mobile', 'sync', params],
    queryFn: () => api.mobile.getSync(params),
  });
};

export const useOfflineData = () => {
  return useQuery({
    queryKey: ['mobile', 'offline'],
    queryFn: () => api.mobile.getOfflineData(),
  });
};

export const useEmergencyAccess = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['mobile', 'emergency-access', params],
    queryFn: () => api.mobile.getEmergencyAccess(params),
  });
};

export const useFieldService = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['mobile', 'field-service', params],
    queryFn: () => api.mobile.getFieldService(params),
  });
};

export const useMobileReports = (params?: { page?: number; limit?: number; type?: string }) => {
  return useQuery({
    queryKey: ['mobile', 'reports', params],
    queryFn: () => api.mobile.getMobileReports(params),
  });
};

// Mutation hooks for integrations
export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.integrations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.integrations.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', 'webhooks'] });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (id: string) => api.integrations.testWebhook(id),
  });
};

export const useCreateAPIKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.integrations.createAPIKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', 'api-keys'] });
    },
  });
};

export const useRevokeAPIKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.integrations.revokeAPIKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', 'api-keys'] });
    },
  });
};

export const useSyncAccounting = () => {
  return useMutation({
    mutationFn: (id: string) => api.integrations.syncAccounting(id),
  });
};

export const useRegisterDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.mobile.registerDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile', 'devices'] });
    },
  });
};

export const useSyncMobileData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.mobile.syncData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile', 'sync'] });
    },
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.compliance.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance', 'incidents'] });
    },
  });
};
