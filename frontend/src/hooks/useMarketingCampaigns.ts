import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useMarketingCampaigns = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['marketingCampaigns', params],
    queryFn: () => api.marketingCampaigns.getAll(params),
  });
};

export const useMarketingCampaign = (id: string) => {
  return useQuery({
    queryKey: ['marketingCampaign', id],
    queryFn: () => api.marketingCampaigns.getById(id),
    enabled: !!id,
  });
};

export const useCreateMarketingCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.marketingCampaigns.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
    },
  });
};

export const useUpdateMarketingCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.marketingCampaigns.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
    },
  });
};

export const useLaunchMarketingCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.marketingCampaigns.launch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
    },
  });
};

export const useUpdateMarketingCampaignMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, metrics }: { id: string; metrics: unknown }) =>
      api.marketingCampaigns.updateMetrics(id, metrics),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
    },
  });
};

export const useCompleteMarketingCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.marketingCampaigns.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
    },
  });
};

export const useDeleteMarketingCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.marketingCampaigns.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
    },
  });
};
