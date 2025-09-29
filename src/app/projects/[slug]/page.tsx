// src/app/projects/[slug]/page.tsx
"use client";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function ProjectPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Project Details</h1>
      <p className="mt-4">Project details coming soon...</p>
    </div>
  );
}