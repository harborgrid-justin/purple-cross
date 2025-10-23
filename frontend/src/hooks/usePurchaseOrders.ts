/**
 * WF-COMP-XXX | usePurchaseOrders.ts - use Purchase Orders
 * Purpose: React hook for managing PurchaseOrders data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const usePurchaseOrders = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['purchaseOrders', params],
    queryFn: () => api.purchaseOrders.getAll(params),
  });
};

export const usePurchaseOrder = (id: string) => {
  return useQuery({
    queryKey: ['purchaseOrder', id],
    queryFn: () => api.purchaseOrders.getById(id),
    enabled: !!id,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.purchaseOrders.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
};

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.purchaseOrders.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
};

export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.purchaseOrders.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
};

export const useReceivePurchaseOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, itemsData }: { id: string; itemsData: unknown }) =>
      api.purchaseOrders.receiveItems(id, itemsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.purchaseOrders.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
};

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.purchaseOrders.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
};

// Composite hooks
export const usePendingPurchaseOrders = () => {
  return usePurchaseOrders();
};

export const usePurchaseOrderWithInventory = (id: string) => {
  const purchaseOrderQuery = usePurchaseOrder(id);
  const inventoryQuery = useQuery({
    queryKey: ['inventory', { lowStock: true }],
    queryFn: () => api.inventory.getAll({ lowStock: true }),
  });

  return {
    purchaseOrder: purchaseOrderQuery,
    lowStockItems: inventoryQuery,
    isLoading: purchaseOrderQuery.isLoading || inventoryQuery.isLoading,
    isError: purchaseOrderQuery.isError || inventoryQuery.isError,
  };
};
