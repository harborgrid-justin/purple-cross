/**
 * WF-COMP-XXX | usePolicies.ts - use Policies
 * Purpose: React hook for managing Policies data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

export const usePolicies = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POLICIES, params],
    queryFn: () => api.policies.getAll(params),
  });
};

export const usePolicy = (id: string) => {
  return useQuery({
    queryKey: ['policy', id],
    queryFn: () => api.policies.getById(id),
    enabled: !!id,
  });
};

export const useUserAcknowledgments = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POLICIES, 'acknowledgments', userId],
    queryFn: () => api.policies.getUserAcknowledgments(userId),
    enabled: !!userId,
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.policies.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POLICIES] });
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.policies.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POLICIES] });
    },
  });
};

export const useAcknowledgePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, acknowledgmentData }: { id: string; acknowledgmentData: unknown }) =>
      api.policies.acknowledge(id, acknowledgmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POLICIES] });
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.policies.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POLICIES] });
    },
  });
};
