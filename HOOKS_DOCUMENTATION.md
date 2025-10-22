# React Query Hooks Documentation

This document provides a comprehensive overview of all React Query hooks implemented in the Purple Cross veterinary practice management system.

## Overview

We have implemented **30 hook files** covering all API endpoints with queries, mutations, and composite hooks for convenience.

## Hook Categories

### Core Domain Hooks

#### 1. usePatients.ts
**Purpose**: Patient management operations

**Query Hooks**:
- `usePatients(params?)` - Get all patients with pagination and search
- `usePatient(id)` - Get a single patient by ID

**Mutation Hooks**:
- `useCreatePatient()` - Create a new patient
- `useUpdatePatient()` - Update an existing patient
- `useDeletePatient()` - Delete a patient

**Composite Hooks**:
- `usePatientWithOwner(id)` - Fetch patient with their owner (client) information
- `usePatientWithRecords(id)` - Fetch patient with all medical records
- `usePatientWithPrescriptions(id)` - Fetch patient with all prescriptions

#### 2. useClients.ts
**Purpose**: Client (pet owner) management

**Query Hooks**:
- `useClients(params?)` - Get all clients with pagination and search
- `useClient(id)` - Get a single client by ID

**Mutation Hooks**:
- `useCreateClient()` - Create a new client
- `useUpdateClient()` - Update an existing client
- `useDeleteClient()` - Delete a client

**Composite Hooks**:
- `useClientWithPatients(id)` - Fetch client with all their pets
- `useClientWithAppointments(id)` - Fetch client with all appointments
- `useClientWithInvoices(id)` - Fetch client with billing history

#### 3. useAppointments.ts
**Purpose**: Appointment scheduling and management

**Query Hooks**:
- `useAppointments(params?)` - Get all appointments with filters
- `useAppointment(id)` - Get a single appointment by ID

**Mutation Hooks**:
- `useCreateAppointment()` - Schedule a new appointment
- `useUpdateAppointment()` - Update an existing appointment
- `useDeleteAppointment()` - Cancel an appointment

**Composite Hooks**:
- `useAppointmentWithPatient(id)` - Fetch appointment with patient details
- `useAppointmentWithClient(id)` - Fetch appointment with client details

#### 4. useMedicalRecords.ts
**Purpose**: Medical records and patient history

**Query Hooks**:
- `useMedicalRecords(params?)` - Get medical records, optionally filtered by patient
- `useMedicalRecord(id)` - Get a single medical record

**Mutation Hooks**:
- `useCreateMedicalRecord()` - Create a new medical record
- `useUpdateMedicalRecord()` - Update an existing record
- `useDeleteMedicalRecord()` - Delete a medical record

**Composite Hooks**:
- `useMedicalRecordWithPatient(id)` - Fetch record with patient information
- `usePatientMedicalHistory(patientId)` - Comprehensive patient history including records, prescriptions, and lab tests

#### 5. usePrescriptions.ts
**Purpose**: Prescription management

**Query Hooks**:
- `usePrescriptions(params?)` - Get prescriptions, optionally filtered by patient
- `usePrescription(id)` - Get a single prescription

**Mutation Hooks**:
- `useCreatePrescription()` - Create a new prescription
- `useUpdatePrescription()` - Update an existing prescription
- `useDeletePrescription()` - Delete a prescription

**Composite Hooks**:
- `usePrescriptionWithPatient(id)` - Fetch prescription with patient details

#### 6. useInventory.ts
**Purpose**: Inventory and stock management

**Query Hooks**:
- `useInventory(params?)` - Get inventory items with filters (category, lowStock)
- `useInventoryItem(id)` - Get a single inventory item

**Mutation Hooks**:
- `useCreateInventoryItem()` - Add a new inventory item
- `useUpdateInventoryItem()` - Update inventory item details
- `useDeleteInventoryItem()` - Remove an inventory item

**Composite Hooks**:
- `useLowStockInventory()` - Get items below reorder threshold
- `useInventoryByCategory(category)` - Filter items by category
- `useInventoryWithOrders()` - Inventory items with pending purchase orders

#### 7. useInvoices.ts
**Purpose**: Billing and invoice management

**Query Hooks**:
- `useInvoices(params?)` - Get invoices with filters (clientId, status)
- `useInvoice(id)` - Get a single invoice

**Mutation Hooks**:
- `useCreateInvoice()` - Create a new invoice
- `useUpdateInvoice()` - Update an existing invoice
- `useDeleteInvoice()` - Delete an invoice

**Composite Hooks**:
- `useInvoiceWithClient(id)` - Fetch invoice with client information
- `useClientBilling(clientId)` - Complete billing overview: invoices, estimates, and payment plans

#### 8. useLabTests.ts
**Purpose**: Laboratory test management

**Query Hooks**:
- `useLabTests(params?)` - Get lab tests with filters (patientId, status)
- `useLabTest(id)` - Get a single lab test

**Mutation Hooks**:
- `useCreateLabTest()` - Order a new lab test
- `useUpdateLabTest()` - Update lab test results
- `useDeleteLabTest()` - Cancel a lab test

**Composite Hooks**:
- `useLabTestWithPatient(id)` - Fetch lab test with patient details
- `usePendingLabTests()` - Get all pending lab tests

#### 9. useStaff.ts
**Purpose**: Staff and employee management

**Query Hooks**:
- `useStaff(params?)` - Get staff members with filters (role, status)
- `useStaffMember(id)` - Get a single staff member

**Mutation Hooks**:
- `useCreateStaffMember()` - Add a new staff member
- `useUpdateStaffMember()` - Update staff information
- `useDeleteStaffMember()` - Remove a staff member

#### 10. useDocuments.ts
**Purpose**: Document management

**Query Hooks**:
- `useDocuments(params?)` - Get documents with filters (entityType, entityId)
- `useDocument(id)` - Get a single document

**Mutation Hooks**:
- `useCreateDocument()` - Upload a new document
- `useUpdateDocument()` - Update document metadata
- `useDeleteDocument()` - Delete a document

#### 11. useCommunications.ts
**Purpose**: Client communication tracking

**Query Hooks**:
- `useCommunications(params?)` - Get communications with filters
- `useCommunication(id)` - Get a single communication

**Mutation Hooks**:
- `useCreateCommunication()` - Log a new communication
- `useUpdateCommunication()` - Update communication details
- `useDeleteCommunication()` - Delete a communication record

#### 12. useAnalytics.ts
**Purpose**: Business analytics and reporting

**Query Hooks**:
- `useDashboardAnalytics()` - Get dashboard overview
- `usePatientDemographics()` - Patient population statistics
- `useAppointmentAnalytics(params?)` - Appointment metrics
- `useFinancialReport(params?)` - Financial performance
- `useInventoryReport()` - Inventory analytics
- `useStaffAnalytics()` - Staff performance metrics

### Extended Feature Hooks

#### 13. useBreedInfo.ts
**Purpose**: Pet breed information database

**Query Hooks**:
- `useBreedInfo(params?)` - Get breed information with filters
- `useBreedInfoById(id)` - Get specific breed information
- `useBreedInfoByBreed(breed)` - Look up breed by name

**Mutation Hooks**:
- `useCreateBreedInfo()` - Add breed information
- `useUpdateBreedInfo()` - Update breed details
- `useDeleteBreedInfo()` - Remove breed information

#### 14. usePatientRelationships.ts
**Purpose**: Track relationships between pets (siblings, parents)

**Query Hooks**:
- `usePatientRelationship(id)` - Get a specific relationship
- `usePatientRelationships(patientId)` - Get all relationships for a patient
- `usePatientFamily(patientId)` - Get complete family tree

**Mutation Hooks**:
- `useCreatePatientRelationship()` - Create a new relationship
- `useUpdatePatientRelationship()` - Update relationship details
- `useDeletePatientRelationship()` - Remove a relationship

**Composite Hooks**:
- `usePatientWithFamily(patientId)` - Patient with complete family information

#### 15. usePatientReminders.ts
**Purpose**: Appointment and care reminders

**Query Hooks**:
- `usePatientReminders(params?)` - Get all reminders
- `usePatientReminder(id)` - Get a single reminder
- `useDuePatientReminders()` - Get reminders that are due

**Mutation Hooks**:
- `useCreatePatientReminder()` - Create a new reminder
- `useUpdatePatientReminder()` - Update reminder details
- `useCompletePatientReminder()` - Mark reminder as complete
- `useDeletePatientReminder()` - Delete a reminder

#### 16. useClientPortal.ts
**Purpose**: Client portal access management

**Query Hooks**:
- `useClientPortal(id)` - Get client portal information

**Mutation Hooks**:
- `useClientPortalLogin()` - Authenticate client portal user
- `useCreateClientPortal()` - Create portal access
- `useUpdateClientPortal()` - Update portal settings
- `useUpdateClientPortalPassword()` - Change password
- `useEnableClientPortalTwoFactor()` - Enable 2FA
- `useDisableClientPortalTwoFactor()` - Disable 2FA
- `useDeleteClientPortal()` - Remove portal access

#### 17. useLoyaltyPrograms.ts
**Purpose**: Customer loyalty and rewards programs

**Query Hooks**:
- `useLoyaltyPrograms(params?)` - Get all loyalty programs
- `useLoyaltyProgram(id)` - Get specific program
- `useLoyaltyProgramByClient(clientId)` - Get client's loyalty program
- `useLoyaltyProgramTransactions(id)` - Get point transactions

**Mutation Hooks**:
- `useCreateLoyaltyProgram()` - Create a new program
- `useUpdateLoyaltyProgram()` - Update program details
- `useAddLoyaltyPoints()` - Award points
- `useRedeemLoyaltyPoints()` - Redeem points
- `useDeleteLoyaltyProgram()` - Remove program

**Composite Hooks**:
- `useClientLoyaltyDetails(clientId)` - Complete loyalty information with transactions

#### 18. useFeedback.ts
**Purpose**: Customer feedback and surveys

**Query Hooks**:
- `useFeedback(params?)` - Get all feedback
- `useFeedbackItem(id)` - Get specific feedback
- `useNPSScore()` - Get Net Promoter Score
- `useSurvey(id)` - Get survey details

**Mutation Hooks**:
- `useCreateFeedback()` - Submit feedback
- `useUpdateFeedback()` - Update feedback
- `useReviewFeedback()` - Review and respond to feedback
- `useDeleteFeedback()` - Delete feedback
- `useCreateSurvey()` - Create a new survey
- `usePublishSurvey()` - Publish survey
- `useSubmitSurveyResponse()` - Submit survey response

#### 19. useWaitlist.ts
**Purpose**: Appointment waitlist management

**Query Hooks**:
- `useWaitlist(params?)` - Get waitlist entries
- `useWaitlistItem(id)` - Get specific entry

**Mutation Hooks**:
- `useCreateWaitlistItem()` - Add to waitlist
- `useUpdateWaitlistItem()` - Update waitlist entry
- `useNotifyWaitlistItem()` - Send notification
- `useBookWaitlistItem()` - Convert to appointment
- `useCancelWaitlistItem()` - Cancel waitlist entry
- `useDeleteWaitlistItem()` - Remove from waitlist

#### 20. useTimeBlocks.ts
**Purpose**: Calendar time blocking

**Query Hooks**:
- `useTimeBlocks(params?)` - Get all time blocks
- `useTimeBlock(id)` - Get specific time block

**Mutation Hooks**:
- `useCreateTimeBlock()` - Create time block
- `useUpdateTimeBlock()` - Update time block
- `useDeleteTimeBlock()` - Remove time block

#### 21. useEstimates.ts
**Purpose**: Service estimates and quotes

**Query Hooks**:
- `useEstimates(params?)` - Get all estimates
- `useEstimate(id)` - Get specific estimate

**Mutation Hooks**:
- `useCreateEstimate()` - Create new estimate
- `useUpdateEstimate()` - Update estimate
- `useApproveEstimate()` - Approve estimate
- `useRejectEstimate()` - Reject estimate
- `useConvertEstimateToInvoice()` - Convert to invoice
- `useDeleteEstimate()` - Delete estimate

**Composite Hooks**:
- `useEstimateWithClient(id)` - Estimate with client details

#### 22. usePaymentPlans.ts
**Purpose**: Payment plan management

**Query Hooks**:
- `usePaymentPlans(params?)` - Get all payment plans
- `usePaymentPlan(id)` - Get specific plan
- `useDueInstallments(clientId)` - Get due installments

**Mutation Hooks**:
- `useCreatePaymentPlan()` - Create payment plan
- `useUpdatePaymentPlan()` - Update plan
- `useRecordPayment()` - Record installment payment
- `useCancelPaymentPlan()` - Cancel plan
- `useDeletePaymentPlan()` - Delete plan

#### 23. usePurchaseOrders.ts
**Purpose**: Inventory purchase order management

**Query Hooks**:
- `usePurchaseOrders(params?)` - Get all purchase orders
- `usePurchaseOrder(id)` - Get specific order

**Mutation Hooks**:
- `useCreatePurchaseOrder()` - Create purchase order
- `useUpdatePurchaseOrder()` - Update order
- `useApprovePurchaseOrder()` - Approve order
- `useReceivePurchaseOrderItems()` - Receive inventory
- `useCancelPurchaseOrder()` - Cancel order
- `useDeletePurchaseOrder()` - Delete order

**Composite Hooks**:
- `usePendingPurchaseOrders()` - Get pending orders
- `usePurchaseOrderWithInventory(id)` - Order with low stock items

#### 24. useEquipment.ts
**Purpose**: Medical equipment and maintenance tracking

**Query Hooks**:
- `useEquipment(params?)` - Get all equipment
- `useEquipmentItem(id)` - Get specific equipment
- `useMaintenanceSchedule()` - Get maintenance schedule
- `useUpcomingMaintenance()` - Get upcoming maintenance

**Mutation Hooks**:
- `useCreateEquipment()` - Add equipment
- `useUpdateEquipment()` - Update equipment
- `useScheduleMaintenance()` - Schedule maintenance
- `useCompleteMaintenance()` - Complete maintenance
- `useDeleteEquipment()` - Remove equipment

#### 25. useInsuranceClaims.ts
**Purpose**: Pet insurance claim management

**Query Hooks**:
- `useInsuranceClaims(params?)` - Get all claims
- `useInsuranceClaim(id)` - Get specific claim

**Mutation Hooks**:
- `useCreateInsuranceClaim()` - File new claim
- `useUpdateInsuranceClaim()` - Update claim
- `useUpdateInsuranceClaimStatus()` - Update status
- `useProcessInsuranceClaim()` - Process claim
- `useDeleteInsuranceClaim()` - Delete claim

#### 26. useRefunds.ts
**Purpose**: Refund processing

**Query Hooks**:
- `useRefunds(params?)` - Get all refunds
- `useRefund(id)` - Get specific refund

**Mutation Hooks**:
- `useCreateRefund()` - Create refund
- `useUpdateRefund()` - Update refund
- `useProcessRefund()` - Process refund
- `useDeleteRefund()` - Delete refund

#### 27. useMarketingCampaigns.ts
**Purpose**: Marketing campaign management

**Query Hooks**:
- `useMarketingCampaigns(params?)` - Get all campaigns
- `useMarketingCampaign(id)` - Get specific campaign

**Mutation Hooks**:
- `useCreateMarketingCampaign()` - Create campaign
- `useUpdateMarketingCampaign()` - Update campaign
- `useLaunchMarketingCampaign()` - Launch campaign
- `useUpdateMarketingCampaignMetrics()` - Update metrics
- `useCompleteMarketingCampaign()` - Complete campaign
- `useDeleteMarketingCampaign()` - Delete campaign

#### 28. usePolicies.ts
**Purpose**: Policy and compliance management

**Query Hooks**:
- `usePolicies(params?)` - Get all policies
- `usePolicy(id)` - Get specific policy
- `useUserAcknowledgments(userId)` - Get user acknowledgments

**Mutation Hooks**:
- `useCreatePolicy()` - Create policy
- `useUpdatePolicy()` - Update policy
- `useAcknowledgePolicy()` - Acknowledge policy
- `useDeletePolicy()` - Delete policy

#### 29. useReportTemplates.ts
**Purpose**: Report template management

**Query Hooks**:
- `useReportTemplates(params?)` - Get all templates
- `useReportTemplate(id)` - Get specific template
- `useScheduledReports()` - Get scheduled reports

**Mutation Hooks**:
- `useCreateReportTemplate()` - Create template
- `useUpdateReportTemplate()` - Update template
- `useIncrementReportTemplateUsage()` - Track usage
- `useScheduleReport()` - Schedule report
- `useDeleteReportTemplate()` - Delete template

#### 30. useDocumentTemplates.ts
**Purpose**: Document template and workflow management

**Query Hooks**:
- `useDocumentTemplates(params?)` - Get all templates
- `useDocumentTemplate(id)` - Get specific template
- `useDocumentSignatures(documentId)` - Get signatures

**Mutation Hooks**:
- `useCreateDocumentTemplate()` - Create template
- `useUpdateDocumentTemplate()` - Update template
- `useIncrementDocumentTemplateUsage()` - Track usage
- `useSignDocument()` - Sign document
- `useCreateDocumentWorkflow()` - Create workflow
- `useAdvanceDocumentWorkflow()` - Advance workflow step
- `useDeleteDocumentTemplate()` - Delete template

## Hook Patterns

### Query Hooks
All query hooks follow this pattern:
```typescript
const { data, isLoading, isError, error, refetch } = useEntityName(params);
```

### Mutation Hooks
All mutation hooks follow this pattern:
```typescript
const { mutate, mutateAsync, isLoading, isError, error } = useCreateEntity();

// Usage
mutate(data, {
  onSuccess: (response) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
});
```

### Composite Hooks
Composite hooks combine multiple queries for convenience:
```typescript
const {
  entity1: { data: data1, isLoading: loading1 },
  entity2: { data: data2, isLoading: loading2 },
  isLoading,
  isError
} = useCompositeHook(id);
```

## Benefits

1. **Type Safety**: All hooks are fully typed with TypeScript
2. **Automatic Caching**: React Query handles caching automatically
3. **Automatic Refetching**: Data stays fresh with intelligent refetching
4. **Optimistic Updates**: Mutations can update UI optimistically
5. **Error Handling**: Centralized error handling for all API calls
6. **Query Invalidation**: Automatic cache invalidation on mutations
7. **Composite Hooks**: Convenient hooks for common data combinations

## Usage Examples

### Basic Query
```typescript
import { usePatients } from '@/hooks/usePatients';

function PatientList() {
  const { data, isLoading, error } = usePatients({ page: 1, limit: 10 });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;
  
  return (
    <div>
      {data?.data.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}
```

### Basic Mutation
```typescript
import { useCreatePatient } from '@/hooks/usePatients';

function CreatePatientForm() {
  const createPatient = useCreatePatient();
  
  const handleSubmit = (formData) => {
    createPatient.mutate(formData, {
      onSuccess: () => {
        alert('Patient created successfully!');
      },
      onError: (error) => {
        alert('Failed to create patient');
      }
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Composite Hook
```typescript
import { usePatientWithRecords } from '@/hooks/usePatients';

function PatientProfile({ patientId }) {
  const {
    patient,
    records,
    isLoading,
    isError
  } = usePatientWithRecords(patientId);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  
  return (
    <div>
      <h1>{patient.data?.data?.name}</h1>
      <h2>Medical Records</h2>
      {records.data?.data.map(record => (
        <div key={record.id}>{record.diagnosis}</div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use Composite Hooks**: When you need related data, use composite hooks instead of multiple individual queries
2. **Handle Loading States**: Always handle loading and error states in your components
3. **Invalidate Queries**: Mutations automatically invalidate related queries, ensuring data stays fresh
4. **Use Query Keys**: Query keys are used for caching - identical keys share the same cache
5. **Enable/Disable Queries**: Use the `enabled` option to conditionally run queries
6. **Paginate Large Lists**: Use pagination parameters for large datasets

## Testing

All hooks can be tested using React Query's testing utilities:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatients } from '@/hooks/usePatients';

test('should fetch patients', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  const { result } = renderHook(() => usePatients(), { wrapper });
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

## Maintenance

When adding new API endpoints:

1. Create a new hook file following the naming convention `use[EntityName].ts`
2. Implement query hooks for GET operations
3. Implement mutation hooks for CREATE, UPDATE, DELETE operations
4. Add composite hooks for common data combinations
5. Update this documentation
6. Add TypeScript types for better type safety
7. Write tests for new hooks

## Summary

This comprehensive hook system provides:
- **30 hook files** covering all domains
- **100+ individual hooks** for queries and mutations
- **15+ composite hooks** for common data combinations
- Full TypeScript type safety
- Automatic caching and refetching
- Centralized error handling
- Production-ready architecture
