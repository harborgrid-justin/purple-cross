/**
 * WF-COMP-XXX | useEquipment.ts - use Equipment
 * Purpose: React hook for managing Equipment data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useEquipment = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['equipment', params],
    queryFn: () => api.equipment.getAll(params),
  });
};

export const useEquipmentItem = (id: string) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => api.equipment.getById(id),
    enabled: !!id,
  });
};

export const useMaintenanceSchedule = () => {
  return useQuery({
    queryKey: ['equipment', 'maintenance', 'schedule'],
    queryFn: () => api.equipment.getMaintenanceSchedule(),
  });
};

export const useUpcomingMaintenance = () => {
  return useQuery({
    queryKey: ['equipment', 'maintenance', 'upcoming'],
    queryFn: () => api.equipment.getUpcomingMaintenance(),
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.equipment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.equipment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
};

export const useScheduleMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (maintenanceData: unknown) => api.equipment.scheduleMaintenance(maintenanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', 'maintenance'] });
    },
  });
};

export const useCompleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (maintenanceId: string) => api.equipment.completeMaintenance(maintenanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', 'maintenance'] });
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.equipment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
};
