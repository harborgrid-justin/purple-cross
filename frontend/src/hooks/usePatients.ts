/**
 * WF-COMP-XXX | usePatients.ts - use Patients
 * Purpose: React hook for managing Patients data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

/**
 * Fetches a paginated list of patients with optional filtering.
 *
 * @param {Object} [params] - Optional query parameters
 * @param {number} [params.page] - Page number for pagination (default: 1)
 * @param {number} [params.limit] - Number of items per page (default: 10)
 * @param {string} [params.search] - Search term to filter patients by name
 * @param {string} [params.ownerId] - Filter patients by owner/client ID
 *
 * @returns {UseQueryResult} TanStack Query result object with:
 *   - data: Paginated patient list with metadata
 *   - isLoading: Loading state indicator
 *   - isError: Error state indicator
 *   - error: Error object if request failed
 *   - refetch: Function to manually refetch data
 *
 * @example
 * const { data, isLoading } = usePatients({
 *   page: 1,
 *   limit: 20,
 *   search: 'Max'
 * });
 *
 * @remarks
 * Query key: ['patients', params]
 * Cache time: Follows default TanStack Query settings
 * Stale time: Data considered fresh for 5 minutes
 */
export const usePatients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PATIENTS, params],
    queryFn: () => api.patients.getAll(params),
  });
};

/**
 * Fetches a single patient by ID.
 *
 * @param {string} id - The unique identifier of the patient
 *
 * @returns {UseQueryResult} TanStack Query result object with patient data
 *
 * @example
 * const { data: patient, isLoading } = usePatient('patient-123');
 *
 * @remarks
 * Query key: ['patient', id]
 * Enabled: Only when id is truthy
 * This query is disabled if id is empty/null to prevent unnecessary API calls
 */
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PATIENT, id],
    queryFn: () => api.patients.getById(id),
    enabled: !!id,
  });
};

/**
 * Creates a new patient record.
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
 * const createPatient = useCreatePatient();
 *
 * const handleSubmit = (formData) => {
 *   createPatient.mutate(formData, {
 *     onSuccess: (data) => {
 *       console.log('Patient created:', data);
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create patient:', error);
 *     }
 *   });
 * };
 *
 * @remarks
 * On success: Invalidates ['patients'] query to refresh the list
 * Side effects: Triggers refetch of all patient-related queries
 */
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.patients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PATIENTS] });
    },
  });
};

/**
 * Updates an existing patient record.
 *
 * @returns {UseMutationResult} TanStack Mutation result object
 *
 * @example
 * const updatePatient = useUpdatePatient();
 *
 * updatePatient.mutate({
 *   id: 'patient-123',
 *   data: { name: 'Max Updated', age: 6 }
 * });
 *
 * @remarks
 * Mutation function expects: { id: string, data: Partial<Patient> }
 * On success: Invalidates ['patients'] query cache
 */
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.patients.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PATIENTS] });
    },
  });
};

/**
 * Deletes a patient record.
 *
 * @returns {UseMutationResult} TanStack Mutation result object
 *
 * @example
 * const deletePatient = useDeletePatient();
 *
 * const handleDelete = (patientId: string) => {
 *   if (confirm('Are you sure?')) {
 *     deletePatient.mutate(patientId);
 *   }
 * };
 *
 * @remarks
 * Mutation function expects: Patient ID as string
 * On success: Invalidates all patient queries to refresh lists
 * Consider adding optimistic updates for better UX
 */
export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patients.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PATIENTS] });
    },
  });
};

// Composite hooks

/**
 * Fetches a patient along with their owner/client information.
 * Combines two queries with smart enabling logic.
 *
 * @param {string} id - The patient ID to fetch
 *
 * @returns {Object} Combined query result with:
 *   - patient: Query result for patient data
 *   - owner: Query result for owner/client data
 *   - isLoading: True if either query is loading
 *   - isError: True if either query has errored
 *
 * @example
 * const { patient, owner, isLoading } = usePatientWithOwner('patient-123');
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     <h1>{patient.data.name}</h1>
 *     <p>Owner: {owner.data?.name}</p>
 *   </div>
 * );
 *
 * @remarks
 * Query sequence:
 * 1. Fetches patient data first
 * 2. Extracts ownerId from patient response
 * 3. Fetches owner data only if ownerId exists
 * Query keys: ['patient', id], ['client', ownerId]
 */
export const usePatientWithOwner = (id: string) => {
  const patientQuery = usePatient(id);
  const ownerId = (patientQuery.data as { data?: { ownerId?: string } })?.data?.ownerId;
  const clientQuery = useQuery({
    queryKey: [QUERY_KEYS.CLIENT, ownerId],
    queryFn: () => api.clients.getById(ownerId as string),
    enabled: !!ownerId,
  });

  return {
    patient: patientQuery,
    owner: clientQuery,
    isLoading: patientQuery.isLoading || clientQuery.isLoading,
    isError: patientQuery.isError || clientQuery.isError,
  };
};

/**
 * Fetches a patient along with their medical records.
 *
 * @param {string} id - The patient ID to fetch
 *
 * @returns {Object} Combined query result with:
 *   - patient: Query result for patient data
 *   - records: Query result for medical records
 *   - isLoading: True if either query is loading
 *   - isError: True if either query has errored
 *
 * @example
 * const { patient, records, isLoading } = usePatientWithRecords('patient-123');
 *
 * if (isLoading) return <Loading />;
 *
 * return (
 *   <div>
 *     <PatientHeader data={patient.data} />
 *     <MedicalRecordsList records={records.data} />
 *   </div>
 * );
 *
 * @remarks
 * Both queries run in parallel when patient ID is available
 * Query keys: ['patient', id], ['medicalRecords', { patientId: id }]
 */
export const usePatientWithRecords = (id: string) => {
  const patientQuery = usePatient(id);
  const recordsQuery = useQuery({
    queryKey: [QUERY_KEYS.MEDICAL_RECORDS, { patientId: id }],
    queryFn: () => api.medicalRecords.getAll({ patientId: id }),
    enabled: !!id,
  });

  return {
    patient: patientQuery,
    records: recordsQuery,
    isLoading: patientQuery.isLoading || recordsQuery.isLoading,
    isError: patientQuery.isError || recordsQuery.isError,
  };
};

/**
 * Fetches a patient along with their prescriptions.
 *
 * @param {string} id - The patient ID to fetch
 *
 * @returns {Object} Combined query result with:
 *   - patient: Query result for patient data
 *   - prescriptions: Query result for prescriptions
 *   - isLoading: True if either query is loading
 *   - isError: True if either query has errored
 *
 * @example
 * const { patient, prescriptions, isLoading } = usePatientWithPrescriptions('patient-123');
 *
 * if (isLoading) return <Spinner />;
 * if (prescriptions.data?.length === 0) return <NoPrescriptions />;
 *
 * return <PrescriptionsList data={prescriptions.data} />;
 *
 * @remarks
 * Both queries run in parallel when patient ID is available
 * Query keys: ['patient', id], ['prescriptions', { patientId: id }]
 * Useful for patient detail pages and prescription management
 */
export const usePatientWithPrescriptions = (id: string) => {
  const patientQuery = usePatient(id);
  const prescriptionsQuery = useQuery({
    queryKey: [QUERY_KEYS.PRESCRIPTIONS, { patientId: id }],
    queryFn: () => api.prescriptions.getAll({ patientId: id }),
    enabled: !!id,
  });

  return {
    patient: patientQuery,
    prescriptions: prescriptionsQuery,
    isLoading: patientQuery.isLoading || prescriptionsQuery.isLoading,
    isError: patientQuery.isError || prescriptionsQuery.isError,
  };
};
