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


// Swagger UI setup
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/logs', logRoutes);


module.exports = serverless(app);   
