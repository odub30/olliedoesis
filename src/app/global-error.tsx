"use client";

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Global Error Boundary
 *
 * Catches errors in the root layout.
 * This is the last line of defense for unhandled errors.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '500px',
          margin: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
          }}>
            ⚠️
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '16px',
          }}>
            Critical Error
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#4a5568',
            marginBottom: '32px',
          }}>
            A critical error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '12px',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#667eea',
              background: 'white',
              border: '2px solid #667eea',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
