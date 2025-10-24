/**
 * WF-COMP-XXX | useInsuranceClaims.ts - use Insurance Claims
 * Purpose: React hook for managing InsuranceClaims data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

export const useInsuranceClaims = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INSURANCE_CLAIMS, params],
    queryFn: () => api.insuranceClaims.getAll(params),
  });
};

export const useInsuranceClaim = (id: string) => {
  return useQuery({
    queryKey: ['insuranceClaim', id],
    queryFn: () => api.insuranceClaims.getById(id),
    enabled: !!id,
  });
};

export const useCreateInsuranceClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.insuranceClaims.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSURANCE_CLAIMS] });
    },
  });
};

export const useUpdateInsuranceClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.insuranceClaims.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSURANCE_CLAIMS] });
    },
  });
};

export const useUpdateInsuranceClaimStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statusData }: { id: string; statusData: unknown }) =>
      api.insuranceClaims.updateStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSURANCE_CLAIMS] });
    },
  });
};

export const useProcessInsuranceClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.insuranceClaims.processClaim(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSURANCE_CLAIMS] });
    },
  });
};

export const useDeleteInsuranceClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.insuranceClaims.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSURANCE_CLAIMS] });
    },
  });
};
