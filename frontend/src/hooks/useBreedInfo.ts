/**
 * WF-COMP-XXX | useBreedInfo.ts - use Breed Info
 * Purpose: React hook for managing BreedInfo data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';
import { QUERY_STALE_TIME } from '@/constants';

export const useBreedInfo = (params?: { page?: number; limit?: number; species?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BREED_INFO, params],
    queryFn: () => api.breedInfo.getAll(params),
    // Static staleTime: Breed information is reference data that rarely changes
    staleTime: QUERY_STALE_TIME.STATIC,
  });
};

export const useBreedInfoById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BREED_INFO, id],
    queryFn: () => api.breedInfo.getById(id),
    enabled: !!id,
    // Static staleTime: Breed information is reference data that rarely changes
    staleTime: QUERY_STALE_TIME.STATIC,
  });
};

export const useBreedInfoByBreed = (breed: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BREED_INFO, 'breed', breed],
    queryFn: () => api.breedInfo.getByBreed(breed),
    enabled: !!breed,
    // Static staleTime: Breed information is reference data that rarely changes
    staleTime: QUERY_STALE_TIME.STATIC,
  });
};

export const useCreateBreedInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.breedInfo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BREED_INFO] });
    },
  });
};

export const useUpdateBreedInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.breedInfo.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BREED_INFO] });
    },
  });
};

export const useDeleteBreedInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.breedInfo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BREED_INFO] });
    },
  });
};
