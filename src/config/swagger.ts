import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LPRES Admin API',
      version: '1.0.0',
      description: `
# LPRES Admin Backend API

Complete RESTful API for managing projects, news articles, complaints, and newsletter subscriptions.

## Features
- 🏗️ **Projects Management**: CRUD operations for infrastructure projects
- 📰 **News Management**: Create and manage news articles with markdown support
- 📝 **Complaints**: Handle user complaints and feedback
- 📧 **Newsletter**: Manage newsletter subscriptions
- 🖼️ **Image Upload**: Upload and manage images via Supabase Storage
- 🔒 **Authentication**: API key-based authentication (Public & Admin)
- ✅ **Validation**: Request validation with Zod schemas
- 📊 **Rate Limiting**: Protection against abuse

## Authentication

### Public Access (Anon Key)
Use the Supabase anonymous key for public endpoints:
\`\`\`
Authorization: Bearer YOUR_ANON_KEY
\`\`\`
or
\`\`\`
x-api-key: YOUR_ANON_KEY
\`\`\`

**Allowed Operations:**
- Read all projects and news
- Submit complaints
- Subscribe/unsubscribe from newsletter

### Admin Access (Service Role Key)
Use the Supabase service role key for admin endpoints:
\`\`\`
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
\`\`\`
or
\`\`\`
x-api-key: YOUR_SERVICE_ROLE_KEY
\`\`\`

**Allowed Operations:**
- All CRUD operations on all resources
- View all complaints
- Manage subscribers

⚠️ **Security Warning:** Never expose the Service Role Key in client-side code!

## Rate Limits
- **Public endpoints**: 100 requests per 15 minutes
- **Admin endpoints**: 1000 requests per 15 minutes

## Response Format

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
\`\`\`

## Database Schema
The API uses Supabase (PostgreSQL) with the following tables:
- \`projects\`: Infrastructure projects with status tracking
- \`news\`: News articles with markdown content
- \`complaints\`: User complaints and feedback
- \`newsletter_subscribers\`: Email subscriptions

## Getting Started
1. Set up your Supabase project
2. Run the database schema from \`supabase-schema.sql\`
3. Configure environment variables in \`.env\`
4. Start the server: \`npm run dev\`
      `,
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
        url: 'https://your-production-domain.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Supabase Anonymous Key for public access',
        },
        ServiceRoleAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Supabase Service Role Key for admin access',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Alternative: Use Authorization header with Bearer token',
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
        description: 'Infrastructure project management',
      },
      {
        name: 'News',
        description: 'News articles and announcements',
      },
      {
        name: 'Complaints',
        description: 'User complaints and feedback',
      },
      {
        name: 'Newsletter',
        description: 'Newsletter subscription management',
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
