/**
 * WF-COMP-XXX | useRefunds.ts - use Refunds
 * Purpose: React hook for managing Refunds data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useRefunds = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['refunds', params],
    queryFn: () => api.refunds.getAll(params),
  });
};

export const useRefund = (id: string) => {
  return useQuery({
    queryKey: ['refund', id],
    queryFn: () => api.refunds.getById(id),
    enabled: !!id,
  });
};

export const useCreateRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.refunds.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};

export const useUpdateRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.refunds.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.refunds.process(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};

export const useDeleteRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.refunds.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};
