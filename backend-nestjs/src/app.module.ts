import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';

// Core modules
import { PatientsModule } from './patients/patients.module';
import { ClientsModule } from './clients/clients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { InventoryModule } from './inventory/inventory.module';
import { InvoicesModule } from './invoices/invoices.module';
import { LabTestsModule } from './lab-tests/lab-tests.module';
import { StaffModule } from './staff/staff.module';
import { CommunicationsModule } from './communications/communications.module';
import { DocumentsModule } from './documents/documents.module';
import { AnalyticsModule } from './analytics/analytics.module';

// Extended modules
import { BreedInfoModule } from './breed-info/breed-info.module';
import { PatientRelationshipsModule } from './patient-relationships/patient-relationships.module';
import { PatientRemindersModule } from './patient-reminders/patient-reminders.module';
import { ClientPortalModule } from './client-portal/client-portal.module';
import { LoyaltyProgramsModule } from './loyalty-programs/loyalty-programs.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { TimeBlocksModule } from './time-blocks/time-blocks.module';
import { EstimatesModule } from './estimates/estimates.module';
import { PaymentPlansModule } from './payment-plans/payment-plans.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { EquipmentModule } from './equipment/equipment.module';
import { InsuranceClaimsModule } from './insurance-claims/insurance-claims.module';
import { RefundsModule } from './refunds/refunds.module';
import { MarketingCampaignsModule } from './marketing-campaigns/marketing-campaigns.module';
import { PoliciesModule } from './policies/policies.module';
import { ReportTemplatesModule } from './report-templates/report-templates.module';
import { DocumentTemplatesModule } from './document-templates/document-templates.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { WorkflowTemplatesModule } from './workflow-templates/workflow-templates.module';
import { WorkflowExecutionsModule } from './workflow-executions/workflow-executions.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // Event Emitter for domain events
    EventEmitterModule.forRoot(),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // Database
    PrismaModule,
    
    // Core modules
    PatientsModule,
    ClientsModule,
    AppointmentsModule,
    MedicalRecordsModule,
    PrescriptionsModule,
    InventoryModule,
    InvoicesModule,
    LabTestsModule,
    StaffModule,
    CommunicationsModule,
    DocumentsModule,
    AnalyticsModule,
    
    // Extended modules
    BreedInfoModule,
    PatientRelationshipsModule,
    PatientRemindersModule,
    ClientPortalModule,
    LoyaltyProgramsModule,
    FeedbackModule,
    WaitlistModule,
    TimeBlocksModule,
    EstimatesModule,
    PaymentPlansModule,
    PurchaseOrdersModule,
    EquipmentModule,
    InsuranceClaimsModule,
    RefundsModule,
    MarketingCampaignsModule,
    PoliciesModule,
    ReportTemplatesModule,
    DocumentTemplatesModule,
    WebhooksModule,
    WorkflowsModule,
    WorkflowTemplatesModule,
    WorkflowExecutionsModule,
    HealthModule,
  ],
})
export class AppModule {}
