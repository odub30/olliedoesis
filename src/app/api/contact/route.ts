// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { logInfo, logError, logWarn } from "@/lib/logger";

// Validation schema
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
});

// Simple in-memory rate limiter (for production, use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 emails per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count += 1;
  return true;
}

// Clean up old rate limit records every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_WINDOW);

export async function POST(request: Request) {
  try {
    // Get IP address for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      logWarn("Contact form rate limit exceeded", { ip });
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: "1 hour",
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      logWarn("Contact form validation failed", { ip, errors });
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      logError("Contact form misconfigured", new Error("Missing email configuration"), {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasEmailFrom: !!process.env.EMAIL_FROM,
      });
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    // Initialize Resend (only when needed and after env check)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.EMAIL_FROM,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: 600;
                color: #4b5563;
                display: block;
                margin-bottom: 5px;
              }
              .value {
                color: #1f2937;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">From:</span>
                <span class="value">${name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="field">
                <span class="label">Subject:</span>
                <span class="value">${subject}</span>
              </div>
              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">${message}</div>
              </div>
              <div class="footer">
                Sent from your portfolio contact form
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      logError("Failed to send contact email via Resend", error, {
        ip,
        senderEmail: email,
      });
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    logInfo("Contact form submitted successfully", {
      ip,
      emailId: data?.id,
      senderEmail: email,
      subject,
    });

    return NextResponse.json(
      {
        message: "Message sent successfully! I'll get back to you soon.",
        emailId: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Contact form error", error, {
      path: "/api/contact",
    });
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}