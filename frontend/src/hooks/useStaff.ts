import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useStaff = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => api.staff.getAll(params),
  });
};

export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ['staffMember', id],
    queryFn: () => api.staff.getById(id),
    enabled: !!id,
  });
};

export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.staff.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.staff.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useDeleteStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.staff.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
