// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Route Protection and Security Headers
 *
 * This runs on EVERY request before it reaches your pages/APIs.
 *
 * Security Features:
 * 1. Protects /admin/* routes (requires ADMIN role)
 * 2. Protects API mutation routes (POST, PUT, DELETE)
 * 3. Adds security headers to all responses
 * 4. Redirects unauthenticated users to sign-in
 * 5. Allows public access to specified routes
 */

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Security headers for all responses
  const headers = new Headers({
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });

  // Add Strict-Transport-Security in production
  if (process.env.NODE_ENV === "production") {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // ===== SKIP AUTH ROUTES =====
  // Skip auth routes entirely to prevent redirect loops
  // Auth routes handle their own logic and don't need protection
  if (pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
    const response = NextResponse.next();
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // ===== ADMIN ROUTE PROTECTION =====
  // Protect all /admin/* routes - require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      // Not authenticated - redirect to signin
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }

    if (session.user?.role !== "ADMIN") {
      // Authenticated but not admin - show forbidden
      return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
    }
  }

  // ===== API ROUTE PROTECTION =====
  // Protect API mutation routes (POST, PUT, PATCH, DELETE)
  if (pathname.startsWith("/api/") && req.method !== "GET") {
    // Exclude auth routes from protection (they handle their own)
    if (!pathname.startsWith("/api/auth/")) {
      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized - Authentication required" },
          { status: 401, headers }
        );
      }

      // Additional protection for admin-only API routes
      if (
        pathname.startsWith("/api/admin/") ||
        pathname.startsWith("/api/projects/") ||
        pathname.startsWith("/api/blogs/") ||
        pathname.startsWith("/api/tags/") ||
        pathname.startsWith("/api/upload/")
      ) {
        if (session.user?.role !== "ADMIN") {
          return NextResponse.json(
            { error: "Forbidden - Admin access required" },
            { status: 403, headers }
          );
        }
      }
    }
  }

  // Continue with security headers
  const response = NextResponse.next();

  // Apply security headers to response
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
});

/**
 * Matcher Configuration
 *
 * Specifies which routes this middleware runs on.
 * Excludes static files and Next.js internals for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
