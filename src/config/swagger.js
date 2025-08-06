const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API Gestion des Clients',
      version: '1.0.0',
      description: 'API REST complète pour la gestion des clients avec opérations CRUD',
      contact: {
        name: 'Support API',
        email: 'bbabadara@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    tags: [
      {
        name: 'Clients',
        description: 'Opérations CRUD pour la gestion des clients'
      },
      {
        name: 'Logs',
        description: 'Consultation des logs système'
      }
    ]
  },
  apis: [
    './src/controllers/*.js',
    './src/routes/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #ff6600 }
  `,
  customSiteTitle: 'API Gestion Clients - Documentation'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
