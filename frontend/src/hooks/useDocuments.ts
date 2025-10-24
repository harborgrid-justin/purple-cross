/**
 * WF-COMP-XXX | useDocuments.ts - use Documents
 * Purpose: React hook for managing Documents data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

export const useDocuments = (params?: {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DOCUMENTS, params],
    queryFn: () => api.documents.getAll(params),
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DOCUMENT, id],
    queryFn: () => api.documents.getById(id),
    enabled: !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.documents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.documents.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documents.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
    },
  });
};
