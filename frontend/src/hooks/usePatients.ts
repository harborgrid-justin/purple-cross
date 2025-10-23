/**
 * WF-COMP-XXX | usePatients.ts - use Patients
 * Purpose: React hook for managing Patients data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const usePatients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: string;
}) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => api.patients.getAll(params),
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => api.patients.getById(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.patients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.patients.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patients.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Composite hooks
export const usePatientWithOwner = (id: string) => {
  const patientQuery = usePatient(id);
  const ownerId = (patientQuery.data as { data?: { ownerId?: string } })?.data?.ownerId;
  const clientQuery = useQuery({
    queryKey: ['client', ownerId],
    queryFn: () => api.clients.getById(ownerId as string),
    enabled: !!ownerId,
  });

  return {
    patient: patientQuery,
    owner: clientQuery,
    isLoading: patientQuery.isLoading || clientQuery.isLoading,
    isError: patientQuery.isError || clientQuery.isError,
  };
};

export const usePatientWithRecords = (id: string) => {
  const patientQuery = usePatient(id);
  const recordsQuery = useQuery({
    queryKey: ['medicalRecords', { patientId: id }],
    queryFn: () => api.medicalRecords.getAll({ patientId: id }),
    enabled: !!id,
  });

  return {
    patient: patientQuery,
    records: recordsQuery,
    isLoading: patientQuery.isLoading || recordsQuery.isLoading,
    isError: patientQuery.isError || recordsQuery.isError,
  };
};

export const usePatientWithPrescriptions = (id: string) => {
  const patientQuery = usePatient(id);
  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions', { patientId: id }],
    queryFn: () => api.prescriptions.getAll({ patientId: id }),
    enabled: !!id,
  });

  return {
    patient: patientQuery,
    prescriptions: prescriptionsQuery,
    isLoading: patientQuery.isLoading || prescriptionsQuery.isLoading,
    isError: patientQuery.isError || prescriptionsQuery.isError,
  };
};
