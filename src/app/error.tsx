'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
// logging can be added once a monitoring service is configured

/**
 * Error Boundary for Application Errors
 *
 * Catches and displays errors that occur during rendering.
 * In production, errors are logged to monitoring service (Sentry, etc.)
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service using our logger
    console.error('Application error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {"We\u2019re sorry, but something unexpected happened while processing your request."}
            </p>
            <p className="text-sm text-gray-500">
              Our team has been notified and is working to fix the issue.
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 bg-red-50 rounded-lg border border-red-200">
              <summary className="cursor-pointer p-4 font-semibold text-red-900 hover:bg-red-100 rounded-lg transition-colors">
                🔍 Error Details (Development Only)
              </summary>
              <div className="p-4 border-t border-red-200">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-900 mb-1">Message:</p>
                  <p className="text-sm text-red-700 bg-white p-3 rounded border border-red-200">
                    {error.message}
                  </p>
                </div>
                {error.digest && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-red-900 mb-1">Digest:</p>
                    <p className="text-sm text-red-700 bg-white p-3 rounded border border-red-200 font-mono">
                      {error.digest}
                    </p>
                  </div>
                )}
                {error.stack && (
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">Stack Trace:</p>
                    <pre className="text-xs text-red-700 bg-white p-3 rounded border border-red-200 overflow-auto max-h-64">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all hover:scale-105 font-medium shadow-lg shadow-primary-600/30"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              If this problem persists, please{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
