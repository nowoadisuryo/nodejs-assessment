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

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
database
  .authenticate()
  .then(() => logger.info('✅ Database connected!'))
  .catch((err) => logger.error('❌ Database connection error:', err));

// Routes
app.use('/api', teacherRoutes(container));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running!' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = config.port || 3000;
const HOST = config.host || 'localhost';
const server = app.listen(PORT, () =>
  logger.info(`🚀 Server running on http://${HOST}:${PORT}`)
);

// Graceful Shutdown Handler
const shutdown = async (signal) => {
  try {
    logger.info(`⚠️ Received ${signal}. Closing server...`);
    server.close(() => {
      logger.info('✅ HTTP server closed.');
      database.close().then(() => {
        logger.info('✅ Database connection closed.');
        process.exit(0);
      });
    });
  } catch (err) {
    logger.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
