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

// Composite hooks
export const useMedicalRecordWithPatient = (id: string) => {
  const recordQuery = useMedicalRecord(id);
  const patientId = (recordQuery.data as { data?: { patientId?: string } })?.data?.patientId;
  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.patients.getById(patientId as string),
    enabled: !!patientId,
  });

  return {
    record: recordQuery,
    patient: patientQuery,
    isLoading: recordQuery.isLoading || patientQuery.isLoading,
    isError: recordQuery.isError || patientQuery.isError,
  };
};

export const usePatientMedicalHistory = (patientId: string) => {
  const recordsQuery = useMedicalRecords({ patientId });
  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions', { patientId }],
    queryFn: () => api.prescriptions.getAll({ patientId }),
    enabled: !!patientId,
  });
  const labTestsQuery = useQuery({
    queryKey: ['labTests', { patientId }],
    queryFn: () => api.labTests.getAll({ patientId }),
    enabled: !!patientId,
  });

  return {
    records: recordsQuery,
    prescriptions: prescriptionsQuery,
    labTests: labTestsQuery,
    isLoading: recordsQuery.isLoading || prescriptionsQuery.isLoading || labTestsQuery.isLoading,
    isError: recordsQuery.isError || prescriptionsQuery.isError || labTestsQuery.isError,
  };
};
