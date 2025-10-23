/**
 * WF-COMP-XXX | useEstimates.ts - use Estimates
 * Purpose: React hook for managing Estimates data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useEstimates = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['estimates', params],
    queryFn: () => api.estimates.getAll(params),
  });
};

export const useEstimate = (id: string) => {
  return useQuery({
    queryKey: ['estimate', id],
    queryFn: () => api.estimates.getById(id),
    enabled: !!id,
  });
};

export const useCreateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.estimates.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });
};

export const useUpdateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.estimates.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });
};

export const useApproveEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.estimates.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });
};

export const useRejectEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.estimates.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });
};

export const useConvertEstimateToInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.estimates.convertToInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useDeleteEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.estimates.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
  });
};

// Composite hooks
export const useEstimateWithClient = (id: string) => {
  const estimateQuery = useEstimate(id);
  const clientId = (estimateQuery.data as { data?: { clientId?: string } })?.data?.clientId;
  const clientQuery = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => api.clients.getById(clientId as string),
    enabled: !!clientId,
  });

  return {
    estimate: estimateQuery,
    client: clientQuery,
    isLoading: estimateQuery.isLoading || clientQuery.isLoading,
    isError: estimateQuery.isError || clientQuery.isError,
  };
};
