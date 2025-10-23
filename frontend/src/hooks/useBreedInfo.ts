/**
 * WF-COMP-XXX | useBreedInfo.ts - use Breed Info
 * Purpose: React hook for managing BreedInfo data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useBreedInfo = (params?: { page?: number; limit?: number; species?: string }) => {
  return useQuery({
    queryKey: ['breedInfo', params],
    queryFn: () => api.breedInfo.getAll(params),
  });
};

export const useBreedInfoById = (id: string) => {
  return useQuery({
    queryKey: ['breedInfo', id],
    queryFn: () => api.breedInfo.getById(id),
    enabled: !!id,
  });
};

export const useBreedInfoByBreed = (breed: string) => {
  return useQuery({
    queryKey: ['breedInfo', 'breed', breed],
    queryFn: () => api.breedInfo.getByBreed(breed),
    enabled: !!breed,
  });
};

export const useCreateBreedInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.breedInfo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breedInfo'] });
    },
  });
};

export const useUpdateBreedInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.breedInfo.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breedInfo'] });
    },
  });
};

export const useDeleteBreedInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.breedInfo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breedInfo'] });
    },
  });
};
