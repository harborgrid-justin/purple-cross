import swaggerJSDoc from 'swagger-jsdoc';
import env from './env';

/**
 * OpenAPI 3 specification. Route-level details are added incrementally via
 * `@openapi` JSDoc blocks in src/routes/*.ts (see auth.routes.ts for the
 * pattern); this module supplies the base document, security scheme, and the
 * commonly-reused schemas/responses.
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Purple Cross API',
      version: '1.0.0',
      description:
        'Veterinary practice management API. All endpoints under the API prefix ' +
        'require a Bearer access token unless noted as public.',
    },
    servers: [{ url: env.apiPrefix, description: 'API base path' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            statusCode: { type: 'integer', example: 400 },
            errorCode: { type: 'string', example: 'VALIDATION_ERROR' },
            message: { type: 'string' },
            correlationId: { type: 'string' },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        Pagination: {
          type: 'object',
          description: 'Pagination metadata returned alongside list results.',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 137 },
            totalPages: { type: 'integer', example: 7 },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            species: { type: 'string' },
            breed: { type: 'string', nullable: true },
            dateOfBirth: { type: 'string', format: 'date-time' },
            gender: { type: 'string' },
            color: { type: 'string', nullable: true },
            weight: { type: 'number', nullable: true },
            microchipId: { type: 'string', nullable: true },
            insuranceProvider: { type: 'string', nullable: true },
            insurancePolicy: { type: 'string', nullable: true },
            status: { type: 'string', example: 'ACTIVE' },
            ownerId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            alternatePhone: { type: 'string', nullable: true },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' },
            emergencyContact: { type: 'string', nullable: true },
            emergencyPhone: { type: 'string', nullable: true },
            preferredContact: { type: 'string', nullable: true },
            status: { type: 'string', example: 'ACTIVE' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing or invalid access token',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication and session management' },
      { name: 'Patients', description: 'Patient (animal) records' },
      { name: 'Clients', description: 'Client (pet owner) records' },
      { name: 'Appointments', description: 'Scheduling of patient appointments' },
      { name: 'Medical Records', description: 'Clinical visit records' },
      { name: 'Prescriptions', description: 'Medication prescriptions' },
      { name: 'Inventory', description: 'Inventory items and stock levels' },
      { name: 'Invoices', description: 'Client billing and invoices' },
      { name: 'Lab Tests', description: 'Laboratory test orders and results' },
      { name: 'Staff', description: 'Practice staff records' },
      { name: 'Communications', description: 'Client communications log' },
      { name: 'Documents', description: 'Stored documents and attachments' },
      { name: 'Analytics', description: 'Reporting and analytics dashboards' },
      { name: 'Breed Info', description: 'Breed reference information' },
      { name: 'Patient Relationships', description: 'Relationships between patients' },
      { name: 'Patient Reminders', description: 'Patient care reminders' },
      { name: 'Client Portal', description: 'Client-facing portal access (public)' },
      { name: 'Loyalty Programs', description: 'Client loyalty points and tiers' },
      { name: 'Feedback', description: 'Client feedback and surveys' },
      { name: 'Waitlist', description: 'Appointment waitlist management' },
      { name: 'Time Blocks', description: 'Staff calendar time blocks' },
      { name: 'Estimates', description: 'Treatment cost estimates' },
      { name: 'Payment Plans', description: 'Installment payment plans' },
      { name: 'Purchase Orders', description: 'Supplier purchase orders' },
      { name: 'Equipment', description: 'Equipment and maintenance tracking' },
      { name: 'Insurance Claims', description: 'Pet insurance claims' },
      { name: 'Refunds', description: 'Client refunds' },
      { name: 'Marketing Campaigns', description: 'Marketing campaigns and metrics' },
      { name: 'Policies', description: 'Practice policies and acknowledgments' },
      { name: 'Report Templates', description: 'Report templates and scheduling' },
      { name: 'Document Templates', description: 'Document templates, signatures, workflows' },
      { name: 'Webhooks', description: 'Outbound webhook subscriptions' },
      { name: 'Workflows', description: 'Document workflow instances' },
      { name: 'Workflow Templates', description: 'Reusable workflow templates' },
      { name: 'Workflow Executions', description: 'Workflow execution history' },
    ],
  },
  // Scan route files (TS in dev, compiled JS in production) for @openapi blocks.
  apis: ['src/routes/*.ts', 'dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
