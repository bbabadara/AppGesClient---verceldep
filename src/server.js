const express = require('express');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const logRoutes = require('./routes/logRoutes');
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');
const initializeData = require('./config/initializeData');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

initializeData();


// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/logs', logRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Swagger UI available at http://localhost:3000/api-docs');
});
