import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useDocumentTemplates = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['documentTemplates', params],
    queryFn: () => api.documentTemplates.getAll(params),
  });
};

export const useDocumentTemplate = (id: string) => {
  return useQuery({
    queryKey: ['documentTemplate', id],
    queryFn: () => api.documentTemplates.getById(id),
    enabled: !!id,
  });
};

export const useDocumentSignatures = (documentId: string) => {
  return useQuery({
    queryKey: ['documentTemplate', documentId, 'signatures'],
    queryFn: () => api.documentTemplates.getDocumentSignatures(documentId),
    enabled: !!documentId,
  });
};

export const useCreateDocumentTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.documentTemplates.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplates'] });
    },
  });
};

export const useUpdateDocumentTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.documentTemplates.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplates'] });
    },
  });
};

export const useIncrementDocumentTemplateUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documentTemplates.incrementUsage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplates'] });
    },
  });
};

export const useSignDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (signatureData: unknown) => api.documentTemplates.signDocument(signatureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplate'] });
    },
  });
};

export const useCreateDocumentWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflowData: unknown) => api.documentTemplates.createWorkflow(workflowData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplates'] });
    },
  });
};

export const useAdvanceDocumentWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId, data }: { workflowId: string; data: unknown }) =>
      api.documentTemplates.advanceWorkflow(workflowId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplates'] });
    },
  });
};

export const useDeleteDocumentTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documentTemplates.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTemplates'] });
    },
  });
};
