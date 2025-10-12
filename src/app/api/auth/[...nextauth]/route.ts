// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

/**
 * NextAuth.js API Route Handler
 *
 * This catch-all route handles all authentication requests:
 * - GET  /api/auth/signin - Sign in page
 * - POST /api/auth/signin/:provider - Initiate OAuth or credentials sign in
 * - GET  /api/auth/callback/:provider - OAuth callback
 * - GET  /api/auth/signout - Sign out page
 * - POST /api/auth/signout - Sign out action
 * - GET  /api/auth/session - Get session
 * - GET  /api/auth/csrf - Get CSRF token
 * - GET  /api/auth/providers - Get configured providers
 *
 * Security: All routes are protected by NextAuth's built-in CSRF protection
 */

export const { GET, POST } = handlers;
