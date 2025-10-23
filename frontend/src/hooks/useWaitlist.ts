/**
 * WF-COMP-XXX | useWaitlist.ts - use Waitlist
 * Purpose: React hook for managing Waitlist data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useWaitlist = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['waitlist', params],
    queryFn: () => api.waitlist.getAll(params),
  });
};

export const useWaitlistItem = (id: string) => {
  return useQuery({
    queryKey: ['waitlist', id],
    queryFn: () => api.waitlist.getById(id),
    enabled: !!id,
  });
};

export const useCreateWaitlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.waitlist.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useUpdateWaitlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.waitlist.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useNotifyWaitlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.waitlist.notify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useBookWaitlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, appointmentData }: { id: string; appointmentData: unknown }) =>
      api.waitlist.book(id, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useCancelWaitlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.waitlist.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useDeleteWaitlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.waitlist.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};
