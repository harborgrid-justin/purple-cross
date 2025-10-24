/**
 * WF-COMP-XXX | useAppointments.ts - use Appointments
 * Purpose: React hook for managing Appointments data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants';

/**
 * Fetches a paginated list of appointments with optional filtering.
 *
 * @param {Object} [params] - Optional query parameters
 * @param {number} [params.page] - Page number for pagination (default: 1)
 * @param {number} [params.limit] - Number of items per page (default: 10)
 * @param {string} [params.date] - Filter by appointment date (ISO format)
 *
 * @returns {UseQueryResult} TanStack Query result object with:
 *   - data: Paginated appointment list with metadata
 *   - isLoading: Loading state indicator
 *   - isError: Error state indicator
 *   - error: Error object if request failed
 *   - refetch: Function to manually refetch data
 *
 * @example
 * const { data, isLoading } = useAppointments({
 *   page: 1,
 *   limit: 20,
 *   date: '2025-10-23'
 * });
 *
 * @remarks
 * Query key: ['appointments', params]
 * Cache time: Follows default TanStack Query settings
 * Useful for appointment calendars and scheduling views
 */
export const useAppointments = (params?: { page?: number; limit?: number; date?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS, params],
    queryFn: () => api.appointments.getAll(params),
    // Dynamic staleTime: Appointments change frequently throughout the day
    // Staff needs near real-time updates for scheduling and patient flow
    staleTime: QUERY_STALE_TIME.DYNAMIC,
  });
};

/**
 * Fetches a single appointment by ID.
 *
 * @param {string} id - The unique identifier of the appointment
 *
 * @returns {UseQueryResult} TanStack Query result object with appointment data
 *
 * @example
 * const { data: appointment, isLoading } = useAppointment('appt-123');
 *
 * @remarks
 * Query key: ['appointment', id]
 * Enabled: Only when id is truthy
 * This query is disabled if id is empty/null to prevent unnecessary API calls
 */
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENT, id],
    queryFn: () => api.appointments.getById(id),
    enabled: !!id,
    // Dynamic staleTime: Individual appointment details may update frequently
    staleTime: QUERY_STALE_TIME.DYNAMIC,
  });
};

/**
 * Creates a new appointment record.
 *
 * @returns {UseMutationResult} TanStack Mutation result object with:
 *   - mutate: Function to trigger the mutation
 *   - mutateAsync: Async version of mutate
 *   - isLoading: Loading state indicator
 *   - isError: Error state indicator
 *   - isSuccess: Success state indicator
 *   - data: Response data from successful mutation
 *
 * @example
 * const createAppointment = useCreateAppointment();
 *
 * const handleSubmit = (formData) => {
 *   createAppointment.mutate(formData, {
 *     onSuccess: (data) => {
 *       console.log('Appointment created:', data);
 *       navigate(`/appointments/${data.id}`);
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create appointment:', error);
 *     }
 *   });
 * };
 *
 * @remarks
 * On success: Invalidates ['appointments'] query to refresh the list
 * Side effects: Triggers refetch of all appointment-related queries
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.appointments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
  });
};

/**
 * Updates an existing appointment record.
 *
 * @returns {UseMutationResult} TanStack Mutation result object
 *
 * @example
 * const updateAppointment = useUpdateAppointment();
 *
 * updateAppointment.mutate({
 *   id: 'appt-123',
 *   data: { startTime: '2025-10-24T10:00:00Z', status: 'confirmed' }
 * });
 *
 * @remarks
 * Mutation function expects: { id: string, data: Partial<Appointment> }
 * On success: Invalidates ['appointments'] query cache
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.appointments.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
  });
};

/**
 * Deletes an appointment record.
 *
 * @returns {UseMutationResult} TanStack Mutation result object
 *
 * @example
 * const deleteAppointment = useDeleteAppointment();
 *
 * const handleDelete = (appointmentId: string) => {
 *   if (confirm('Are you sure you want to cancel this appointment?')) {
 *     deleteAppointment.mutate(appointmentId);
 *   }
 * };
 *
 * @remarks
 * Mutation function expects: Appointment ID as string
 * On success: Invalidates all appointment queries to refresh lists
 * Consider adding optimistic updates for better UX
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.appointments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
  });
};

// Composite hooks

/**
 * Fetches an appointment along with the associated patient information.
 * Combines two queries with smart enabling logic.
 *
 * @param {string} id - The appointment ID to fetch
 *
 * @returns {Object} Combined query result with:
 *   - appointment: Query result for appointment data
 *   - patient: Query result for patient data
 *   - isLoading: True if either query is loading
 *   - isError: True if either query has errored
 *
 * @example
 * const { appointment, patient, isLoading } = useAppointmentWithPatient('appt-123');
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     <h1>Appointment for {patient.data?.name}</h1>
 *     <p>Time: {appointment.data?.startTime}</p>
 *   </div>
 * );
 *
 * @remarks
 * Query sequence:
 * 1. Fetches appointment data first
 * 2. Extracts patientId from appointment response
 * 3. Fetches patient data only if patientId exists
 * Query keys: ['appointment', id], ['patient', patientId]
 */
export const useAppointmentWithPatient = (id: string) => {
  const appointmentQuery = useAppointment(id);
  const patientId = (appointmentQuery.data as { data?: { patientId?: string } })?.data?.patientId;
  const patientQuery = useQuery({
    queryKey: [QUERY_KEYS.PATIENT, patientId],
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

/**
 * Fetches an appointment along with the associated client information.
 *
 * @param {string} id - The appointment ID to fetch
 *
 * @returns {Object} Combined query result with:
 *   - appointment: Query result for appointment data
 *   - client: Query result for client/owner data
 *   - isLoading: True if either query is loading
 *   - isError: True if either query has errored
 *
 * @example
 * const { appointment, client, isLoading } = useAppointmentWithClient('appt-123');
 *
 * if (isLoading) return <Loading />;
 *
 * return (
 *   <AppointmentCard
 *     appointment={appointment.data}
 *     clientName={client.data?.name}
 *     clientPhone={client.data?.phone}
 *   />
 * );
 *
 * @remarks
 * Query sequence:
 * 1. Fetches appointment data first
 * 2. Extracts clientId from appointment response
 * 3. Fetches client data only if clientId exists
 * Query keys: ['appointment', id], ['client', clientId]
 * Useful for appointment detail pages and scheduling
 */
export const useAppointmentWithClient = (id: string) => {
  const appointmentQuery = useAppointment(id);
  const clientId = (appointmentQuery.data as { data?: { clientId?: string } })?.data?.clientId;
  const clientQuery = useQuery({
    queryKey: [QUERY_KEYS.CLIENT, clientId],
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
