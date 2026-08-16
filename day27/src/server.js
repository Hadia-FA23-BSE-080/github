require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`==================================================`);
  logger.info(`🚀 Server running in [${process.env.NODE_ENV}] mode`);
  logger.info(`📡 Listening on http://localhost:${PORT}`);
  logger.info(`📊 Dashboard: http://localhost:${PORT}/index.html`);
  logger.info(`==================================================`);
});

// Handle server termination/interrupt cleanly
const shutdownGracefully = (signal) => {
  logger.warn(`Received ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
