import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useTimeBlocks = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['timeBlocks', params],
    queryFn: () => api.timeBlocks.getAll(params),
  });
};

export const useTimeBlock = (id: string) => {
  return useQuery({
    queryKey: ['timeBlock', id],
    queryFn: () => api.timeBlocks.getById(id),
    enabled: !!id,
  });
};

export const useCreateTimeBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.timeBlocks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeBlocks'] });
    },
  });
};

export const useUpdateTimeBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.timeBlocks.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeBlocks'] });
    },
  });
};

export const useDeleteTimeBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.timeBlocks.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeBlocks'] });
    },
  });
};
