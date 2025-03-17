const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./src/config');
const logger = require('./src/utils/logger');
const database = require('./src/config/database');
const teacherRoutes = require('./src/routes/teacherRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const container = require('./src/config/container');
// const studentRoutes = require('./routes/studentRoutes');

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Database Connection
database
  .authenticate()
  .then(() => logger.info('✅ Database connected!'))
  .catch((err) => logger.error('❌ Database connection error:', err));

// Sync Database (Auto-create tables)
database
  .sync({ alter: true }) // Change to `force: true` to drop and recreate tables
  .then(() => logger.info('✅ Tables synced successfully!'))
  .catch((err) => logger.error('❌ Error syncing database:', err));

// Routes
app.use('/api', teacherRoutes(container));
// app.use('/api/students', studentRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running!' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = config.port || 3000;
const HOST = config.host || 'localhost';
app.listen(PORT, () =>
  logger.info(`🚀 Server running on http://${HOST}:${PORT}`)
);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  try {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    // Close the database connection
    await database.close();
    logger.info('Database connection closed.');

    // Stop the HTTP server
    app.close(() => {
      logger.info('Server stopped.');
      process.exit(0);
    });

    // If the server doesn't close in time, force exit
    setTimeout(() => {
      logger.error('Forcefully shutting down...');
      process.exit(1);
    }, 5000);
  } catch (error) {
    logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
