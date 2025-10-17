// src/lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

/**
 * NextAuth.js v5 Configuration
 *
 * Security Features:
 * - Prisma adapter for database sessions
 * - JWT strategy for stateless authentication
 * - Automatic ADMIN role for first user
 * - Secure session cookies (httpOnly, sameSite)
 * - Email verification with magic links
 * - OAuth with GitHub (Google ready to add)
 */

export const authConfig: NextAuthConfig = {
  // Prisma adapter connects auth to our database
  // Use 'as any' to work around next-auth v5 beta type incompatibilities
  adapter: PrismaAdapter(prisma) as any,

  // Providers: GitHub OAuth and Email magic links
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "PUBLIC", // Default role, first user gets ADMIN in JWT callback
        };
      },
    }),

    // Email magic link authentication using Resend (optional)
    ...(process.env.RESEND_API_KEY && process.env.EMAIL_FROM
      ? [
          Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),

    // Google OAuth (optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  // Page routes for custom UI
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  // Trust host for cookies
  trustHost: true,

  // Session strategy: JWT for stateless authentication
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks for custom logic
  callbacks: {
    /**
     * Authorized Callback - Handles ALL middleware authorization
     * This is the ONLY place authorization logic runs in NextAuth v5
     */
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth;

      // Skip auth routes entirely to prevent redirect loops
      if (pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
        return true;
      }

      // ===== ADMIN ROUTE PROTECTION =====
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
          // Return false to trigger redirect to signin
          return false;
        }

        if (auth.user?.role !== "ADMIN") {
          return false;
        }

        return true;
      }

      // ===== API ROUTE PROTECTION =====
      if (pathname.startsWith("/api/") && request.method !== "GET") {
        if (!pathname.startsWith("/api/auth/")) {
          if (!isLoggedIn) {
            return false;
          }

          // Admin-only API routes
          if (
            pathname.startsWith("/api/admin/") ||
            pathname.startsWith("/api/projects/") ||
            pathname.startsWith("/api/blogs/") ||
            pathname.startsWith("/api/tags/") ||
            pathname.startsWith("/api/upload/")
          ) {
            if (auth.user?.role !== "ADMIN") {
              return false;
            }
          }
        }
      }

      // Allow all other requests
      return true;
    },

    /**
     * JWT Callback - Runs when JWT is created or updated
     * Adds user role and ID to the token
     */
    async jwt({ token, user, trigger }) {
      // On sign in, add user data to token
      if (user) {
        token.id = user.id;

        // Fetch the actual role from database instead of using provider default
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        token.role = dbUser?.role || "PUBLIC";
      }

      // Check if this is the first user - make them ADMIN
      if (trigger === "signIn" && user) {
        const userCount = await prisma.user.count();

        if (userCount === 1) {
          // First user gets ADMIN role
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
          token.role = "ADMIN";
        }
      }

      return token;
    },

    /**
     * Session Callback - Runs when session is checked
     * Exposes user role and ID to client-side session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    /**
     * Sign In Callback - Controls who can sign in
     * Add custom logic here if needed (e.g., allowlist)
     */
    async signIn() {
      // Allow all sign-ins by default
      // Add custom logic here if you want to restrict access
      return true;
    },
  },

  // Security settings
  // Remove custom cookie config - let NextAuth use defaults
  // The __Secure- prefix requires secure: true, which conflicts with development

  // Debug mode (disabled for production)
  debug: false,
};

// Export NextAuth instance
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
