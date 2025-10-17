// src/app/admin/blogs/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { TagSelector, type Tag } from "@/components/admin/TagSelector";
import { KeywordsInput } from "@/components/admin/KeywordsInput";
import { CodeExamplesManager, type CodeExample } from "@/components/admin/CodeExamplesManager";
import { FAQManager, type FAQ } from "@/components/admin/FAQManager";
import { RelatedPostsSelector } from "@/components/admin/RelatedPostsSelector";
import { logError } from "@/lib/logger";

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [codeExamples, setCodeExamples] = useState<CodeExample[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [relatedPostIds, setRelatedPostIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    githubRepo: "",
    published: false,
    featured: false,
    publishedAt: "",
    // Metrics
    bundleReduction: "",
    fcpImprovement: "",
    lcpImprovement: "",
    ttiImprovement: "",
    lighthouseIncrease: "",
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tagIds: selectedTags.map(tag => tag.id),
          keywords,
          relatedPostIds,
          codeExamples: codeExamples.map(({ id, ...rest }) => rest),
          faqs: faqs.map(({ id, ...rest }) => rest),
          metrics: {
            bundleReduction: formData.bundleReduction || null,
            fcpImprovement: formData.fcpImprovement || null,
            lcpImprovement: formData.lcpImprovement || null,
            ttiImprovement: formData.ttiImprovement || null,
            lighthouseIncrease: formData.lighthouseIncrease ? parseInt(formData.lighthouseIncrease) : null,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create blog post");
      }

  // Response body not required here; indicate success and redirect.
  toast.success('Blog post created successfully!');

      // Redirect to blogs list after short delay
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1000);
    } catch (error: unknown) {
      // Narrow unknown to Error to access message safely.
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error creating blog', err);
      toast.error(err.message || 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create New Blog Post</h1>
          <p className="text-muted-foreground mt-2">
            Write and publish a new article
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="How to Build a Secure Web Application"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none font-mono text-sm"
              placeholder="how-to-build-secure-web-application"
              pattern="^[a-z0-9-]+$"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the title (lowercase, hyphens only)
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none"
              rows={3}
              placeholder="A brief summary of your blog post (optional but recommended)..."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.excerpt.length}/500 characters
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content (Markdown) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none font-mono text-sm"
              rows={20}
              placeholder="# Introduction&#10;&#10;Write your blog content in Markdown format...&#10;&#10;## Section 1&#10;&#10;Your content here..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports Markdown formatting • Reading time will be calculated automatically
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <TagSelector
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              placeholder="Search or create tags..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add tags to categorize your blog post and improve discoverability
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="e.g., Frontend Development, Performance, Security"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Main category for this blog post
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SEO Keywords
            </label>
            <KeywordsInput
              keywords={keywords}
              onChange={setKeywords}
              placeholder="Add SEO keyword..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Keywords for search engine optimization (press Enter to add)
            </p>
          </div>

          {/* GitHub Repository */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              GitHub Repository (Optional)
            </label>
            <input
              type="url"
              value={formData.githubRepo}
              onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="https://github.com/username/repo"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link to related GitHub repository
            </p>
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Publish Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to use current date when publishing
            </p>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>

          {/* Featured Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
            />
            <div>
              <span className="font-medium text-foreground">Featured Post</span>
              <p className="text-sm text-muted-foreground">
                Display prominently on the blog page
              </p>
            </div>
          </label>

          {/* Published Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
            />
            <div>
              <span className="font-medium text-foreground">Published</span>
              <p className="text-sm text-muted-foreground">
                Make this blog post visible to the public
              </p>
            </div>
          </label>
        </div>

        {/* Code Examples Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Code Examples & Demos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add links to interactive examples (GitHub, StackBlitz, CodeSandbox, etc.)
            </p>
          </div>
          <CodeExamplesManager examples={codeExamples} onChange={setCodeExamples} />
        </div>

        {/* FAQs Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add common questions and answers related to this blog post
            </p>
          </div>
          <FAQManager faqs={faqs} onChange={setFAQs} />
        </div>

        {/* Performance Metrics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add performance improvements to showcase (optional)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bundle Reduction
              </label>
              <input
                type="text"
                value={formData.bundleReduction}
                onChange={(e) => setFormData({ ...formData, bundleReduction: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="e.g., 45%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                FCP Improvement
              </label>
              <input
                type="text"
                value={formData.fcpImprovement}
                onChange={(e) => setFormData({ ...formData, fcpImprovement: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="e.g., 32%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                LCP Improvement
              </label>
              <input
                type="text"
                value={formData.lcpImprovement}
                onChange={(e) => setFormData({ ...formData, lcpImprovement: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="e.g., 28%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                TTI Improvement
              </label>
              <input
                type="text"
                value={formData.ttiImprovement}
                onChange={(e) => setFormData({ ...formData, ttiImprovement: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="e.g., 41%"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Lighthouse Score Increase
              </label>
              <input
                type="number"
                value={formData.lighthouseIncrease}
                onChange={(e) => setFormData({ ...formData, lighthouseIncrease: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="e.g., 23"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Related Posts Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Related Posts</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select blog posts that are related to this one
            </p>
          </div>
          <RelatedPostsSelector
            selectedPostIds={relatedPostIds}
            onChange={setRelatedPostIds}
          />
        </div>

        {/* Writing Tips Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">✍️ Writing Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use clear, descriptive headings (# for h1, ## for h2, etc.)</li>
            <li>• Add code blocks with triple backticks for syntax highlighting</li>
            <li>• Include images with markdown: ![alt text](url)</li>
            <li>• Break up long paragraphs for better readability</li>
            <li>• Write a compelling excerpt to attract readers</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Link
            href="/admin/blogs"
            className="px-6 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, published: false });
              // Call handler without a synthetic event to avoid casting to `any`.
              void handleSubmit();
            }}
            disabled={isSubmitting}
            className="px-6 py-2 border border-accent-600 text-accent-600 rounded-lg hover:bg-accent-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {formData.published ? "Publish" : "Create Draft"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
