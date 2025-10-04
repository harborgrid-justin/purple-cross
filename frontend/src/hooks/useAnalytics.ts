import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => api.analytics.getDashboard(),
  });
};

export const usePatientDemographics = () => {
  return useQuery({
    queryKey: ['analytics', 'patients'],
    queryFn: () => api.analytics.getPatientDemographics(),
  });
};

export const useAppointmentAnalytics = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['analytics', 'appointments', params],
    queryFn: () => api.analytics.getAppointmentAnalytics(params),
  });
};

export const useFinancialReport = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['analytics', 'financial', params],
    queryFn: () => api.analytics.getFinancialReport(params),
  });
};

export const useInventoryReport = () => {
  return useQuery({
    queryKey: ['analytics', 'inventory'],
    queryFn: () => api.analytics.getInventoryReport(),
  });
};

export const useStaffAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'staff'],
    queryFn: () => api.analytics.getStaffAnalytics(),
  });
};
