// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Shield, Loader2, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send reset email");
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      // In development, show the reset URL
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
      toast.success("Password reset instructions sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Forgot password card */}
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-4 shadow-glow-accent">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-white/80">
            Enter your email to reset your password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-accent-600 hover:to-accent-700 focus:ring-4 focus:ring-accent-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-accent-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
              <p className="text-muted-foreground">
                If an account with <strong>{email}</strong> exists, we've sent password reset instructions.
              </p>
              {resetUrl && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    Development Mode - Reset URL:
                  </p>
                  <a
                    href={resetUrl}
                    className="text-sm text-blue-600 hover:text-blue-700 break-all underline"
                  >
                    {resetUrl}
                  </a>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                The link will expire in 1 hour.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-accent-600 hover:text-accent-700 font-medium text-sm"
              >
                Send another email
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/signin"
            className="text-white/80 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to sign in
          </Link>
        </div>

        {/* Security note */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
            🔒 Secure authentication powered by NextAuth.js
          </p>
        </div>
      </div>
    </div>
  );
}
