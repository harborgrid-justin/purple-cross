import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useLabTests = (params?: {
  page?: number;
  limit?: number;
  patientId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['labTests', params],
    queryFn: () => api.labTests.getAll(params),
  });
};

export const useLabTest = (id: string) => {
  return useQuery({
    queryKey: ['labTest', id],
    queryFn: () => api.labTests.getById(id),
    enabled: !!id,
  });
};

export const useCreateLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.labTests.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTests'] });
    },
  });
};

export const useUpdateLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.labTests.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTests'] });
    },
  });
};

export const useDeleteLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.labTests.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTests'] });
    },
  });
};

// Composite hooks
export const useLabTestWithPatient = (id: string) => {
  const labTestQuery = useLabTest(id);
  const patientId = (labTestQuery.data as { data?: { patientId?: string } })?.data?.patientId;
  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.patients.getById(patientId as string),
    enabled: !!patientId,
  });

  return {
    labTest: labTestQuery,
    patient: patientQuery,
    isLoading: labTestQuery.isLoading || patientQuery.isLoading,
    isError: labTestQuery.isError || patientQuery.isError,
  };
};

export const usePendingLabTests = () => {
  return useLabTests({ status: 'pending' });
};
