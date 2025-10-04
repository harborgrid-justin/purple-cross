import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useMedicalRecords = (params?: {
  page?: number;
  limit?: number;
  patientId?: string;
}) => {
  return useQuery({
    queryKey: ['medicalRecords', params],
    queryFn: () => api.medicalRecords.getAll(params),
  });
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: ['medicalRecord', id],
    queryFn: () => api.medicalRecords.getById(id),
    enabled: !!id,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.medicalRecords.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.medicalRecords.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
    },
  });
};

export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.medicalRecords.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
    },
  });
};
