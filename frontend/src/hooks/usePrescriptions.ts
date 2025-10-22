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

// Composite hooks
export const usePrescriptionWithPatient = (id: string) => {
  const prescriptionQuery = usePrescription(id);
  const patientId = (prescriptionQuery.data as { data?: { patientId?: string } })?.data?.patientId;
  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.patients.getById(patientId as string),
    enabled: !!patientId,
  });

  return {
    prescription: prescriptionQuery,
    patient: patientQuery,
    isLoading: prescriptionQuery.isLoading || patientQuery.isLoading,
    isError: prescriptionQuery.isError || patientQuery.isError,
  };
};
