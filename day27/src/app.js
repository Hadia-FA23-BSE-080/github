const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./config/logger');
const AppError = require('./utils/appError');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use request logger middleware for all requests
app.use(requestLogger);

// Serve static frontend dashboard files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route to generate custom logs manually
 */
app.post('/api/logs/generate', (req, res, next) => {
  const { level, message } = req.body;

  if (!level || !message) {
    return next(new AppError('Both "level" and "message" are required', 400));
  }

  const validLevels = ['error', 'warn', 'info', 'http', 'debug'];
  if (!validLevels.includes(level)) {
    return next(new AppError(`Invalid log level. Allowed levels: ${validLevels.join(', ')}`, 400));
  }

  // Log message using Winston
  logger[level](`[Manual Log Triggered] ${message}`);

  res.status(200).json({
    status: 'success',
    message: `Successfully logged message as level "${level}"`
  });
});

/**
 * Route to simulate a standard synchronous error (caught by Express)
 */
app.get('/api/errors/sync', (req, res, next) => {
  logger.info('Triggering synchronous route error');
  try {
    // Simulating a reference error (calling a non-existent variable)
    const result = someUndefinedVariable.name;
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    // Pass standard programming errors to the global error handler
    next(err);
  }
});

/**
 * Route to simulate an operational error using custom AppError
 */
app.get('/api/errors/operational', (req, res, next) => {
  logger.info('Triggering operational AppError');
  // Pass a structured operational error to the error handler
  next(new AppError('Invalid user input or bad request parameters.', 400));
});

/**
 * Route to simulate an asynchronous error (Express caught via catch block)
 */
app.get('/api/errors/async', async (req, res, next) => {
  logger.info('Triggering asynchronous route error');
  
  const simulateAsyncDatabaseError = () => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database operation timed out or connection lost. (Simulated Async Error)'));
      }, 500);
    });
  };

  try {
    await simulateAsyncDatabaseError();
    res.status(200).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

/**
 * Route to simulate an unhandled promise rejection (outside Express context)
 */
app.get('/api/errors/unhandled-rejection', (req, res) => {
  logger.info('Triggering unhandled promise rejection');
  
  // A Promise that rejects and has no .catch() block or try-catch
  new Promise((_, reject) => {
    reject(new Error('This is a simulated unhandled promise rejection!'));
  });

  res.status(202).json({
    status: 'success',
    message: 'Unhandled Promise Rejection triggered (will log to rejections.log)'
  });
});

/**
 * Route to simulate an uncaught exception (outside Express context)
 */
app.get('/api/errors/uncaught-exception', (req, res) => {
  logger.info('Triggering uncaught exception');

  // Throwing an exception inside setTimeout runs it in a separate stack trace,
  // bypassing Express's error-catching mechanism.
  setTimeout(() => {
    throw new Error('This is a simulated uncaught exception thrown outside Express context!');
  }, 100);

  res.status(202).json({
    status: 'success',
    message: 'Uncaught Exception triggered (will log to exceptions.log/console)'
  });
});

/**
 * Route to read logs from the file system and send to the frontend UI
 */
app.get('/api/logs/view', (req, res) => {
  const type = req.query.type || 'combined'; // combined, error, exceptions, rejections
  const logFilePath = path.join(__dirname, `../logs/${type}.log`);

  if (!fs.existsSync(logFilePath)) {
    return res.status(200).json({ 
      status: 'success', 
      logs: [],
      isServerless: process.env.VERCEL === '1' || !!process.env.VERCEL
    });
  }

  try {
    const rawData = fs.readFileSync(logFilePath, 'utf-8');
    const lines = rawData.trim().split('\n');
    const logs = lines
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          // Fallback if the line is not formatted as JSON
          return { timestamp: new Date().toISOString(), level: 'info', message: line };
        }
      })
      .reverse() // Show latest logs first
      .slice(0, 100); // Return up to 100 logs

    res.status(200).json({ 
      status: 'success', 
      logs,
      isServerless: process.env.VERCEL === '1' || !!process.env.VERCEL
    });
  } catch (error) {
    logger.error(`Error reading log file ${type}.log: ${error.message}`);
    res.status(500).json({ status: 'error', message: 'Failed to read server logs' });
  }
});

// Catch-all for undefined routes
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} (${req.method}) not found!`, 404));
});

// Mount the global error handler middleware (must be registered last)
app.use(errorHandler);

module.exports = app;
