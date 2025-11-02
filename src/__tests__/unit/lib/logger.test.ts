// src/__tests__/unit/lib/logger.test.ts
import { logger, logInfo, logWarn, logError, logDebug, createLogger, logRequest } from '@/lib/logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on logger methods
    consoleLogSpy = jest.spyOn(logger, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(logger, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
    jest.spyOn(logger, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('logInfo', () => {
    it('should log info message without metadata', () => {
      const message = 'Test info message';
      logInfo(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    it('should log info message with metadata', () => {
      const message = 'User logged in';
      const metadata = { userId: '123', email: 'test@example.com' };

      logInfo(message, metadata);

      expect(consoleLogSpy).toHaveBeenCalledWith(metadata, message);
    });
  });

  describe('logWarn', () => {
    it('should log warning message without metadata', () => {
      const message = 'Test warning';
      logWarn(message);

      expect(consoleWarnSpy).toHaveBeenCalledWith(message);
    });

    it('should log warning message with metadata', () => {
      const message = 'Rate limit approaching';
      const metadata = { ip: '192.168.1.1', count: 58 };

      logWarn(message, metadata);

      expect(consoleWarnSpy).toHaveBeenCalledWith(metadata, message);
    });
  });

  describe('logError', () => {
    it('should log error with Error object', () => {
      const context = 'Failed to fetch user';
      const error = new Error('Network timeout');
      const metadata = { userId: '123' };

      logError(context, error, metadata);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          context,
          error: {
            name: 'Error',
            message: 'Network timeout',
            stack: expect.any(String),
          },
          userId: '123',
        }),
        `Error: ${context}`
      );
    });

    it('should log error with string', () => {
      const context = 'Database connection failed';
      const error = 'Connection refused';

      logError(context, error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          context,
          error: { error: 'Connection refused' },
        }),
        `Error: ${context}`
      );
    });

    it('should log error without metadata', () => {
      const context = 'Generic error';
      const error = new Error('Something went wrong');

      logError(context, error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          context,
          error: expect.any(Object),
        }),
        `Error: ${context}`
      );
    });
  });

  describe('logDebug', () => {
    it('should log debug message', () => {
      const debugSpy = jest.spyOn(logger, 'debug');
      const message = 'Cache hit';
      const metadata = { key: 'user:123' };

      logDebug(message, metadata);

      expect(debugSpy).toHaveBeenCalledWith(metadata, message);
    });
  });

  describe('createLogger', () => {
    it('should create child logger with context', () => {
      const childLoggerSpy = jest.spyOn(logger, 'child');
      const context = { module: 'auth' };

      createLogger(context);

      expect(childLoggerSpy).toHaveBeenCalledWith(context);
    });
  });

  describe('logRequest', () => {
    it('should log HTTP request details', () => {
      const method = 'GET';
      const path = '/api/users';
      const statusCode = 200;
      const duration = 45;
      const metadata = { userId: '123' };

      logRequest(method, path, statusCode, duration, metadata);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'http',
          method,
          path,
          statusCode,
          duration,
          userId: '123',
        }),
        `${method} ${path} ${statusCode} ${duration}ms`
      );
    });

    it('should log request without metadata', () => {
      const method = 'POST';
      const path = '/api/blogs';
      const statusCode = 201;
      const duration = 120;

      logRequest(method, path, statusCode, duration);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'http',
          method,
          path,
          statusCode,
          duration,
        }),
        `${method} ${path} ${statusCode} ${duration}ms`
      );
    });
  });
});
