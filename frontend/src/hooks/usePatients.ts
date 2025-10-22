import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchPatients,
  fetchPatientById,
  setFilters,
  clearFilters,
} from '@/store/slices/patientsSlice';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  owner: {
    firstName: string;
    lastName: string;
  };
}

export interface PatientsResponse {
  status: string;
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Enhanced hook that uses both Redux and React Query
export const usePatients = (params?: { page?: number; limit?: number; search?: string }) => {
  const dispatch = useAppDispatch();
  const { patients, loading, error, pagination } = useAppSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients(params));
  }, [dispatch, params]);

  return {
    data: patients,
    isLoading: loading,
    error,
    pagination,
  };
};

// Hook for React Query only (backward compatibility)
export const usePatientsQuery = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => api.patients.getAll(params),
  });
};

export const usePatient = (id: string) => {
  const dispatch = useAppDispatch();
  const { selectedPatient, loading, error } = useAppSelector((state) => state.patients);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientById(id));
    }
  }, [dispatch, id]);

  return {
    data: selectedPatient,
    isLoading: loading,
    error,
  };
};

export const usePatientQuery = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => api.patients.getById(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const result = await api.patients.create(data);
      // Refresh the Redux store after API success
      dispatch(fetchPatients());
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const result = await api.patients.update(id, data);
      // Refresh the Redux store after API success
      dispatch(fetchPatients());
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useDeletePatient = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await api.patients.delete(id);
      // Refresh the Redux store after API success
      dispatch(fetchPatients());
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Hook for managing patient filters
export const usePatientsFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.patients.filters);

  return {
    filters,
    setFilters: (newFilters: Partial<typeof filters>) => dispatch(setFilters(newFilters)),
    clearFilters: () => dispatch(clearFilters()),
  };
};

// Composite hooks
export const usePatientWithOwner = (id: string) => {
  const patientQuery = usePatient(id);
  const ownerId = patientQuery.data?.ownerId;
  const clientQuery = useQuery({
    queryKey: ['client', ownerId],
    queryFn: () => api.clients.getById(ownerId as string),
    enabled: !!ownerId,
  });

  return {
    patient: patientQuery,
    owner: clientQuery,
    isLoading: patientQuery.isLoading || clientQuery.isLoading,
    isError: !!patientQuery.error || clientQuery.isError,
  };
};

export const usePatientWithRecords = (id: string) => {
  const patientQuery = usePatient(id);
  const recordsQuery = useQuery({
    queryKey: ['medicalRecords', { patientId: id }],
    queryFn: () => api.medicalRecords.getAll({ patientId: id }),
    enabled: !!id,
  });

  return {
    patient: patientQuery,
    records: recordsQuery,
    isLoading: patientQuery.isLoading || recordsQuery.isLoading,
    isError: !!patientQuery.error || recordsQuery.isError,
  };
};

export const usePatientWithPrescriptions = (id: string) => {
  const patientQuery = usePatient(id);
  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions', { patientId: id }],
    queryFn: () => api.prescriptions.getAll({ patientId: id }),
    enabled: !!id,
  });

  return {
    patient: patientQuery,
    prescriptions: prescriptionsQuery,
    isLoading: patientQuery.isLoading || prescriptionsQuery.isLoading,
    isError: !!patientQuery.error || prescriptionsQuery.isError,
  };
};
