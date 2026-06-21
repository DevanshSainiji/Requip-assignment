import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Swagger / OpenAPI configuration.
 *
 * JSDoc comments in route files (tagged with @swagger) are picked up
 * by swagger-jsdoc and merged into this base definition.
 *
 * The generated spec is served at GET /api-docs via swagger-ui-express.
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReQuip — User Management API',
      version: '1.0.0',
      description:
        'A clean REST API for managing users with soft-delete support. ' +
        'Built with Express, Prisma, and MySQL.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        // ── Core entity ──────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Ravi Sharma' },
            email: { type: 'string', example: 'ravi@example.com' },
            primaryMobile: { type: 'string', example: '9876543210' },
            secondaryMobile: { type: 'string', example: '9876543211', nullable: true },
            aadhaar: { type: 'string', example: '123456789012' },
            pan: { type: 'string', example: 'ABCDE1234F' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-08-15' },
            placeOfBirth: { type: 'string', example: 'Mumbai' },
            currentAddress: { type: 'string', example: '123 MG Road, Bangalore' },
            permanentAddress: { type: 'string', example: '456 Link Road, Mumbai' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },

        // ── Request bodies ──────────────────────────────────────────────
        CreateUserInput: {
          type: 'object',
          required: [
            'name', 'email', 'primaryMobile', 'aadhaar', 'pan',
            'dateOfBirth', 'placeOfBirth', 'currentAddress', 'permanentAddress',
          ],
          properties: {
            name: { type: 'string', minLength: 2, example: 'Ravi Sharma' },
            email: { type: 'string', format: 'email', example: 'ravi@example.com' },
            primaryMobile: { type: 'string', example: '9876543210' },
            secondaryMobile: { type: 'string', example: '9876543211' },
            aadhaar: { type: 'string', example: '123456789012' },
            pan: { type: 'string', example: 'ABCDE1234F', pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-08-15' },
            placeOfBirth: { type: 'string', example: 'Mumbai' },
            currentAddress: { type: 'string', example: '123 MG Road, Bangalore' },
            permanentAddress: { type: 'string', example: '456 Link Road, Mumbai' },
          },
        },

        // UpdateUser is the same shape but all fields are optional
        UpdateUserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, example: 'Ravi Sharma' },
            email: { type: 'string', format: 'email', example: 'ravi@example.com' },
            primaryMobile: { type: 'string', example: '9876543210' },
            secondaryMobile: { type: 'string', example: '9876543211' },
            aadhaar: { type: 'string', example: '123456789012' },
            pan: { type: 'string', example: 'ABCDE1234F' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-08-15' },
            placeOfBirth: { type: 'string', example: 'Mumbai' },
            currentAddress: { type: 'string', example: '123 MG Road, Bangalore' },
            permanentAddress: { type: 'string', example: '456 Link Road, Mumbai' },
          },
        },

        // ── Response envelopes ───────────────────────────────────────────
        PaginatedUsersResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Users fetched successfully' },
            data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 10 },
              },
            },
          },
        },

        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Route files contain the per-endpoint @swagger JSDoc comments.
  // Path is relative to the CWD when the server starts (project root).
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
