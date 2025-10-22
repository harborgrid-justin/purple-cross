import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const usePatientRelationship = (id: string) => {
  return useQuery({
    queryKey: ['patientRelationship', id],
    queryFn: () => api.patientRelationships.getById(id),
    enabled: !!id,
  });
};

export const usePatientRelationships = (patientId: string) => {
  return useQuery({
    queryKey: ['patientRelationships', patientId],
    queryFn: () => api.patientRelationships.getPatientRelationships(patientId),
    enabled: !!patientId,
  });
};

export const usePatientFamily = (patientId: string) => {
  return useQuery({
    queryKey: ['patientFamily', patientId],
    queryFn: () => api.patientRelationships.getPatientFamily(patientId),
    enabled: !!patientId,
  });
};

export const useCreatePatientRelationship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.patientRelationships.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientRelationships'] });
      queryClient.invalidateQueries({ queryKey: ['patientFamily'] });
    },
  });
};

export const useUpdatePatientRelationship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patientRelationships.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientRelationships'] });
      queryClient.invalidateQueries({ queryKey: ['patientFamily'] });
    },
  });
};

export const useDeletePatientRelationship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patientRelationships.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientRelationships'] });
      queryClient.invalidateQueries({ queryKey: ['patientFamily'] });
    },
  });
};
