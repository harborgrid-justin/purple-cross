/**
 * WF-COMP-XXX | useClientPortal.ts - use Client Portal
 * Purpose: React hook for managing ClientPortal data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useClientPortal = (id: string) => {
  return useQuery({
    queryKey: ['clientPortal', id],
    queryFn: () => api.clientPortal.getById(id),
    enabled: !!id,
  });
};

export const useClientPortalLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.clientPortal.login(credentials),
  });
};

export const useCreateClientPortal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.clientPortal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientPortal'] });
    },
  });
};

export const useUpdateClientPortal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.clientPortal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientPortal'] });
    },
  });
};

export const useUpdateClientPortalPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      api.clientPortal.updatePassword(id, newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientPortal'] });
    },
  });
};

export const useEnableClientPortalTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, secret }: { id: string; secret: string }) =>
      api.clientPortal.enableTwoFactor(id, secret),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientPortal'] });
    },
  });
};

export const useDisableClientPortalTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.clientPortal.disableTwoFactor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientPortal'] });
    },
  });
};

export const useDeleteClientPortal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.clientPortal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientPortal'] });
    },
  });
};
