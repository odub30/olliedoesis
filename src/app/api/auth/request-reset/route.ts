// src/app/api/auth/request-reset/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

/**
 * Request Password Reset API Endpoint
 * Creates a verification token and sends reset email
 *
 * Security:
 * - Rate limited to prevent abuse (5 attempts per 15 minutes)
 * - No email enumeration (always returns success message)
 * - Tokens expire after 1 hour
 */

// Validation schema
const requestResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting to prevent abuse
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();

    // Validate input
    const validatedData = requestResetSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Don't reveal if user exists or not for security
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: "If an account with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Check if user has a password (not OAuth-only)
    if (!user.password) {
      return NextResponse.json(
        { message: "If an account with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: validatedData.email },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: validatedData.email,
        token: resetToken,
        expires,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll just log the token (in production, send via email service)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    console.log("Password reset requested for:", validatedData.email);
    console.log("Reset URL:", resetUrl);

    // In production, you would send an email here using Resend or similar
    // Example:
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM,
    //   to: validatedData.email,
    //   subject: "Password Reset Request",
    //   html: `Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
    // });

    return NextResponse.json(
      {
        message: "If an account with that email exists, a password reset link has been sent.",
        // Remove this in production - only for development
        resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    // Log error with our logger
    logError("Request password reset error", error);

    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
