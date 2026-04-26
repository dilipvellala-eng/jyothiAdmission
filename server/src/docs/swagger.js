export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'School Admission Management API',
    version: '1.0.0',
    description: 'API for online school admission applications, review workflows, dashboards, exports, and class seat management.'
  },
  servers: [{ url: 'http://localhost:5000/api' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        security: [],
        summary: 'Register a parent/student account',
        requestBody: { required: true },
        responses: { 201: { description: 'Registered' } }
      }
    },
    '/auth/login': {
      post: {
        security: [],
        summary: 'Login and receive JWT',
        responses: { 200: { description: 'Authenticated' } }
      }
    },
    '/applications': {
      get: { summary: 'List applications with search and filters', responses: { 200: { description: 'Application list' } } },
      post: { summary: 'Create draft application with optional uploads', responses: { 201: { description: 'Application created' } } }
    },
    '/applications/{id}': {
      get: { summary: 'Get application by ID', responses: { 200: { description: 'Application' } } },
      put: { summary: 'Edit application', responses: { 200: { description: 'Application updated' } } }
    },
    '/applications/{id}/submit': {
      post: { summary: 'Submit a draft application', responses: { 200: { description: 'Submitted' } } }
    },
    '/applications/{id}/review': {
      patch: { summary: 'Approve or reject an application', responses: { 200: { description: 'Reviewed' } } }
    },
    '/applications/{id}/pdf': {
      get: { summary: 'Download application PDF', responses: { 200: { description: 'PDF file' } } }
    },
    '/applications/export.csv': {
      get: { summary: 'Export applications as CSV', responses: { 200: { description: 'CSV file' } } }
    },
    '/classes': {
      get: { summary: 'List active classes and seats', responses: { 200: { description: 'Classes' } } },
      post: { summary: 'Create or update class seat availability', responses: { 200: { description: 'Class saved' } } }
    },
    '/dashboard': {
      get: { summary: 'Dashboard statistics', responses: { 200: { description: 'Stats' } } }
    }
  }
};
