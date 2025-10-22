import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useInventory = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  lowStock?: boolean;
}) => {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => api.inventory.getAll(params),
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['inventoryItem', id],
    queryFn: () => api.inventory.getById(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.inventory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.inventory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.inventory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// Composite hooks
export const useLowStockInventory = () => {
  return useInventory({ lowStock: true });
};

export const useInventoryByCategory = (category: string) => {
  return useInventory({ category });
};

export const useInventoryWithOrders = () => {
  const inventoryQuery = useInventory();
  const purchaseOrdersQuery = useQuery({
    queryKey: ['purchaseOrders', 'pending'],
    queryFn: () => api.purchaseOrders.getAll(),
  });

  return {
    inventory: inventoryQuery,
    pendingOrders: purchaseOrdersQuery,
    isLoading: inventoryQuery.isLoading || purchaseOrdersQuery.isLoading,
    isError: inventoryQuery.isError || purchaseOrdersQuery.isError,
  };
};
