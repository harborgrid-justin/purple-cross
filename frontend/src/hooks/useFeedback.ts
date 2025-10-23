/**
 * WF-COMP-XXX | useFeedback.ts - use Feedback
 * Purpose: React hook for managing Feedback data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useFeedback = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['feedback', params],
    queryFn: () => api.feedback.getAll(params),
  });
};

export const useFeedbackItem = (id: string) => {
  return useQuery({
    queryKey: ['feedback', id],
    queryFn: () => api.feedback.getById(id),
    enabled: !!id,
  });
};

export const useNPSScore = () => {
  return useQuery({
    queryKey: ['feedback', 'nps'],
    queryFn: () => api.feedback.getNPSScore(),
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.feedback.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.feedback.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};

export const useReviewFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewData }: { id: string; reviewData: unknown }) =>
      api.feedback.review(id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.feedback.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};

// Survey hooks
export const useSurvey = (id: string) => {
  return useQuery({
    queryKey: ['survey', id],
    queryFn: () => api.feedback.getSurvey(id),
    enabled: !!id,
  });
};

export const useCreateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.feedback.createSurvey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};

export const usePublishSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.feedback.publishSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey'] });
    },
  });
};

export const useSubmitSurveyResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.feedback.submitSurveyResponse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};
