// src/__tests__/utils/prisma-mock.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

/**
 * Mock Prisma Client for testing database operations
 * This allows us to test database logic without hitting the actual database
 */

// Create deep mock of Prisma Client
const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

/**
 * Reset all mocks before each test
 */
export function resetPrismaMock() {
  mockReset(prismaMock);
}

/**
 * Mock the Prisma module
 */
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock,
}));

export { prismaMock };

/**
 * Helper to create mock Prisma responses
 */
export const mockPrismaResponses = {
  /**
   * Mock blog response
   */
  blog: (overrides = {}) => ({
    id: 'blog-1',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is test content',
    excerpt: 'This is a test excerpt',
    published: true,
    featured: false,
    views: 0,
    likes: 0,
    readTime: 5,
    coverImage: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user-1',
    categoryId: null,
    ...overrides,
  }),

  /**
   * Mock project response
   */
  project: (overrides = {}) => ({
    id: 'project-1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'Test project description',
    content: null,
    coverImage: null,
    thumbnail: null,
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/test/project',
    featured: false,
    published: true,
    order: 0,
    views: 0,
    techStack: ['React', 'Next.js', 'TypeScript'],
    startDate: null,
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user-1',
    categoryId: null,
    ...overrides,
  }),

  /**
   * Mock tag response
   */
  tag: (overrides = {}) => ({
    id: 'tag-1',
    name: 'Test Tag',
    slug: 'test-tag',
    color: '#3B82F6',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  /**
   * Mock category response
   */
  category: (overrides = {}) => ({
    id: 'category-1',
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
    color: '#10B981',
    icon: '📁',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  /**
   * Mock user response
   */
  user: (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: new Date(),
    image: null,
    password: null,
    role: 'user',
    bio: null,
    website: null,
    github: null,
    twitter: null,
    linkedin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  /**
   * Mock image response
   */
  image: (overrides = {}) => ({
    id: 'image-1',
    url: 'https://example.com/image.jpg',
    alt: 'Test image',
    caption: 'Test caption',
    width: 1920,
    height: 1080,
    size: 512000,
    format: 'jpg',
    blurHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    blogId: null,
    projectId: null,
    ...overrides,
  }),

  /**
   * Mock contact response
   */
  contact: (overrides = {}) => ({
    id: 'contact-1',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message content',
    phone: null,
    company: null,
    status: 'new',
    priority: 'normal',
    userAgent: null,
    ip: null,
    createdAt: new Date(),
    readAt: null,
    repliedAt: null,
    updatedAt: new Date(),
    ...overrides,
  }),
};

/**
 * Helper to mock Prisma findUnique
 */
export function mockFindUnique<T>(model: string, response: T | null) {
  (prismaMock as any)[model].findUnique.mockResolvedValue(response);
}

/**
 * Helper to mock Prisma findMany
 */
export function mockFindMany<T>(model: string, response: T[]) {
  (prismaMock as any)[model].findMany.mockResolvedValue(response);
}

/**
 * Helper to mock Prisma create
 */
export function mockCreate<T>(model: string, response: T) {
  (prismaMock as any)[model].create.mockResolvedValue(response);
}

/**
 * Helper to mock Prisma update
 */
export function mockUpdate<T>(model: string, response: T) {
  (prismaMock as any)[model].update.mockResolvedValue(response);
}

/**
 * Helper to mock Prisma delete
 */
export function mockDelete<T>(model: string, response: T) {
  (prismaMock as any)[model].delete.mockResolvedValue(response);
}

/**
 * Helper to mock Prisma errors
 */
export function mockPrismaError(model: string, method: string, error: Error) {
  (prismaMock as any)[model][method].mockRejectedValue(error);
}
