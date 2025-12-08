import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LPRES Admin API',
      version: '1.0.0',
      description:
        'Complete RESTful API for managing projects, news, complaints, and newsletter subscriptions.',
      contact: {
        name: 'LPRES Admin Support',
        email: 'support@lpres.gov',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server',
      },
      {
        url: 'https://lpress-backend.onrender.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        AdminSecretKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-admin-secret',
          description:
            'Admin secret key for protected endpoints (required for POST, PUT, DELETE operations except complaints and subscriptions)',
        },
      },
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
            title: {
              type: 'string',
              minLength: 10,
              maxLength: 200,
              description: 'Project title',
            },
            description: {
              type: 'string',
              minLength: 20,
              maxLength: 10000,
              description: 'Detailed description (supports markdown)',
            },
            location: {
              type: 'string',
              minLength: 5,
              maxLength: 200,
              description: 'Project location',
            },
            status: {
              type: 'string',
              enum: ['in progress', 'completed'],
              description: 'Project status',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
              maxItems: 6,
              description: 'Array of image URLs',
            },
          },
        },
        News: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
            published_at: {
              type: 'string',
              format: 'date-time',
              description: 'Publication date',
            },
            title: {
              type: 'string',
              minLength: 10,
              maxLength: 200,
            },
            details: {
              type: 'string',
              minLength: 20,
              maxLength: 10000,
              description: 'Article content (supports markdown)',
            },
            event: {
              type: 'string',
              minLength: 10,
              maxLength: 200,
              description: 'Event name',
            },
            location: {
              type: 'string',
              minLength: 5,
              maxLength: 200,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
              maxItems: 6,
            },
          },
        },
        Complaint: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
            },
            email: {
              type: 'string',
              format: 'email',
              minLength: 5,
              maxLength: 100,
            },
            subject: {
              type: 'string',
              minLength: 5,
              maxLength: 200,
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 2000,
            },
          },
        },
        Subscriber: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            subscribed: {
              type: 'boolean',
              description: 'Subscription status',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error description',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Unauthorized - Invalid or missing API key',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation Error - Invalid request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Not Found - Resource does not exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Projects',
        description:
          'Infrastructure project management - GET endpoints are public, POST/PUT/DELETE require admin access',
      },
      {
        name: 'News',
        description:
          'News articles and announcements - GET endpoints are public, POST/PUT/DELETE require admin access',
      },
      {
        name: 'Complaints',
        description:
          'User complaints and feedback - POST is public, GET/DELETE require admin access',
      },
      {
        name: 'Newsletter',
        description:
          'Newsletter subscription management - Subscribe/Unsubscribe are public, GET requires admin access',
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
