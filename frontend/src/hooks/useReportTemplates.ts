import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useReportTemplates = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['reportTemplates', params],
    queryFn: () => api.reportTemplates.getAll(params),
  });
};

export const useReportTemplate = (id: string) => {
  return useQuery({
    queryKey: ['reportTemplate', id],
    queryFn: () => api.reportTemplates.getById(id),
    enabled: !!id,
  });
};

export const useScheduledReports = () => {
  return useQuery({
    queryKey: ['reportTemplates', 'scheduled'],
    queryFn: () => api.reportTemplates.getScheduledReports(),
  });
};

export const useCreateReportTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.reportTemplates.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportTemplates'] });
    },
  });
};

export const useUpdateReportTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.reportTemplates.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportTemplates'] });
    },
  });
};

export const useIncrementReportTemplateUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.reportTemplates.incrementUsage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportTemplates'] });
    },
  });
};

export const useScheduleReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleData: unknown) => api.reportTemplates.scheduleReport(scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportTemplates', 'scheduled'] });
    },
  });
};

export const useDeleteReportTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.reportTemplates.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportTemplates'] });
    },
  });
};
