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
    tags: [{ name: 'Auth', description: 'Authentication and session management' }],
  },
  // Scan route files (TS in dev, compiled JS in production) for @openapi blocks.
  apis: ['src/routes/*.ts', 'dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
