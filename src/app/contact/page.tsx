"use client";

import { useState } from "react";
import { logError } from "@/lib/logger";

export const runtime = 'edge'; // or 'nodejs'
export const dynamic = 'force-dynamic';

export default function ContactPage() {
  // ... rest of your code
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace this with your actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      logError("Error submitting form", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            Have a question or want to work together? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-carolina mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-carolina focus:border-carolina outline-none transition bg-dark-blue-light text-white placeholder:text-gray-400 ${
                  errors.name ? "border-red-500" : "border-white"
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-carolina mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-carolina focus:border-carolina outline-none transition bg-dark-blue-light text-white placeholder:text-gray-400 ${
                  errors.email ? "border-red-500" : "border-white"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-carolina mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-carolina focus:border-carolina outline-none transition bg-dark-blue-light text-white placeholder:text-gray-400 ${
                  errors.subject ? "border-red-500" : "border-white"
                }`}
                placeholder="What's this about?"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-carolina mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-carolina focus:border-carolina outline-none transition resize-none bg-dark-blue-light text-white placeholder:text-gray-400 ${
                  errors.message ? "border-red-500" : "border-white"
                }`}
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-carolina text-white py-3 px-6 rounded-lg font-medium hover:bg-carolina/80 focus:outline-none focus:ring-2 focus:ring-carolina focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg">
                <p className="text-green-300 text-center">
                  Thank you! Your message has been sent successfully.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-300 text-center">
                  Oops! Something went wrong. Please try again later.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Additional Contact Info (Optional) */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Or reach out directly at{" "}
            <a href="mailto:contact@example.com" className="text-blue-600 hover:underline">
              contact@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}