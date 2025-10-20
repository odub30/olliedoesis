// src/app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Github, Mail, ArrowRight, Shield, Loader2, Eye, EyeOff, Lock, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type AuthMode = "signin" | "signup" | "magic-link";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Handle email/password sign in
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Signed in successfully!");
        router.push(callbackUrl);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || name.length < 2) {
      toast.error("Please enter your name (at least 2 characters)");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Signing you in...");

      // Auto sign-in after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        toast.error("Account created but sign-in failed. Please try signing in.");
        setAuthMode("signin");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email magic link sign in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error("Failed to send magic link. Please try again.");
      } else {
        setEmailSent(true);
        toast.success("Check your email for a sign-in link!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth sign in (GitHub)
  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  // Show error toast if there's an error parameter
  if (error) {
    setTimeout(() => {
      if (error === "OAuthAccountNotLinked") {
        toast.error("This email is already associated with another sign-in method.");
      } else if (error === "EmailSignin") {
        toast.error("Failed to send email. Please try again.");
      } else if (error === "AccessDenied") {
        toast.error("Access denied. You don\u2019t have permission to access this resource.");
      } else {
        toast.error("Authentication error. Please try again.");
      }
    }, 100);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Sign in card */}
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-4 shadow-glow-accent">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {authMode === "signup" ? "Create Account" : authMode === "magic-link" ? "Magic Link" : "Welcome Back"}
          </h1>
          <p className="text-white/80">
            {authMode === "signup"
              ? "Sign up to get started"
              : authMode === "magic-link"
              ? "Sign in with a magic link"
              : "Sign in to access your account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {!emailSent ? (
            <>
              {/* Mode Toggle Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    authMode === "signin"
                      ? "bg-white text-accent-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    authMode === "signup"
                      ? "bg-white text-accent-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
                {process.env.NEXT_PUBLIC_RESEND_ENABLED === "true" && (
                  <button
                    type="button"
                    onClick={() => setAuthMode("magic-link")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      authMode === "magic-link"
                        ? "bg-white text-accent-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Magic Link
                  </button>
                )}
              </div>

              {/* Sign In Form */}
              {authMode === "signin" && (
                <form suppressHydrationWarning onSubmit={handleCredentialsSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email address
                    </label>
                    <div suppressHydrationWarning className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        suppressHydrationWarning
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-foreground">
                        Password
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-accent-600 hover:text-accent-700 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {authMode === "signup" && (
                <form suppressHydrationWarning onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="signup-email"
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

                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Must be 8+ characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-accent-600 hover:to-accent-700 focus:ring-4 focus:ring-accent-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Magic Link Form */}
              {authMode === "magic-link" && (
                <form suppressHydrationWarning onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="magic-email" className="block text-sm font-medium text-foreground mb-2">
                      Email address
                    </label>
                    <div suppressHydrationWarning className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        suppressHydrationWarning
                        id="magic-email"
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
                        Send Magic Link
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading}
                  className="w-full bg-[#24292F] hover:bg-[#1a1f24] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  <Github className="h-5 w-5" />
                  Continue with GitHub
                  <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Google button - enabled when configured */}
                {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" ? (
                  <button
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                    <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 font-semibold py-3 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-3"
                    title="Google sign-in not configured yet"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google (Coming Soon)
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-accent-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
              <p className="text-muted-foreground">
                We sent a sign-in link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to sign in. The link will expire in 24 hours.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-accent-600 hover:text-accent-700 font-medium text-sm"
              >
                Send another link
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to home
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
