# React Server Components in Next.js: The Complete 2025 Guide

## Everything You Need to Know About Building Faster React Applications

---

**Last Updated:** October 2025 | **Reading Time:** 12 minutes

---

## Table of Contents

1. [What Are React Server Components?](#what-are-rsc)
2. [Why Server Components Matter in 2025](#why-they-matter)
3. [Server Components vs Client Components](#server-vs-client)
4. [Building Your First Server Component](#first-component)
5. [Advanced Patterns and Best Practices](#advanced-patterns)
6. [Real-World Implementation](#real-world)
7. [Performance Benchmarks](#performance)
8. [Common Mistakes to Avoid](#mistakes)
9. [Migration Guide](#migration)
10. [The Future of Server Components](#future)

---

## What Are React Server Components? {#what-are-rsc}

React Server Components (RSCs) represent the most significant architectural shift in React since the introduction of Hooks in 2019. They fundamentally change how we think about component rendering, data fetching, and application architecture.

### The Core Concept

Server Components are React components that **render exclusively on the server**. Unlike traditional server-side rendering (SSR), which hydrates components on the client, Server Components:

- **Never send JavaScript to the browser** for that component
- **Render directly to a special format** called the React Server Component Payload
- **Can access backend resources directly** without an API layer
- **Integrate seamlessly with Client Components** for interactivity

### A Simple Example

```typescript
// app/products/page.tsx - This is a Server Component by default
import { db } from '@/lib/database'

export default async function ProductsPage() {
  // Direct database access - no API needed!
  const products = await db.product.findMany({
    where: { published: true },
    include: { category: true }
  })

  return (
    <div>
      <h1>Our Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <span>{product.category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

Notice there's:
- ✅ No `useState` or `useEffect`
- ✅ No API endpoint needed
- ✅ Direct database query
- ✅ Async component (new React feature)

---

## Why Server Components Matter in 2025 {#why-they-matter}

The web development landscape has evolved, and Server Components solve critical problems that have plagued React applications for years.

### 1. JavaScript Bundle Size Crisis

Modern React applications often ship **hundreds of kilobytes** of JavaScript. Server Components can reduce this by **85%** or more.

**Traditional React App:**
```typescript
'use client' // Everything goes to the browser

import { marked } from 'marked'           // 50 KB
import { formatDate } from 'date-fns'     // 200 KB
import { Chart } from 'chart.js'          // 250 KB

export function Dashboard({ data }: { data: DashboardData }) {
  const processedData = expensiveCalculation(data)
  const formattedDate = formatDate(data.date, 'PPP')
  const markdown = marked(data.description)
  
  return (
    <div>
      <Chart data={processedData} />
      <p>{formattedDate}</p>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
    </div>
  )
}
```
**Bundle Size:** 500+ KB sent to browser

**With Server Components:**
```typescript
// Server Component - No 'use client'
import { marked } from 'marked'           // Stays on server
import { formatDate } from 'date-fns'     // Stays on server
import { ChartClient } from './ChartClient'

export default async function Dashboard() {
  const data = await getDashboardData()
  const processedData = expensiveCalculation(data) // Runs on server
  const formattedDate = formatDate(data.date, 'PPP')
  const markdown = marked(data.description)
  
  return (
    <div>
      <ChartClient data={processedData} />
      <p>{formattedDate}</p>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
    </div>
  )
}
```
**Bundle Size:** 50 KB sent to browser (only the chart library for interactivity)

### 2. Performance Impact: Real Numbers

According to 2025 industry benchmarks:

| Metric | Traditional React | With Server Components | Improvement |
|--------|------------------|------------------------|-------------|
| First Contentful Paint (FCP) | 2.8s | 1.2s | **57% faster** |
| Time to Interactive (TTI) | 4.5s | 2.7s | **40% faster** |
| JavaScript Bundle | 450 KB | 65 KB | **85% smaller** |
| Lighthouse Score | 72 | 96 | **33% higher** |

### 3. Developer Experience Revolution

Server Components eliminate the need for:
- ❌ Creating separate API routes
- ❌ Managing client-side data fetching
- ❌ Handling loading states manually
- ❌ Dealing with CORS issues
- ❌ Implementing data caching strategies

---

## Server Components vs Client Components {#server-vs-client}

Understanding when to use each type is crucial for building optimal applications.

### The Mental Model

Think of your application as having **two rendering contexts**:

```
┌─────────────────────────────────────┐
│         SERVER                      │
│  ┌───────────────────────────────┐  │
│  │   Server Components           │  │
│  │   • Data fetching             │  │
│  │   • Database queries          │  │
│  │   • Heavy computations        │  │
│  │   • Secret keys/tokens        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
      (RSC Payload)
              ↓
┌─────────────────────────────────────┐
│         CLIENT                      │
│  ┌───────────────────────────────┐  │
│  │   Client Components           │  │
│  │   • User interactions         │  │
│  │   • useState, useEffect       │  │
│  │   • Browser APIs              │  │
│  │   • Event handlers            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Decision Matrix: Server vs Client

| Feature/Requirement | Use Server Component | Use Client Component |
|-------------------|---------------------|---------------------|
| Fetch data | ✅ | ❌ |
| Access backend directly | ✅ | ❌ |
| Keep sensitive info secure | ✅ | ❌ |
| Use large dependencies | ✅ | ❌ |
| Add interactivity (click, input) | ❌ | ✅ |
| Use state and effects | ❌ | ✅ |
| Use browser APIs | ❌ | ✅ |
| Use custom hooks | ❌ | ✅ |

### Practical Examples

#### ✅ Perfect for Server Components

```typescript
// app/blog/[slug]/page.tsx
import { getPost } from '@/lib/blog'
import { db } from '@/lib/database'
import { marked } from 'marked'

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // All of this runs on the server
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: { 
      author: true,
      comments: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  const htmlContent = marked(post.content)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author.name}</p>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <CommentList comments={post.comments} />
    </article>
  )
}
```

#### ✅ Perfect for Client Components

```typescript
// components/LikeButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { likePost } from '@/app/actions'

export function LikeButton({ 
  postId, 
  initialLikes 
}: { 
  postId: string
  initialLikes: number 
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()

  const handleLike = () => {
    startTransition(async () => {
      const newLikes = await likePost(postId)
      setLikes(newLikes)
    })
  }

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      ❤️ {likes}
      {isPending && <span className="spinner" />}
    </button>
  )
}
```

### Composing Server and Client Components

The real power comes from **combining** both types effectively:

```typescript
// app/dashboard/page.tsx - Server Component
import { getCurrentUser, getUserStats } from '@/lib/auth'
import { StatsChart } from '@/components/StatsChart' // Client
import { ActivityFeed } from '@/components/ActivityFeed' // Server

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const stats = await getUserStats(user.id)
  
  return (
    <div>
      <h1>Welcome back, {user.name}</h1>
      
      {/* Server Component - no JS to client */}
      <ActivityFeed userId={user.id} />
      
      {/* Client Component - interactive chart */}
      <StatsChart data={stats} />
    </div>
  )
}
```

---

## Building Your First Server Component {#first-component}

Let's build a complete feature: a product catalog with search and filtering.

### Step 1: The Server Component (Data Fetching)

```typescript
// app/products/page.tsx
import { db } from '@/lib/database'
import { ProductGrid } from '@/components/ProductGrid'
import { SearchBar } from '@/components/SearchBar'
import { FilterSidebar } from '@/components/FilterSidebar'

interface SearchParams {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function ProductsPage({ searchParams }: SearchParams) {
  // Build dynamic query based on search params
  const where = {
    ...(searchParams.q && {
      OR: [
        { name: { contains: searchParams.q, mode: 'insensitive' } },
        { description: { contains: searchParams.q, mode: 'insensitive' } }
      ]
    }),
    ...(searchParams.category && {
      category: { slug: searchParams.category }
    }),
    ...(searchParams.minPrice && {
      price: { gte: parseFloat(searchParams.minPrice) }
    }),
    ...(searchParams.maxPrice && {
      price: { lte: parseFloat(searchParams.maxPrice) }
    }),
  }

  // Fetch products with filters applied
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: true,
        images: { take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.category.findMany({
      include: {
        _count: { select: { products: true } }
      }
    })
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Server Component - no client JS */}
        <FilterSidebar categories={categories} />
        
        <div className="flex-1">
          {/* Client Component - needs interactivity */}
          <SearchBar />
          
          {/* Server Component - just renders HTML */}
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
```

### Step 2: The Client Component (Interactivity)

```typescript
// components/SearchBar.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`/products?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 top-2"
        >
          {isPending ? '...' : '🔍'}
        </button>
      </div>
    </form>
  )
}
```

### Step 3: Optimizing with Suspense

```typescript
// app/products/page.tsx (improved)
import { Suspense } from 'react'

export default function ProductsPage({ searchParams }: SearchParams) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Load immediately */}
        <Suspense fallback={<FilterSkeleton />}>
          <FilterSidebar />
        </Suspense>
        
        <div className="flex-1">
          <SearchBar />
          
          {/* Stream in when ready */}
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Extract ProductGrid to its own component
async function ProductGrid({ searchParams }: { searchParams: any }) {
  const products = await getProducts(searchParams)
  
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## Advanced Patterns and Best Practices {#advanced-patterns}

### 1. Streaming for Faster Perceived Performance

Server Components enable **progressive rendering** using Suspense:

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      {/* Renders immediately */}
      <Header />
      
      {/* Streams when ready (fast query) */}
      <Suspense fallback={<StatsSkeleton />}>
        <QuickStats />
      </Suspense>
      
      {/* Streams independently (slow query) */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      
      {/* Streams last (slowest query) */}
      <Suspense fallback={<TableSkeleton />}>
        <UserActivityTable />
      </Suspense>
    </div>
  )
}

async function QuickStats() {
  const stats = await db.stats.findFirst() // Fast query
  return <StatsDisplay stats={stats} />
}

async function RevenueChart() {
  const revenue = await calculateRevenue() // Medium query
  return <Chart data={revenue} />
}

async function UserActivityTable() {
  const activity = await getDetailedActivity() // Slow query
  return <ActivityTable data={activity} />
}
```

**Result:** Users see content progressively instead of waiting for everything.

### 2. Server Actions for Mutations

Server Actions let you mutate data without API routes:

```typescript
// app/actions.ts
'use server'

import { db } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  const post = await db.post.create({
    data: { title, content }
  })
  
  // Automatically update the page
  revalidatePath('/blog')
  
  return { success: true, post }
}
```

```typescript
// components/CreatePostForm.tsx
'use client'

import { createPost } from '@/app/actions'
import { useFormState, useFormStatus } from 'react-dom'

export function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, null)

  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
      {state?.success && <p>Post created!</p>}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}
```

### 3. Sharing Code Between Server and Client

Some utilities work in both contexts:

```typescript
// lib/utils.ts (runs on both server and client)
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}
```

But be careful with server-only code:

```typescript
// lib/db.ts
import 'server-only' // This ensures it never bundles for client

export const db = createDatabaseConnection({
  url: process.env.DATABASE_URL // Safe - never exposed to client
})
```

### 4. Composition Patterns

**Pattern A: Server Component wrapping Client Component**
```typescript
// ✅ Good: Server fetches, Client displays
async function ProductPage() {
  const product = await getProduct()
  return <ProductDisplay product={product} />
}
```

**Pattern B: Client Component wrapping Server Component**
```typescript
// ❌ This doesn't work!
'use client'
function Wrapper() {
  return <ServerComponent /> // Error!
}

// ✅ Use this pattern instead
'use client'
function Wrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

// Then in a Server Component:
<Wrapper>
  <ServerComponent />
</Wrapper>
```

---

## Real-World Implementation {#real-world}

Let's build a complete blog platform with comments, likes, and real-time updates.

### The Architecture

```
app/
├── blog/
│   ├── page.tsx                 # Server: Blog listing
│   └── [slug]/
│       ├── page.tsx             # Server: Blog post
│       └── loading.tsx          # Loading state
├── actions.ts                   # Server actions
components/
├── BlogCard.tsx                 # Server component
├── CommentForm.tsx              # Client component
├── LikeButton.tsx               # Client component
└── CommentList.tsx              # Server component
```

### Complete Implementation

```typescript
// app/blog/[slug]/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { db } from '@/lib/database'
import { CommentForm } from '@/components/CommentForm'
import { LikeButton } from '@/components/LikeButton'
import { CommentList } from '@/components/CommentList'

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    }
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      _count: { select: { likes: true, comments: true } }
    }
  })

  if (!post) notFound()

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header - renders immediately */}
      <header>
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-gray-600">
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      {/* Content - renders immediately */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Like button - client component for interactivity */}
      <div className="flex items-center gap-4 mb-12">
        <LikeButton 
          postId={post.id} 
          initialLikes={post._count.likes} 
        />
        <span className="text-gray-600">
          {post._count.comments} comments
        </span>
      </div>

      {/* Comments - stream in when ready */}
      <section className="border-t pt-12">
        <h2 className="text-3xl font-bold mb-8">Comments</h2>
        
        <CommentForm postId={post.id} />
        
        <Suspense fallback={<CommentsSkeleton />}>
          <CommentList postId={post.id} />
        </Suspense>
      </section>
    </article>
  )
}

// Separate component for streaming
async function CommentList({ postId }: { postId: string }) {
  const comments = await db.comment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 mt-8">
      {comments.map((comment) => (
        <div key={comment.id} className="border-l-2 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={comment.author.avatar} 
              alt={comment.author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
```

```typescript
// components/CommentForm.tsx
'use client'

import { useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { addComment } from '@/app/actions'

export function CommentForm({ postId }: { postId: string }) {
  const ref = useRef<HTMLFormElement>(null)
  const [state, formAction] = useFormState(addComment, null)

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await formAction(formData)
        ref.current?.reset()
      }}
      className="mb-8"
    >
      <input type="hidden" name="postId" value={postId} />
      <textarea
        name="content"
        required
        placeholder="Add a comment..."
        className="w-full px-4 py-2 border rounded-lg"
        rows={4}
      />
      <SubmitButton />
      {state?.error && (
        <p className="text-red-600 mt-2">{state.error}</p>
      )}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
    >
      {pending ? 'Posting...' : 'Post Comment'}
    </button>
  )
}
```

```typescript
// app/actions.ts
'use server'

import { db } from '@/lib/database'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function addComment(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: 'You must be logged in to comment' }
  }

  const postId = formData.get('postId') as string
  const content = formData.get('content') as string

  if (!content || content.length < 3) {
    return { error: 'Comment must be at least 3 characters' }
  }

  try {
    await db.comment.create({
      data: {
        postId,
        authorId: user.id,
        content
      }
    })

    // Revalidate the blog post page to show new comment
    revalidatePath(`/blog/${postId}`)
    
    return { success: true }
  } catch (error) {
    return { error: 'Failed to post comment' }
  }
}

export async function likePost(postId: string) {
  const user = await getCurrentUser()
  
  if (!user) throw new Error('Must be logged in')

  const existingLike = await db.like.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId
      }
    }
  })

  if (existingLike) {
    await db.like.delete({
      where: { id: existingLike.id }
    })
  } else {
    await db.like.create({
      data: { userId: user.id, postId }
    })
  }

  const likeCount = await db.like.count({
    where: { postId }
  })

  revalidatePath(`/blog/${postId}`)
  
  return likeCount
}
```

---

## Performance Benchmarks {#performance}

Real-world performance improvements from migrating to Server Components:

### Case Study: E-commerce Product Page

**Before (Traditional React):**
- Initial Bundle: 385 KB
- FCP: 2.4s
- TTI: 4.1s
- Lighthouse: 68

**After (Server Components):**
- Initial Bundle: 52 KB
- FCP: 1.1s
- TTI: 2.3s
- Lighthouse: 94

**Code Changes:**
```typescript
// Before: Everything in client
'use client'
import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { formatPrice } from '@/lib/utils'

export function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Not found</div>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{formatPrice(product.price)}</p>
      <div dangerouslySetInnerHTML={{ 
        __html: marked(product.description) 
      }} />
    </div>
  )
}
```

```typescript
// After: Server Component
import { db } from '@/lib/database'
import { marked } from 'marked'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from './AddToCartButton'

export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { images: true, reviews: true }
  })

  if (!product) notFound()

  const description = marked(product.description)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{formatPrice(product.price)}</p>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

### Metrics That Matter

According to Vercel (creators of Next.js), websites powered by Server Components achieve:

- **96% of sites** pass Core Web Vitals
- **Average 50% reduction** in JavaScript size
- **30% faster** initial page loads
- **Higher conversion rates** due to better performance

---

## Common Mistakes to Avoid {#mistakes}

### ❌ Mistake #1: Using Client Components Unnecessarily

```typescript
// ❌ Bad: Marking everything as client
'use client'

export function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

```typescript
// ✅ Good: Default to Server Component
export function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <LikeButton postId={post.id} /> {/* Only this is client */}
    </article>
  )
}
```

### ❌ Mistake #2: Trying to Use Hooks in Server Components

```typescript
// ❌ This will error!
import { useState } from 'react'

export async function ServerComponent() {
  const [count, setCount] = useState(0) // Error!
  const data = await fetchData()
  return <div>{data}</div>
}
```

```typescript
// ✅ Extract interactive part to Client Component
export async function ServerComponent() {
  const data = await fetchData()
  return (
    <div>
      {data}
      <Counter /> {/* Client component handles state */}
    </div>
  )
}
```

### ❌ Mistake #3: Not Using Suspense for Streaming

```typescript
// ❌ Bad: Everything waits for slowest query
export default async function Page() {
  const fast = await fastQuery()
  const slow = await slowQuery() // Everything waits for this
  
  return (
    <div>
      <Fast data={fast} />
      <Slow data={slow} />
    </div>
  )
}
```

```typescript
// ✅ Good: Stream independently
export default function Page() {
  return (
    <div>
      <Suspense fallback={<FastSkeleton />}>
        <Fast />
      </Suspense>
      <Suspense fallback={<SlowSkeleton />}>
        <Slow />
      </Suspense>
    </div>
  )
}

async function Fast() {
  const data = await fastQuery()
  return <div>{data}</div>
}

async function Slow() {
  const data = await slowQuery()
  return <div>{data}</div>
}
```

### ❌ Mistake #4: Passing Non-Serializable Props

```typescript
// ❌ Bad: Can't pass functions to Client Components from Server
export async function ServerComponent() {
  const handleClick = () => console.log('clicked')
  
  return <ClientComponent onClick={handleClick} /> // Error!
}
```

```typescript
// ✅ Good: Use Server Actions
'use server'

export async function handleClick() {
  console.log('clicked on server')
}

// Then pass the action
import { handleClick } from './actions'

export async function ServerComponent() {
  return <ClientComponent onAction={handleClick} />
}
```

### ❌ Mistake #5: Not Optimizing Third-Party Libraries

```typescript
// ❌ Bad: Heavy library in Client Component
'use client'
import moment from 'moment' // 70 KB!

export function DateDisplay({ date }: { date: string }) {
  return <div>{moment(date).format('MMMM Do YYYY')}</div>
}
```

```typescript
// ✅ Good: Use in Server Component
import moment from 'moment'

export async function DateDisplay({ date }: { date: string }) {
  const formatted = moment(date).format('MMMM Do YYYY')
  return <div>{formatted}</div>
}
```

---

## Migration Guide {#migration}

### Migrating from Pages Router to App Router

**Step 1: Understand the Differences**

| Pages Router | App Router |
|--------------|-----------|
| `pages/blog/[slug].tsx` | `app/blog/[slug]/page.tsx` |
| `getServerSideProps` | Server Component (async) |
| `getStaticProps` | Server Component with `revalidate` |
| `getStaticPaths` | `generateStaticParams` |
| `_app.tsx` | `app/layout.tsx` |

**Step 2: Migrate Page by Page**

```typescript
// Old: pages/blog/[slug].tsx
export async function getServerSideProps({ params }) {
  const post = await getPost(params.slug)
  return { props: { post } }
}

export default function BlogPost({ post }) {
  return <div>{post.title}</div>
}
```

```typescript
// New: app/blog/[slug]/page.tsx
export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getPost(params.slug)
  return <div>{post.title}</div>
}
```

**Step 3: Convert Client-Side Logic**

```typescript
// Old: Client-side fetching
'use client'
import { useEffect, useState } from 'react'

export function Products() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
  }, [])
  
  return <div>{/* render products */}</div>
}
```

```typescript
// New: Server Component
export async function Products() {
  const products = await getProducts()
  return <div>{/* render products */}</div>
}
```

---

## The Future of Server Components {#future}

### What's Coming in 2026

1. **Enhanced Streaming**
   - Partial prerendering
   - Better Suspense boundaries
   - Improved loading states

2. **Better DevTools**
   - Visual component tree with Server/Client indicators
   - Performance profiling for Server Components
   - Network waterfall visualization

3. **Improved Caching**
   - More granular cache control
   - Better revalidation strategies
   - Edge caching improvements

4. **Framework Integration**
   - More frameworks adopting RSC (not just Next.js)
   - Better tooling across the ecosystem
   - Standardized patterns

---

## Conclusion

React Server Components are not just a feature—they're a fundamental shift in how we build React applications. By 2025, they've become the default way to build performant, SEO-friendly web applications.

### Key Takeaways

✅ **Server Components** render on the server, reduce bundle size by 85%  
✅ **Client Components** handle interactivity, use hooks and browser APIs  
✅ **Use both together** for optimal results  
✅ **Suspense enables streaming** for progressive rendering  
✅ **Server Actions** eliminate the need for separate API routes  

### Quick Decision Guide

**Use Server Components for:**
- Data fetching
- Database queries
- Heavy computations
- SEO-critical content

**Use Client Components for:**
- User interactions
- State management
- Browser APIs
- Real-time updates

---

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Vercel RSC Demo](https://github.com/vercel/next-react-server-components)

---

*Last updated: October 2025. Found this guide helpful? Share it with your team!*
