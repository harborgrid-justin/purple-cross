/**
 * WF-COMP-XXX | useAnalytics.ts - use Analytics
 * Purpose: React hook for managing Analytics data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';
import { QUERY_STALE_TIME } from '@/constants';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'dashboard'],
    queryFn: () => api.analytics.getDashboard(),
    // Dynamic staleTime: Dashboard shows real-time metrics (today's appointments, revenue, etc.)
    staleTime: QUERY_STALE_TIME.DYNAMIC,
  });
};

export const usePatientDemographics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'patients'],
    queryFn: () => api.analytics.getPatientDemographics(),
    // Semi-static staleTime: Demographics change slowly over time
    staleTime: QUERY_STALE_TIME.SEMI_STATIC,
  });
};

export const useAppointmentAnalytics = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'appointments', params],
    queryFn: () => api.analytics.getAppointmentAnalytics(params),
    // Standard staleTime: Historical appointment data doesn't change once set
    staleTime: QUERY_STALE_TIME.STANDARD,
  });
};

export const useFinancialReport = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'financial', params],
    queryFn: () => api.analytics.getFinancialReport(params),
    // Standard staleTime: Financial data for completed periods is stable
    staleTime: QUERY_STALE_TIME.STANDARD,
  });
};

export const useInventoryReport = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'inventory'],
    queryFn: () => api.analytics.getInventoryReport(),
    // Dynamic staleTime: Inventory levels change frequently
    staleTime: QUERY_STALE_TIME.DYNAMIC,
  });
};

export const useStaffAnalytics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'staff'],
    queryFn: () => api.analytics.getStaffAnalytics(),
    // Semi-static staleTime: Staff analytics change gradually
    staleTime: QUERY_STALE_TIME.SEMI_STATIC,
  });
};
