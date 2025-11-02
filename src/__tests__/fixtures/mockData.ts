// src/__tests__/fixtures/mockData.ts

/**
 * Mock data factories for consistent test data
 * Use these factories instead of creating mock data inline
 */

import type { Blog, Project, Tag, Category, User, Image } from '@prisma/client';

/**
 * Counter for generating unique IDs
 */
let idCounter = 0;
const generateId = () => `test-id-${++idCounter}`;

/**
 * Reset ID counter (call in beforeEach)
 */
export function resetIdCounter() {
  idCounter = 0;
}

/**
 * Blog Post Factory
 */
export function createMockBlog(overrides: Partial<Blog> = {}): Blog {
  return {
    id: generateId(),
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    description: null,
    excerpt: 'This is a test excerpt for the blog post.',
    content: '# Test Blog\n\nThis is test content with **markdown**.',
    coverImage: null,
    published: true,
    featured: false,
    views: 42,
    likes: 10,
    readTime: 5,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    authorId: 'user-1',
    categoryId: null,
    ...overrides,
  };
}

/**
 * Create multiple blog posts
 */
export function createMockBlogs(count: number, overrides: Partial<Blog> = {}): Blog[] {
  return Array.from({ length: count }, (_, i) =>
    createMockBlog({
      title: `Test Blog Post ${i + 1}`,
      slug: `test-blog-post-${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Project Factory
 */
export function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    id: generateId(),
    title: 'Test Project',
    slug: 'test-project',
    description: 'A comprehensive test project showcasing various technologies.',
    content: null,
    coverImage: '/images/projects/test.jpg',
    thumbnail: '/images/projects/test-thumb.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/test/project',
    featured: false,
    published: true,
    order: 0,
    views: 100,
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    startDate: new Date('2024-01-01'),
    endDate: null,
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    authorId: 'user-1',
    categoryId: null,
    ...overrides,
  };
}

/**
 * Create multiple projects
 */
export function createMockProjects(count: number, overrides: Partial<Project> = {}): Project[] {
  return Array.from({ length: count }, (_, i) =>
    createMockProject({
      title: `Test Project ${i + 1}`,
      slug: `test-project-${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Tag Factory
 */
export function createMockTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: generateId(),
    name: 'Test Tag',
    slug: 'test-tag',
    color: '#3B82F6',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    ...overrides,
  };
}

/**
 * Create multiple tags
 */
export function createMockTags(names: string[]): Tag[] {
  return names.map((name) =>
    createMockTag({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    })
  );
}

/**
 * Category Factory
 */
export function createMockCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: generateId(),
    name: 'Test Category',
    slug: 'test-category',
    description: 'This is a test category for organizing content.',
    color: '#10B981',
    icon: '📁',
    order: 0,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    ...overrides,
  };
}

/**
 * User Factory
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: generateId(),
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: new Date('2024-01-01T10:00:00Z'),
    image: null,
    password: null,
    role: 'user',
    bio: 'A test user for automated testing',
    website: 'https://testuser.com',
    github: 'testuser',
    twitter: '@testuser',
    linkedin: 'testuser',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    ...overrides,
  };
}

/**
 * Admin User Factory
 */
export function createMockAdminUser(overrides: Partial<User> = {}): User {
  return createMockUser({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    ...overrides,
  });
}

/**
 * Image Factory
 */
export function createMockImage(overrides: Partial<Image> = {}): Image {
  return {
    id: generateId(),
    url: 'https://example.com/images/test.jpg',
    alt: 'Test image',
    caption: 'A test image for automated testing',
    width: 1920,
    height: 1080,
    size: 512000,
    format: 'jpg',
    blurHash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-01-10T10:00:00Z'),
    blogId: null,
    projectId: null,
    ...overrides,
  };
}

/**
 * Blog with Relations Factory
 */
export function createMockBlogWithRelations(overrides = {}) {
  const author = createMockUser({ name: 'John Doe' });
  const category = createMockCategory({ name: 'Technology' });
  const tags = createMockTags(['React', 'Next.js', 'TypeScript']);

  return {
    ...createMockBlog(overrides),
    author: {
      name: author.name,
      email: author.email,
      image: author.image,
    },
    category: {
      name: category.name,
      slug: category.slug,
    },
    tags: tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    images: [],
    codeExamples: [],
    faqs: [],
  };
}

/**
 * Project with Relations Factory
 */
export function createMockProjectWithRelations(overrides = {}) {
  const author = createMockUser({ name: 'Jane Smith' });
  const tags = createMockTags(['React', 'TypeScript']);

  return {
    ...createMockProject(overrides),
    author: {
      name: author.name,
      image: author.image,
    },
    tags: tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    images: [],
  };
}

/**
 * API Request Body Factories
 */
export const mockRequestBodies = {
  createBlog: {
    title: 'New Blog Post',
    slug: 'new-blog-post',
    content: '# New Blog\n\nThis is content.',
    excerpt: 'This is an excerpt.',
    published: false,
    featured: false,
    categoryId: null,
    tags: [],
  },

  updateBlog: {
    title: 'Updated Blog Post',
    content: '# Updated Blog\n\nThis is updated content.',
    published: true,
  },

  createProject: {
    title: 'New Project',
    slug: 'new-project',
    description: 'A new test project',
    techStack: ['React', 'Next.js'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/test/new-project',
    published: true,
  },

  createTag: {
    name: 'New Tag',
    slug: 'new-tag',
    color: '#3B82F6',
  },

  contactForm: {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message from the contact form.',
  },

  searchQuery: {
    q: 'test search query',
    category: 'all',
    sort: 'relevance',
    page: 1,
  },
};

/**
 * API Response Factories
 */
export const mockApiResponses = {
  success: (data: any) => ({
    success: true,
    data,
  }),

  error: (message: string, code: string = 'ERROR') => ({
    success: false,
    error: {
      code,
      message,
    },
  }),

  paginatedBlogs: (blogs: Blog[], total: number = blogs.length) => ({
    success: true,
    data: {
      blogs,
      pagination: {
        total,
        page: 1,
        perPage: 10,
        totalPages: Math.ceil(total / 10),
      },
    },
  }),

  paginatedProjects: (projects: Project[], total: number = projects.length) => ({
    success: true,
    data: {
      projects,
      pagination: {
        total,
        page: 1,
        perPage: 10,
        totalPages: Math.ceil(total / 10),
      },
    },
  }),
};

/**
 * File Upload Mocks
 */
export const mockFiles = {
  validImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
  validPng: new File([''], 'test.png', { type: 'image/png' }),
  invalidType: new File([''], 'test.txt', { type: 'text/plain' }),
  tooLarge: Object.assign(
    new File([''], 'large.jpg', { type: 'image/jpeg' }),
    { size: 10 * 1024 * 1024 } // 10MB
  ),
};

/**
 * Search Results Mock
 */
export function createMockSearchResults() {
  return {
    blogs: createMockBlogs(3),
    projects: createMockProjects(2),
    total: 5,
    query: 'test',
  };
}

/**
 * Error Mocks
 */
export const mockErrors = {
  notFound: new Error('Not found'),
  unauthorized: new Error('Unauthorized'),
  forbidden: new Error('Forbidden'),
  validation: new Error('Validation failed'),
  serverError: new Error('Internal server error'),
  prismaNotFound: {
    code: 'P2025',
    message: 'Record not found',
  },
  prismaConstraint: {
    code: 'P2002',
    message: 'Unique constraint failed',
  },
};

/**
 * Session Mocks
 */
export const mockSessions = {
  user: {
    user: createMockUser(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  admin: {
    user: createMockAdminUser(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  expired: {
    user: createMockUser(),
    expires: new Date(Date.now() - 1000).toISOString(),
  },
};

/**
 * Form Data Mocks
 */
export function createMockFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}
