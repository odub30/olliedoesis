// src/app/auth/verify-request/page.tsx
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-accent-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
            <p className="text-muted-foreground">
              A sign-in link has been sent to your email address.
            </p>
          </div>

          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 space-y-2">
            <p className="text-sm text-accent-900 font-medium">Next steps:</p>
            <ol className="text-sm text-accent-800 space-y-1 list-decimal list-inside">
              <li>Open the email we just sent you</li>
              <li>Click the sign-in link</li>
              <li>You&apos;ll be automatically signed in</li>
            </ol>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              The link will expire in 24 hours
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
