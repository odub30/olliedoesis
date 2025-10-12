// src/app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: "Server Configuration Error",
      description: "There is a problem with the server configuration. Please contact support.",
    },
    AccessDenied: {
      title: "Access Denied",
      description: "You don't have permission to access this resource.",
    },
    Verification: {
      title: "Verification Failed",
      description: "The verification link may have expired or already been used.",
    },
    OAuthAccountNotLinked: {
      title: "Account Already Exists",
      description:
        "This email is already associated with another sign-in method. Please sign in using your original method.",
    },
    EmailSignin: {
      title: "Email Sign-In Failed",
      description: "Failed to send the sign-in email. Please try again later.",
    },
    Default: {
      title: "Authentication Error",
      description: "An error occurred during authentication. Please try again.",
    },
  };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{errorInfo.title}</h1>
            <p className="text-muted-foreground">{errorInfo.description}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:from-accent-600 hover:to-accent-700 transition-all"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full border border-border text-foreground font-semibold py-3 px-4 rounded-xl text-center hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
