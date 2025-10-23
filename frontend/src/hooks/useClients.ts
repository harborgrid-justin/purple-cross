/**
 * WF-COMP-XXX | useClients.ts - use Clients
 * Purpose: React hook for managing Clients data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useClients = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => api.clients.getAll(params),
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => api.clients.getById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.clients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.clients.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.clients.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Composite hooks
export const useClientWithPatients = (id: string) => {
  const clientQuery = useClient(id);
  const patientsQuery = useQuery({
    queryKey: ['patients', { ownerId: id }],
    queryFn: () => api.patients.getAll({ ownerId: id }),
    enabled: !!id,
  });

  return {
    client: clientQuery,
    patients: patientsQuery,
    isLoading: clientQuery.isLoading || patientsQuery.isLoading,
    isError: clientQuery.isError || patientsQuery.isError,
  };
};

export const useClientWithAppointments = (id: string) => {
  const clientQuery = useClient(id);
  const patientsQuery = useQuery({
    queryKey: ['patients', { ownerId: id }],
    queryFn: () => api.patients.getAll({ ownerId: id }),
    enabled: !!id,
  });

  return {
    client: clientQuery,
    patients: patientsQuery,
    isLoading: clientQuery.isLoading || patientsQuery.isLoading,
    isError: clientQuery.isError || patientsQuery.isError,
  };
};

export const useClientWithInvoices = (id: string) => {
  const clientQuery = useClient(id);
  const invoicesQuery = useQuery({
    queryKey: ['invoices', { clientId: id }],
    queryFn: () => api.invoices.getAll({ clientId: id }),
    enabled: !!id,
  });

  return {
    client: clientQuery,
    invoices: invoicesQuery,
    isLoading: clientQuery.isLoading || invoicesQuery.isLoading,
    isError: clientQuery.isError || invoicesQuery.isError,
  };
};
