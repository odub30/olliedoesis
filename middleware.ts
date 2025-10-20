// middleware.ts
/**
 * NextAuth v5 Middleware
 *
 * Authorization logic is handled in the `authorized` callback in auth.ts
 * This exports the auth function as middleware.
 *
 * Security Features:
 * 1. Protects /admin/* routes (requires ADMIN role)
 * 2. Protects API mutation routes (POST, PUT, DELETE)
 * 3. Redirects unauthenticated users to sign-in
 * 4. Allows public access to specified routes
 */

export { auth as default } from "@/lib/auth";

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
