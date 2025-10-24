/**
 * WF-COMP-XXX | usePatientRelationships.ts - use Patient Relationships
 * Purpose: React hook for managing PatientRelationships data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

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

// Composite hooks
export const usePatientWithFamily = (patientId: string) => {
  const patientQuery = useQuery({
    queryKey: [QUERY_KEYS.PATIENT, patientId],
    queryFn: () => api.patients.getById(patientId),
    enabled: !!patientId,
  });
  const familyQuery = usePatientFamily(patientId);
  const relationshipsQuery = usePatientRelationships(patientId);

  return {
    patient: patientQuery,
    family: familyQuery,
    relationships: relationshipsQuery,
    isLoading: patientQuery.isLoading || familyQuery.isLoading || relationshipsQuery.isLoading,
    isError: patientQuery.isError || familyQuery.isError || relationshipsQuery.isError,
  };
};
