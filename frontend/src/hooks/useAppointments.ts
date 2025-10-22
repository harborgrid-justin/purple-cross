import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useAppointments = (params?: { page?: number; limit?: number; date?: string }) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => api.appointments.getAll(params),
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.appointments.getById(id),
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.appointments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.appointments.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.appointments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Composite hooks
export const useAppointmentWithPatient = (id: string) => {
  const appointmentQuery = useAppointment(id);
  const patientId = (appointmentQuery.data as { data?: { patientId?: string } })?.data?.patientId;
  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.patients.getById(patientId as string),
    enabled: !!patientId,
  });

  return {
    appointment: appointmentQuery,
    patient: patientQuery,
    isLoading: appointmentQuery.isLoading || patientQuery.isLoading,
    isError: appointmentQuery.isError || patientQuery.isError,
  };
};

export const useAppointmentWithClient = (id: string) => {
  const appointmentQuery = useAppointment(id);
  const clientId = (appointmentQuery.data as { data?: { clientId?: string } })?.data?.clientId;
  const clientQuery = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => api.clients.getById(clientId as string),
    enabled: !!clientId,
  });

  return {
    appointment: appointmentQuery,
    client: clientQuery,
    isLoading: appointmentQuery.isLoading || clientQuery.isLoading,
    isError: appointmentQuery.isError || clientQuery.isError,
  };
};
