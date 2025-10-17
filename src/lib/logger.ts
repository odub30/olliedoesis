// src/lib/logger.ts
import pino from 'pino';

/**
 * Production-Grade Logging System
 *
 * Features:
 * - Structured logging with JSON output
 * - Pretty printing in development
 * - Log levels: trace, debug, info, warn, error, fatal
 * - Contextual metadata support
 * - Performance optimized
 *
 * Usage:
 *   import { logger, logError, logInfo } from '@/lib/logger';
 *
 *   logInfo('User logged in', { userId: '123' });
 *   logError('Database error', error, { operation: 'fetchUser' });
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Disable pino-pretty transport to avoid worker thread issues
  // Use basic JSON output instead
  // transport: undefined,

  // Format log levels as uppercase strings
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        node_version: process.version,
      };
    },
  },

  // Add timestamp
  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  // Disable in test environment
  enabled: !isTest,
});

/**
 * Log an informational message
 *
 * @param message - The log message
 * @param metadata - Additional context (optional)
 *
 * @example
 * logInfo('User created account', { userId: '123', email: 'user@example.com' });
 */
export const logInfo = (message: string, metadata?: Record<string, unknown>) => {
  if (metadata) {
    logger.info(metadata, message);
  } else {
    logger.info(message);
  }
};

/**
 * Log a warning message
 *
 * @param message - The warning message
 * @param metadata - Additional context (optional)
 *
 * @example
 * logWarn('Rate limit approaching', { ip: '192.168.1.1', count: 58 });
 */
export const logWarn = (message: string, metadata?: Record<string, unknown>) => {
  if (metadata) {
    logger.warn(metadata, message);
  } else {
    logger.warn(message);
  }
};

/**
 * Log an error with full context
 *
 * @param context - Description of where/what failed
 * @param error - The error object or message
 * @param metadata - Additional context (optional)
 *
 * @example
 * try {
 *   await fetchUser(id);
 * } catch (error) {
 *   logError('Failed to fetch user', error, { userId: id });
 * }
 */
export const logError = (
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>
) => {
  const errorInfo = error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    : { error };

  logger.error(
    {
      context,
      error: errorInfo,
      ...metadata,
    },
    `Error: ${context}`
  );
};

/**
 * Log a debug message (only in development)
 *
 * @param message - The debug message
 * @param metadata - Additional context (optional)
 *
 * @example
 * logDebug('Cache hit', { key: 'user:123', ttl: 3600 });
 */
export const logDebug = (message: string, metadata?: Record<string, unknown>) => {
  if (metadata) {
    logger.debug(metadata, message);
  } else {
    logger.debug(message);
  }
};

/**
 * Create a child logger with additional context
 *
 * Useful for adding consistent metadata to all logs in a module
 *
 * @param context - Context object to add to all logs
 *
 * @example
 * const authLogger = createLogger({ module: 'auth' });
 * authLogger.info('User logged in'); // Automatically includes { module: 'auth' }
 */
export const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};

/**
 * Log API request/response
 *
 * @param method - HTTP method
 * @param path - Request path
 * @param statusCode - Response status code
 * @param duration - Request duration in ms
 * @param metadata - Additional context (optional)
 *
 * @example
 * const start = Date.now();
 * // ... handle request
 * logRequest('GET', '/api/users', 200, Date.now() - start, { userId: '123' });
 */
export const logRequest = (
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  metadata?: Record<string, unknown>
) => {
  logger.info(
    {
      type: 'http',
      method,
      path,
      statusCode,
      duration,
      ...metadata,
    },
    `${method} ${path} ${statusCode} ${duration}ms`
  );
};

export default logger;
