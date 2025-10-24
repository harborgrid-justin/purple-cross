/**
 * WF-COMP-XXX | usePatientReminders.ts - use Patient Reminders
 * Purpose: React hook for managing PatientReminders data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

export const usePatientReminders = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['patientReminders', params],
    queryFn: () => api.patientReminders.getAll(params),
  });
};

export const usePatientReminder = (id: string) => {
  return useQuery({
    queryKey: ['patientReminder', id],
    queryFn: () => api.patientReminders.getById(id),
    enabled: !!id,
  });
};

export const useDuePatientReminders = () => {
  return useQuery({
    queryKey: ['patientReminders', 'due'],
    queryFn: () => api.patientReminders.getDue(),
  });
};

export const useCreatePatientReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.patientReminders.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientReminders'] });
    },
  });
};

export const useUpdatePatientReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patientReminders.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientReminders'] });
    },
  });
};

export const useCompletePatientReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patientReminders.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientReminders'] });
    },
  });
};

export const useDeletePatientReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patientReminders.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientReminders'] });
    },
  });
};
