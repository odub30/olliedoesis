// src/lib/rate-limit.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Rate Limiting Utility
 *
 * Implements in-memory rate limiting for API endpoints to prevent abuse.
 * For production with multiple instances, consider using Redis or Vercel KV.
 *
 * Features:
 * - Token bucket algorithm
 * - Configurable limits per endpoint
 * - IP-based tracking
 * - Automatic cleanup of old entries
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: This is per-instance. For multi-instance deployments, use Redis/KV
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configurations for different endpoint types
export const RATE_LIMITS = {
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  api: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  strict: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
} as const;

/**
 * Get client identifier from request
 * Uses IP address or falls back to a combination of headers
 */
function getClientId(request: NextRequest): string {
  // Try to get real IP from various headers (Vercel/proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to user-agent + accept-language (less reliable)
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLanguage = request.headers.get('accept-language') || 'unknown';

  return `${userAgent}-${acceptLanguage}`.substring(0, 100);
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 5 * 60 * 1000);
}

/**
 * Rate limit middleware
 * Returns null if request is allowed, or a NextResponse with 429 status if rate limit exceeded
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.api
): NextResponse | null {
  const clientId = getClientId(request);
  const key = `${request.nextUrl.pathname}:${clientId}`;
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + config.interval,
    };
    rateLimitStore.set(key, entry);
    return null; // Allow request
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Rate limit exceeded. Please try again in ${resetInSeconds} seconds.`,
        retryAfter: resetInSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': resetInSeconds.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  }

  // Allow request and update headers
  return null;
}

/**
 * Higher-order function to wrap API routes with rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (req: NextRequest) => {
    const rateLimitResponse = rateLimit(req, config);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    return handler(req);
  };
}

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.api
): {
  remaining: number;
  reset: number;
  limit: number;
} {
  const clientId = getClientId(request);
  const key = `${request.nextUrl.pathname}:${clientId}`;
  const entry = rateLimitStore.get(key);
  const now = Date.now();

  if (!entry || entry.resetTime < now) {
    return {
      remaining: config.maxRequests,
      reset: now + config.interval,
      limit: config.maxRequests,
    };
  }

  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: entry.resetTime,
    limit: config.maxRequests,
  };
}
