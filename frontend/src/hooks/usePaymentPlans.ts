/**
 * WF-COMP-XXX | usePaymentPlans.ts - use Payment Plans
 * Purpose: React hook for managing PaymentPlans data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const usePaymentPlans = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['paymentPlans', params],
    queryFn: () => api.paymentPlans.getAll(params),
  });
};

export const usePaymentPlan = (id: string) => {
  return useQuery({
    queryKey: ['paymentPlan', id],
    queryFn: () => api.paymentPlans.getById(id),
    enabled: !!id,
  });
};

export const useDueInstallments = (clientId: string) => {
  return useQuery({
    queryKey: ['paymentPlans', 'due', clientId],
    queryFn: () => api.paymentPlans.getDueInstallments(clientId),
    enabled: !!clientId,
  });
};

export const useCreatePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.paymentPlans.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] });
    },
  });
};

export const useUpdatePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.paymentPlans.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] });
    },
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: unknown) => api.paymentPlans.recordPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] });
    },
  });
};

export const useCancelPaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.paymentPlans.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] });
    },
  });
};

export const useDeletePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.paymentPlans.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] });
    },
  });
};
