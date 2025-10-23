/**
 * WF-COMP-XXX | useInvoices.ts - use Invoices
 * Purpose: React hook for managing Invoices data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useInvoices = (params?: {
  page?: number;
  limit?: number;
  clientId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => api.invoices.getAll(params),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => api.invoices.getById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.invoices.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.invoices.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.invoices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

// Composite hooks
export const useInvoiceWithClient = (id: string) => {
  const invoiceQuery = useInvoice(id);
  const clientId = (invoiceQuery.data as { data?: { clientId?: string } })?.data?.clientId;
  const clientQuery = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => api.clients.getById(clientId as string),
    enabled: !!clientId,
  });

  return {
    invoice: invoiceQuery,
    client: clientQuery,
    isLoading: invoiceQuery.isLoading || clientQuery.isLoading,
    isError: invoiceQuery.isError || clientQuery.isError,
  };
};

export const useClientBilling = (clientId: string) => {
  const invoicesQuery = useInvoices({ clientId });
  const estimatesQuery = useQuery({
    queryKey: ['estimates', clientId],
    queryFn: () => api.estimates.getAll(),
    enabled: !!clientId,
  });
  const paymentPlansQuery = useQuery({
    queryKey: ['paymentPlans', clientId],
    queryFn: () => api.paymentPlans.getAll(),
    enabled: !!clientId,
  });

  return {
    invoices: invoicesQuery,
    estimates: estimatesQuery,
    paymentPlans: paymentPlansQuery,
    isLoading: invoicesQuery.isLoading || estimatesQuery.isLoading || paymentPlansQuery.isLoading,
    isError: invoicesQuery.isError || estimatesQuery.isError || paymentPlansQuery.isError,
  };
};
