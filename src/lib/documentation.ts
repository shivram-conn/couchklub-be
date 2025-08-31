export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CouchKlub API',
    version: '1.0.0',
    description: 'Gaming club management API',
  },
  servers: [
    {
      url: 'http://localhost:3000/docs',
      description: 'Development Server'
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'email', 'password'],
      },
      Club: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', minLength: 1, maxLength: 500 },
          ownerId: { type: 'string', format: 'uuid' },
          memberIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'description', 'ownerId', 'memberIds'],
      },
      Game: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', minLength: 1, maxLength: 500 },
          clubId: { type: 'string', format: 'uuid' },
          createdBy: { type: 'string', format: 'uuid' },
          playerIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
          status: { type: 'string', enum: ['pending', 'active', 'completed'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'description', 'clubId', 'createdBy', 'status'],
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/health-check': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/signin': {
      post: {
        tags: ['Authentication'],
        summary: 'User signin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful signin',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    token: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    users: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                    count: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/clubs': {
      get: {
        tags: ['Clubs'],
        summary: 'Get all clubs for current user',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of clubs',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Club' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Clubs'],
        summary: 'Create a new club',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  description: { type: 'string', minLength: 1, maxLength: 500 },
                  memberIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                },
                required: ['name', 'description'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Club created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Club' },
              },
            },
          },
        },
      },
    },
    '/games': {
      get: {
        tags: ['Games'],
        summary: 'Get all games (optionally filtered by club)',
        parameters: [
          {
            name: 'clubId',
            in: 'query',
            description: 'Filter games by club ID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'List of games',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Game' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Games'],
        summary: 'Create a new game',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  description: { type: 'string', minLength: 1, maxLength: 500 },
                  clubId: { type: 'string', format: 'uuid' },
                  createdBy: { type: 'string', format: 'uuid' },
                },
                required: ['name', 'description', 'clubId', 'createdBy'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Game created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Game' },
              },
            },
          },
        },
      },
    },
  },
};
