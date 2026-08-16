const winston = require('winston');
const path = require('path');

// Define custom levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(colors);

// Console format: colorized, readable, with timestamp
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// File format: structured JSON with error stack trace formatting
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;

const transports = [];
const exceptionHandlers = [new winston.transports.Console({ format: consoleFormat })];
const rejectionHandlers = [new winston.transports.Console({ format: consoleFormat })];

if (isVercel) {
  // On serverless Vercel, write logs only to console
  transports.push(new winston.transports.Console({ format: consoleFormat }));
} else {
  // Local environment: write to files and console
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  exceptionHandlers.push(
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/exceptions.log') })
  );

  rejectionHandlers.push(
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/rejections.log') })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format: fileFormat,
  transports,
  exceptionHandlers,
  rejectionHandlers,
  exitOnError: false // Do not exit on handled exceptions
});

// Always log to console in non-production environments (if not already added)
if (process.env.NODE_ENV !== 'production' && !isVercel) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

module.exports = logger;
