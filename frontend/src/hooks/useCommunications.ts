/**
 * WF-COMP-XXX | useCommunications.ts - use Communications
 * Purpose: React hook for managing Communications data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

export const useCommunications = (params?: {
  page?: number;
  limit?: number;
  clientId?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNICATIONS, params],
    queryFn: () => api.communications.getAll(params),
  });
};

export const useCommunication = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNICATION, id],
    queryFn: () => api.communications.getById(id),
    enabled: !!id,
  });
};

export const useCreateCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.communications.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNICATIONS] });
    },
  });
};

export const useUpdateCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.communications.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNICATIONS] });
    },
  });
};

export const useDeleteCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.communications.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNICATIONS] });
    },
  });
};
