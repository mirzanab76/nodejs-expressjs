const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json')[process.env.NODE_ENV || 'development'];
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const authMiddleware = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const uploadErrorHandler = require('./middleware/uploadErrorHandler');

// Import from Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const roleRoutes = require('./routes/roleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize express app
const app = express();

// Initialize Sequelize with configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Upload File Handler
app.use(uploadErrorHandler);

// Directory folder upload file/picture
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routes API Authencation
app.use('/api/auth', authRoutes);

// Routes API Users
app.use('/api/users', userRoutes);

// Routes API Products
app.use('/api/products', authMiddleware, productRoutes);

// Routes API Roles
app.use('/api/roles', authMiddleware, roleRoutes);

// Routes API Categories
app.use('/api/categories', authMiddleware, categoryRoutes);



// Error handling middleware
app.use(errorHandler);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Test database connection
async function assertDatabaseConnectionOk() {
  console.log('Checking database connection...');
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}
// Start server
async function init() {
  await assertDatabaseConnectionOk();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
init();
// For testing purposes
module.exports = app;