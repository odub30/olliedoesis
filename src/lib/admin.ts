// src/lib/admin.ts - Admin utilities
import { auth } from "./auth";
import { redirect } from "next/navigation";

/**
 * Check if the current user is an admin
 * Returns the session if admin, redirects to home if not
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/auth/error?error=AccessDenied");
  }

  return session;
}

/**
 * Check if the current user is authenticated
 * Returns the session if authenticated, redirects to signin if not
 */
export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  return session;
}

/**
 * Check if user is admin (returns boolean, doesn't redirect)
 */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}
