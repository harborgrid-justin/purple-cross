/**
 * WF-COMP-XXX | useInventory.ts - use Inventory
 * Purpose: React hook for managing Inventory data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';
import { QUERY_STALE_TIME } from '@/constants';

export const useInventory = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  lowStock?: boolean;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, params],
    queryFn: () => api.inventory.getAll(params),
    // Semi-static staleTime: General inventory doesn't change too frequently
    // But low stock queries need fresher data (see useLowStockInventory below)
    staleTime: params?.lowStock ? QUERY_STALE_TIME.DYNAMIC : QUERY_STALE_TIME.SEMI_STATIC,
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY_ITEM, id],
    queryFn: () => api.inventory.getById(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.inventory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.inventory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.inventory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] });
    },
  });
};

// Composite hooks
export const useLowStockInventory = () => {
  // Low stock inventory needs dynamic updates for immediate reordering
  return useInventory({ lowStock: true });
};

export const useInventoryByCategory = (category: string) => {
  return useInventory({ category });
};

export const useInventoryWithOrders = () => {
  const inventoryQuery = useInventory();
  const purchaseOrdersQuery = useQuery({
    queryKey: [QUERY_KEYS.PURCHASE_ORDERS, 'pending'],
    queryFn: () => api.purchaseOrders.getAll(),
  });

  return {
    inventory: inventoryQuery,
    pendingOrders: purchaseOrdersQuery,
    isLoading: inventoryQuery.isLoading || purchaseOrdersQuery.isLoading,
    isError: inventoryQuery.isError || purchaseOrdersQuery.isError,
  };
};
