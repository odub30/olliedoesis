// src/lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

const prisma = new PrismaClient();

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

    // Email magic link authentication using Resend
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM!,
    }),

    // Google OAuth
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

  // Session strategy: JWT for stateless authentication
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks for custom logic
  callbacks: {
    /**
     * JWT Callback - Runs when JWT is created or updated
     * Adds user role and ID to the token
     */
    async jwt({ token, user, trigger }) {
      // On sign in, add user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Check if this is the first user - make them ADMIN
      if (trigger === "signIn") {
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
    async signIn({ user, account, profile }) {
      // Allow all sign-ins by default
      // Add custom logic here if you want to restrict access
      return true;
    },
  },

  // Events for logging and analytics
  events: {
    async signIn({ user }) {
      console.log(`✅ User signed in: ${user.email}`);
    },
    async signOut() {
      console.log(`👋 User signed out`);
    },
  },

  // Security settings
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Debug mode (disabled)
  debug: false,
};

// Export NextAuth instance
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
