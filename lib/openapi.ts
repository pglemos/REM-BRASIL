import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REM OS API',
      version: '1.0.0',
      description: 'API documentation for REM OS - Operating System for REM Foundation',
    },
    servers: [
      {
        url: 'https://ais-dev-jjimed6ao7hcdfw3hkkgon-394573526240.us-west2.run.app',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        supabaseAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer token from Supabase Auth',
        },
      },
    },
  },
  apis: ['./app/api/**/*.ts'], // Path to the API docs
};

export const openapiSpecification = swaggerJsdoc(options);
