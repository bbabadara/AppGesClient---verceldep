require('dotenv').config();
const express = require('express');
const connectDB = require('../src/config/db');
const clientRoutes = require('../src/routes/clientRoutes');
const logRoutes = require('../src/routes/logRoutes');
const { specs, swaggerUi, swaggerOptions } = require('../src/config/swagger');
const initializeData = require('../src/config/initializeData');
const serverless = require('serverless-http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

initializeData();

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API GesClient',
    version: '1.0.0',
    endpoints: {
      clients: '/api/clients',
      logs: '/logs',
      documentation: '/api/api-docs'
    }
  });
});

// Swagger UI setup
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/logs', logRoutes);

// Middleware d'erreur 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas`,
    availableRoutes: ['/', '/api/clients', '/logs', '/api/api-docs']
  });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
});

module.exports = serverless(app);   
