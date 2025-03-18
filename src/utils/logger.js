const { createLogger, format, transports } = require('winston');

const { logging } = require('../config');

/**
 * Winston logger instance.
 * Configured with timestamp, console logging, and file logging.
 */
const logger = createLogger({
  level: logging.level,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;
