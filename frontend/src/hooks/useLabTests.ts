/**
 * WF-COMP-XXX | useLabTests.ts - use Lab Tests
 * Purpose: React hook for managing LabTests data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

export const useLabTests = (params?: {
  page?: number;
  limit?: number;
  patientId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LAB_TESTS, params],
    queryFn: () => api.labTests.getAll(params),
  });
};

export const useLabTest = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LAB_TEST, id],
    queryFn: () => api.labTests.getById(id),
    enabled: !!id,
  });
};

export const useCreateLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.labTests.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LAB_TESTS] });
    },
  });
};

export const useUpdateLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.labTests.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LAB_TESTS] });
    },
  });
};

export const useDeleteLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.labTests.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LAB_TESTS] });
    },
  });
};

// Composite hooks
export const useLabTestWithPatient = (id: string) => {
  const labTestQuery = useLabTest(id);
  const patientId = (labTestQuery.data as { data?: { patientId?: string } })?.data?.patientId;
  const patientQuery = useQuery({
    queryKey: [QUERY_KEYS.PATIENT, patientId],
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
