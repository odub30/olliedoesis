// src/app/admin/blogs/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { use } from "react";
import { TagSelector, type Tag } from "@/components/admin/TagSelector";
import { KeywordsInput } from "@/components/admin/KeywordsInput";
import { CodeExamplesManager, type CodeExample } from "@/components/admin/CodeExamplesManager";
import { FAQManager, type FAQ } from "@/components/admin/FAQManager";
import { RelatedPostsSelector } from "@/components/admin/RelatedPostsSelector";
import { logError } from "@/lib/logger";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  featured: boolean;
  publishedAt: Date | null;
  readTime: number | null;
  category?: string | null;
  githubRepo?: string | null;
  keywords?: string[];
  relatedPostIds?: string[];
  tags?: Array<{ id: string; name: string; slug: string }>;
  images?: Array<{ id: string; url: string; alt: string; caption?: string | null }>;
  codeExamples?: Array<CodeExample & { blogId: string; createdAt: Date }>;
  faqs?: Array<FAQ & { blogId: string; createdAt: Date }>;
  metrics?: {
    bundleReduction?: string | null;
    fcpImprovement?: string | null;
    lcpImprovement?: string | null;
    ttiImprovement?: string | null;
    lighthouseIncrease?: number | null;
  } | null;
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
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

  // Fetch existing blog data
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${resolvedParams.id}`);

        if (response.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }

        const data = await response.json();
        const blog: Blog = data.blog;

        // Format publishedAt for datetime-local input
        let publishedAtFormatted = "";
        if (blog.publishedAt) {
          const date = new Date(blog.publishedAt);
          publishedAtFormatted = date.toISOString().slice(0, 16);
        }

        // Populate form with existing data
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || "",
          content: blog.content,
          category: blog.category || "",
          githubRepo: blog.githubRepo || "",
          published: blog.published,
          featured: blog.featured,
          publishedAt: publishedAtFormatted,
          // Metrics
          bundleReduction: blog.metrics?.bundleReduction || "",
          fcpImprovement: blog.metrics?.fcpImprovement || "",
          lcpImprovement: blog.metrics?.lcpImprovement || "",
          ttiImprovement: blog.metrics?.ttiImprovement || "",
          lighthouseIncrease: blog.metrics?.lighthouseIncrease?.toString() || "",
        });

        // Set selected tags
        if (blog.tags) {
          setSelectedTags(blog.tags);
        }

        // Set keywords
        if (blog.keywords) {
          setKeywords(blog.keywords);
        }

        // Set code examples
        if (blog.codeExamples) {
          setCodeExamples(blog.codeExamples.map(ex => ({
            id: ex.id,
            title: ex.title,
            url: ex.url,
            type: ex.type,
            order: ex.order,
          })));
        }

        // Set FAQs
        if (blog.faqs) {
          setFAQs(blog.faqs.map(faq => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
          })));
        }

        // Set related posts
        if (blog.relatedPostIds) {
          setRelatedPostIds(blog.relatedPostIds);
        }
      } catch (error) {
        logError("Error fetching blog", error);
        toast.error("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [resolvedParams.id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/blogs/${resolvedParams.id}`, {
        method: "PUT",
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
        throw new Error(error.error || "Failed to update blog post");
      }

  // response body not required here
  toast.success('Blog post updated successfully!');

      // Redirect to blogs list after short delay
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1000);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error updating blog', err);
      toast.error(err.message || 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/blogs/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete blog post");
      }

      toast.success("Blog post deleted successfully!");

      // Redirect to blogs list after short delay
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1000);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error deleting blog', err);
      toast.error(err.message || 'Failed to delete blog post');
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
          <span className="ml-3 text-muted-foreground">Loading blog post...</span>
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-2">
            Update blog post details and content
          </p>
        </div>
        <div className="flex items-center gap-3">
          {formData.published && (
            <Link
              href={`/blogs/${formData.slug}`}
              target="_blank"
              className="px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Preview
            </Link>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Delete
              </>
            )}
          </button>
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
            currentBlogId={resolvedParams.id}
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
              setTimeout(() => {
                const form = document.querySelector('form');
                if (form) {
                  const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                  form.dispatchEvent(submitEvent);
                }
              }, 0);
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
                Updating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {formData.published ? "Update & Publish" : "Update Draft"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
