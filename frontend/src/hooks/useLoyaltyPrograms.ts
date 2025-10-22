import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useLoyaltyPrograms = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['loyaltyPrograms', params],
    queryFn: () => api.loyaltyPrograms.getAll(params),
  });
};

export const useLoyaltyProgram = (id: string) => {
  return useQuery({
    queryKey: ['loyaltyProgram', id],
    queryFn: () => api.loyaltyPrograms.getById(id),
    enabled: !!id,
  });
};

export const useLoyaltyProgramByClient = (clientId: string) => {
  return useQuery({
    queryKey: ['loyaltyProgram', 'client', clientId],
    queryFn: () => api.loyaltyPrograms.getByClient(clientId),
    enabled: !!clientId,
  });
};

export const useLoyaltyProgramTransactions = (loyaltyProgramId: string) => {
  return useQuery({
    queryKey: ['loyaltyProgram', loyaltyProgramId, 'transactions'],
    queryFn: () => api.loyaltyPrograms.getTransactions(loyaltyProgramId),
    enabled: !!loyaltyProgramId,
  });
};

export const useCreateLoyaltyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.loyaltyPrograms.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] });
    },
  });
};

export const useUpdateLoyaltyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.loyaltyPrograms.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] });
    },
  });
};

export const useAddLoyaltyPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { loyaltyProgramId: string; points: number; reason?: string }) =>
      api.loyaltyPrograms.addPoints(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] });
    },
  });
};

export const useRedeemLoyaltyPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { loyaltyProgramId: string; points: number; reason?: string }) =>
      api.loyaltyPrograms.redeemPoints(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] });
    },
  });
};

export const useDeleteLoyaltyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.loyaltyPrograms.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] });
    },
  });
};

// Composite hooks
export const useClientLoyaltyDetails = (clientId: string) => {
  const loyaltyProgramQuery = useLoyaltyProgramByClient(clientId);
  const programId = (loyaltyProgramQuery.data as { data?: { id?: string } })?.data?.id;
  const transactionsQuery = useQuery({
    queryKey: ['loyaltyProgram', programId, 'transactions'],
    queryFn: () => api.loyaltyPrograms.getTransactions(programId as string),
    enabled: !!programId,
  });

  return {
    loyaltyProgram: loyaltyProgramQuery,
    transactions: transactionsQuery,
    isLoading: loyaltyProgramQuery.isLoading || transactionsQuery.isLoading,
    isError: loyaltyProgramQuery.isError || transactionsQuery.isError,
  };
};
