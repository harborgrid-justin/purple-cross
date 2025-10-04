import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const usePrescriptions = (params?: {
  page?: number;
  limit?: number;
  patientId?: string;
}) => {
  return useQuery({
    queryKey: ['prescriptions', params],
    queryFn: () => api.prescriptions.getAll(params),
  });
};

export const usePrescription = (id: string) => {
  return useQuery({
    queryKey: ['prescription', id],
    queryFn: () => api.prescriptions.getById(id),
    enabled: !!id,
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.prescriptions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.prescriptions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.prescriptions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};
