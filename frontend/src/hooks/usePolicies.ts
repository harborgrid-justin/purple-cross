import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const usePolicies = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['policies', params],
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
    queryKey: ['policies', 'acknowledgments', userId],
    queryFn: () => api.policies.getUserAcknowledgments(userId),
    enabled: !!userId,
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.policies.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.policies.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

export const useAcknowledgePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, acknowledgmentData }: { id: string; acknowledgmentData: unknown }) =>
      api.policies.acknowledge(id, acknowledgmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.policies.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};
