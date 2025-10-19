import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.blogMetrics.deleteMany();
  await prisma.codeExample.deleteMany();
  await prisma.blogFAQ.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.searchAnalytics.deleteMany();
  await prisma.image.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating users...');
  const hashedPassword = await hash('admin123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      bio: 'Full-stack developer passionate about web technologies and sharing knowledge.',
      website: 'https://example.com',
      github: 'https://github.com/admin',
      twitter: 'https://twitter.com/admin',
      linkedin: 'https://linkedin.com/in/admin',
      emailVerified: new Date(),
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      name: 'Editor User',
      email: 'editor@example.com',
      role: 'editor',
      bio: 'Content editor and technical writer.',
      emailVerified: new Date(),
    },
  });

  // Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Frontend Development',
        slug: 'frontend-development',
        description: 'Everything about building modern user interfaces',
        color: '#3B82F6',
        icon: '⚛️',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Backend Development',
        slug: 'backend-development',
        description: 'Server-side development, APIs, and databases',
        color: '#10B981',
        icon: '🔧',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Full Stack Projects',
        slug: 'full-stack-projects',
        description: 'Complete applications from frontend to backend',
        color: '#8B5CF6',
        icon: '🚀',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Web Performance',
        slug: 'web-performance',
        description: 'Optimization techniques and best practices',
        color: '#F59E0B',
        icon: '⚡',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'DevOps & Deployment',
        slug: 'devops-deployment',
        description: 'CI/CD, deployment strategies, and infrastructure',
        color: '#EF4444',
        icon: '🔄',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Security best practices and implementation',
        color: '#EC4899',
        icon: '🔒',
        order: 6,
      },
    }),
  ]);

  // Create Tags
  console.log('🏷️  Creating tags...');
  const tagData = [
    // Frontend Technologies
    { name: 'React', slug: 'react', color: '#61DAFB' },
    { name: 'Next.js', slug: 'nextjs', color: '#000000' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
    { name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06B6D4' },
    { name: 'Framer Motion', slug: 'framer-motion', color: '#FF0055' },
    { name: 'Radix UI', slug: 'radix-ui', color: '#161618' },
    { name: 'shadcn/ui', slug: 'shadcn-ui', color: '#000000' },
    { name: 'HTML5', slug: 'html5', color: '#E34F26' },
    { name: 'CSS3', slug: 'css3', color: '#1572B6' },
    { name: 'Responsive Design', slug: 'responsive-design', color: '#4CAF50' },
    
    // Backend & Database
    { name: 'Node.js', slug: 'nodejs', color: '#339933' },
    { name: 'Prisma', slug: 'prisma', color: '#2D3748' },
    { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
    { name: 'Database Design', slug: 'database-design', color: '#FF6B6B' },
    { name: 'API Routes', slug: 'api-routes', color: '#FF9800' },
    { name: 'RESTful APIs', slug: 'restful-apis', color: '#4CAF50' },
    { name: 'GraphQL', slug: 'graphql', color: '#E10098' },
    
    // Authentication & Security
    { name: 'NextAuth.js', slug: 'nextauth', color: '#000000' },
    { name: 'OAuth', slug: 'oauth', color: '#EB5424' },
    { name: 'Authentication', slug: 'authentication', color: '#FF5722' },
    { name: 'Security Best Practices', slug: 'security-best-practices', color: '#F44336' },
    
    // Performance
    { name: 'Performance Optimization', slug: 'performance-optimization', color: '#FFC107' },
    { name: 'Core Web Vitals', slug: 'core-web-vitals', color: '#4285F4' },
    { name: 'SEO', slug: 'seo', color: '#34A853' },
    { name: 'Image Optimization', slug: 'image-optimization', color: '#9C27B0' },
    
    // Development Tools
    { name: 'Git', slug: 'git', color: '#F05032' },
    { name: 'GitHub', slug: 'github', color: '#181717' },
    { name: 'Testing', slug: 'testing', color: '#15C213' },
    { name: 'Jest', slug: 'jest', color: '#C21325' },
    { name: 'ESLint', slug: 'eslint', color: '#4B32C3' },
    
    // Deployment
    { name: 'Vercel', slug: 'vercel', color: '#000000' },
    { name: 'CI/CD', slug: 'cicd', color: '#2088FF' },
    { name: 'Docker', slug: 'docker', color: '#2496ED' },
    
    // UI/UX
    { name: 'UI Components', slug: 'ui-components', color: '#FF6F61' },
    { name: 'Animations', slug: 'animations', color: '#FF00FF' },
    { name: 'User Experience', slug: 'user-experience', color: '#00BCD4' },
    { name: 'Accessibility', slug: 'accessibility', color: '#4CAF50' },
    { name: 'Dark Mode', slug: 'dark-mode', color: '#212121' },
  ];

  const tags = await Promise.all(
    tagData.map((tag) => prisma.tag.create({ data: tag }))
  );

  // Create sample blogs with all features
  console.log('📝 Creating blogs...');
  
  const blog1 = await prisma.blog.create({
    data: {
      title: 'Getting Started with Next.js 15 App Router',
      slug: 'getting-started-nextjs-15-app-router',
      description: 'Learn the fundamentals of Next.js 15 App Router and build modern web applications',
      excerpt: 'A comprehensive guide to understanding and using the Next.js 15 App Router, covering routing, layouts, and server components.',
      content: `
# Getting Started with Next.js 15 App Router

Next.js 15 introduces powerful features with the App Router that revolutionize how we build web applications.

## What is the App Router?

The App Router is Next.js's new routing system built on React Server Components. It provides:

- **File-based routing** with intuitive conventions
- **Layouts** for shared UI across routes
- **Loading states** with React Suspense
- **Error boundaries** for graceful error handling

## Key Features

### Server Components by Default

Components are Server Components by default, which means:
- Reduced JavaScript bundle size
- Direct database access
- Better SEO

### Nested Layouts

Create nested layouts that persist across navigation:
- Shared navigation
- Persistent state
- Optimized re-renders

## Getting Started

Let's build your first App Router application...
      `,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
      published: true,
      featured: true,
      views: 1250,
      likes: 89,
      readTime: 8,
      metaTitle: 'Next.js 15 App Router: Complete Getting Started Guide',
      metaDescription: 'Learn Next.js 15 App Router fundamentals. Build modern web applications with server components, layouts, and file-based routing.',
      metaKeywords: 'nextjs, react, app router, server components, web development',
      publishedAt: new Date('2024-01-15'),
      authorId: adminUser.id,
      categoryId: categories[0].id,
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'nextjs')?.id },
          { id: tags.find(t => t.slug === 'react')?.id },
          { id: tags.find(t => t.slug === 'typescript')?.id },
        ].filter(Boolean),
      },
      codeExamples: {
        create: [
          {
            title: 'Basic Page Component',
            code: `export default function Page() {
  return (
    <div>
      <h1>Welcome to Next.js 15</h1>
      <p>This is a Server Component by default</p>
    </div>
  )
}`,
            language: 'typescript',
            filename: 'app/page.tsx',
            order: 1,
          },
          {
            title: 'Creating a Layout',
            code: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>Navigation</nav>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  )
}`,
            language: 'typescript',
            filename: 'app/layout.tsx',
            order: 2,
          },
        ],
      },
      faqs: {
        create: [
          {
            question: 'What is the difference between App Router and Pages Router?',
            answer: 'The App Router is built on React Server Components and provides better performance, more intuitive routing, and improved developer experience compared to the Pages Router.',
            order: 1,
          },
          {
            question: 'Can I use Client Components with App Router?',
            answer: 'Yes! You can use Client Components by adding "use client" at the top of your component file. This is useful for interactive features that need browser APIs.',
            order: 2,
          },
        ],
      },
      metrics: {
        create: {
          views: 1250,
          uniqueViews: 980,
          likes: 89,
          shares: 45,
          avgReadTime: 420,
          totalReadTime: 411600,
          bounceRate: 32.5,
          organicViews: 850,
          directViews: 200,
          referralViews: 150,
          socialViews: 50,
        },
      },
    },
  });

  const blog2 = await prisma.blog.create({
    data: {
      title: 'Mastering TypeScript in React Applications',
      slug: 'mastering-typescript-react-applications',
      description: 'Deep dive into TypeScript patterns and best practices for React development',
      excerpt: 'Learn advanced TypeScript techniques for building type-safe React applications with better developer experience.',
      content: `
# Mastering TypeScript in React Applications

TypeScript has become essential for building robust React applications. Let's explore advanced patterns.

## Type-Safe Props

Define component props with interfaces for complete type safety...
      `,
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200',
      published: true,
      featured: true,
      views: 890,
      likes: 67,
      readTime: 12,
      publishedAt: new Date('2024-01-20'),
      authorId: adminUser.id,
      categoryId: categories[0].id,
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'typescript')?.id },
          { id: tags.find(t => t.slug === 'react')?.id },
        ].filter(Boolean),
      },
      metrics: {
        create: {
          views: 890,
          uniqueViews: 720,
          likes: 67,
          shares: 34,
          avgReadTime: 540,
          totalReadTime: 388800,
        },
      },
    },
  });

  const blog3 = await prisma.blog.create({
    data: {
      title: 'Building RESTful APIs with Node.js and Prisma',
      slug: 'building-restful-apis-nodejs-prisma',
      description: 'Complete guide to creating production-ready REST APIs',
      excerpt: 'Learn how to build scalable RESTful APIs using Node.js, Express, and Prisma ORM with TypeScript.',
      content: `
# Building RESTful APIs with Node.js and Prisma

Creating robust APIs is fundamental to modern web development. Let's build one together...
      `,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
      published: true,
      featured: false,
      views: 654,
      likes: 42,
      readTime: 15,
      publishedAt: new Date('2024-01-25'),
      authorId: editorUser.id,
      categoryId: categories[1].id,
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'nodejs')?.id },
          { id: tags.find(t => t.slug === 'prisma')?.id },
          { id: tags.find(t => t.slug === 'restful-apis')?.id },
        ].filter(Boolean),
      },
      metrics: {
        create: {
          views: 654,
          uniqueViews: 520,
          likes: 42,
          shares: 18,
        },
      },
    },
  });

  // Create sample projects
  console.log('🚀 Creating projects...');
  
  await prisma.project.create({
    data: {
      title: 'E-commerce Platform',
      slug: 'ecommerce-platform',
      description: 'A full-stack e-commerce platform with Next.js, Stripe, and Prisma',
      content: 'Complete e-commerce solution with product management, cart, checkout, and admin dashboard.',
      thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/ecommerce',
      featured: true,
      published: true,
      views: 2340,
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-12-15'),
      authorId: adminUser.id,
      categoryId: categories[2].id,
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'nextjs')?.id },
          { id: tags.find(t => t.slug === 'typescript')?.id },
          { id: tags.find(t => t.slug === 'prisma')?.id },
        ].filter(Boolean),
      },
    },
  });

  await prisma.project.create({
    data: {
      title: 'Real-time Chat Application',
      slug: 'realtime-chat-app',
      description: 'WebSocket-based chat application with rooms and presence',
      content: 'Real-time messaging platform with typing indicators, presence, and message history.',
      coverImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200',
      demoUrl: 'https://chat.example.com',
      featured: true,
      published: true,
      views: 1890,
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Redis'],
      startDate: new Date('2023-09-01'),
      authorId: adminUser.id,
      categoryId: categories[2].id,
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'react')?.id },
          { id: tags.find(t => t.slug === 'nodejs')?.id },
        ].filter(Boolean),
      },
    },
  });

  // Create page views
  console.log('👁️  Creating page views...');
  const now = new Date();
  const viewDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return date;
  });

  for (const date of viewDates) {
    await prisma.pageView.createMany({
      data: Array.from({ length: Math.floor(Math.random() * 50) + 10 }, () => ({
        path: '/blog/getting-started-nextjs-15-app-router',
        title: 'Getting Started with Next.js 15 App Router',
        referrer: Math.random() > 0.5 ? 'https://google.com' : 'https://twitter.com',
        sessionId: `session-${Math.random().toString(36).substring(7)}`,
        browser: ['Chrome', 'Firefox', 'Safari'][Math.floor(Math.random() * 3)],
        os: ['Windows', 'macOS', 'Linux'][Math.floor(Math.random() * 3)],
        device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        country: ['US', 'UK', 'CA', 'AU'][Math.floor(Math.random() * 4)],
        duration: Math.floor(Math.random() * 600) + 60,
        viewedAt: date,
        blogId: blog1.id,
      })),
    });
  }

  // Create search history
  console.log('🔍 Creating search history...');
  const searchQueries = [
    'next.js tutorial',
    'typescript react',
    'prisma orm',
    'authentication nextjs',
    'tailwind css',
    'api routes',
    'server components',
    'database design',
  ];

  for (const query of searchQueries) {
    await prisma.searchHistory.createMany({
      data: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, () => ({
        query,
        results: Math.floor(Math.random() * 20) + 1,
        clicked: Math.random() > 0.3,
        sessionId: `session-${Math.random().toString(36).substring(7)}`,
        source: 'header-search',
        searchedAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      })),
    });
  }

  // Create search analytics
  console.log('📊 Creating search analytics...');
  for (const query of searchQueries) {
    await prisma.searchAnalytics.create({
      data: {
        query,
        searchCount: Math.floor(Math.random() * 100) + 10,
        clickCount: Math.floor(Math.random() * 80) + 5,
        avgResults: Math.random() * 15 + 5,
        clickRate: Math.random() * 60 + 20,
        topResultIds: [blog1.id, blog2.id, blog3.id].slice(0, Math.floor(Math.random() * 3) + 1),
        firstSearched: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        lastSearched: new Date(),
      },
    });
  }

  // Create newsletter subscribers
  console.log('📧 Creating newsletter subscribers...');
  await prisma.newsletter.createMany({
    data: [
      {
        email: 'subscriber1@example.com',
        name: 'John Doe',
        subscribed: true,
        verified: true,
        source: 'homepage',
        frequency: 'weekly',
        categories: ['Frontend Development', 'Web Performance'],
        subscribedAt: new Date('2024-01-01'),
        verifiedAt: new Date('2024-01-01'),
      },
      {
        email: 'subscriber2@example.com',
        name: 'Jane Smith',
        subscribed: true,
        verified: true,
        source: 'blog-post',
        frequency: 'monthly',
        categories: ['Backend Development'],
        subscribedAt: new Date('2024-01-10'),
        verifiedAt: new Date('2024-01-10'),
      },
    ],
  });

  // Create contact messages
  console.log('💬 Creating contact messages...');
  await prisma.contact.createMany({
    data: [
      {
        name: 'Potential Client',
        email: 'client@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a potential project collaboration.',
        status: 'new',
        priority: 'high',
        createdAt: new Date(),
      },
      {
        name: 'Fellow Developer',
        email: 'dev@example.com',
        subject: 'Technical Question',
        message: 'I have a question about your Next.js tutorial.',
        status: 'read',
        priority: 'normal',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        readAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // Create site settings
  console.log('⚙️  Creating site settings...');
  await prisma.siteSettings.createMany({
    data: [
      {
        key: 'site_name',
        value: { value: 'My Developer Blog' },
      },
      {
        key: 'site_description',
        value: { value: 'A blog about web development, tutorials, and projects' },
      },
      {
        key: 'social_links',
        value: {
          github: 'https://github.com/yourusername',
          twitter: 'https://twitter.com/yourusername',
          linkedin: 'https://linkedin.com/in/yourusername',
        },
      },
      {
        key: 'analytics',
        value: {
          enabled: true,
          trackPageViews: true,
          trackSearches: true,
        },
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Categories: ${await prisma.category.count()}`);
  console.log(`- Tags: ${await prisma.tag.count()}`);
  console.log(`- Blogs: ${await prisma.blog.count()}`);
  console.log(`- Projects: ${await prisma.project.count()}`);
  console.log(`- Code Examples: ${await prisma.codeExample.count()}`);
  console.log(`- FAQs: ${await prisma.blogFAQ.count()}`);
  console.log(`- Page Views: ${await prisma.pageView.count()}`);
  console.log(`- Search History: ${await prisma.searchHistory.count()}`);
  console.log(`- Search Analytics: ${await prisma.searchAnalytics.count()}`);
  console.log(`- Newsletter Subscribers: ${await prisma.newsletter.count()}`);
  console.log(`- Contact Messages: ${await prisma.contact.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });