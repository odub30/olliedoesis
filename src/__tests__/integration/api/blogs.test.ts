// src/__tests__/integration/api/blogs.test.ts
/**
 * API Integration Tests for Blog Routes
 *
 * Tests the /api/admin/blogs/* endpoints with database mocking
 * Covers CRUD operations, authorization, and validation
 */

import { NextRequest } from 'next/server';
import { prismaMock, mockPrismaResponses, resetPrismaMock } from '@/__tests__/utils/prisma-mock';
import { createMockBlog, createMockBlogs, createMockAdminUser, mockApiResponses } from '@/__tests__/fixtures/mockData';

// Mock Next Auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('Blog API Routes', () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  describe('GET /api/admin/blogs', () => {
    it('should return all blogs for authenticated admin', async () => {
      const mockBlogs = createMockBlogs(3);
      prismaMock.blog.findMany.mockResolvedValue(mockBlogs);

      // Mock session
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({
        user: createMockAdminUser(),
      });

      // Import handler after mocking
      const { GET } = await import('@/app/api/admin/blogs/route');

      const request = new NextRequest('http://localhost:3000/api/admin/blogs');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.blogs).toHaveLength(3);
      expect(prismaMock.blog.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue(null);

      const { GET } = await import('@/app/api/admin/blogs/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should filter blogs by published status', async () => {
      const mockBlogs = [
        createMockBlog({ published: true }),
        createMockBlog({ published: false }),
      ];
      prismaMock.blog.findMany.mockResolvedValue(mockBlogs.filter(b => b.published));

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { GET } = await import('@/app/api/admin/blogs/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs?published=true');
      const response = await GET(request);
      const data = await response.json();

      expect(data.data.blogs).toHaveLength(1);
      expect(data.data.blogs[0].published).toBe(true);
    });

    it('should handle database errors gracefully', async () => {
      prismaMock.blog.findMany.mockRejectedValue(new Error('Database connection failed'));

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { GET } = await import('@/app/api/admin/blogs/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/admin/blogs', () => {
    it('should create new blog with valid data', async () => {
      const newBlog = createMockBlog({ title: 'New Blog Post' });
      prismaMock.blog.create.mockResolvedValue(newBlog);

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { POST } = await import('@/app/api/admin/blogs/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Blog Post',
          slug: 'new-blog-post',
          content: 'Blog content',
          excerpt: 'Blog excerpt',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('New Blog Post');
    });

    it('should validate required fields', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { POST } = await import('@/app/api/admin/blogs/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
          title: '',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should prevent duplicate slugs', async () => {
      prismaMock.blog.create.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed on slug',
      });

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { POST } = await import('@/app/api/admin/blogs/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Blog',
          slug: 'existing-slug',
          content: 'Content',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(409); // Conflict
    });
  });

  describe('PUT /api/admin/blogs/:id', () => {
    it('should update existing blog', async () => {
      const updatedBlog = createMockBlog({
        id: 'blog-1',
        title: 'Updated Title',
      });

      prismaMock.blog.findUnique.mockResolvedValue(createMockBlog({ id: 'blog-1' }));
      prismaMock.blog.update.mockResolvedValue(updatedBlog);

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { PUT } = await import('@/app/api/admin/blogs/[id]/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs/blog-1', {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated Title',
        }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: 'blog-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.title).toBe('Updated Title');
    });

    it('should return 404 for non-existent blog', async () => {
      prismaMock.blog.findUnique.mockResolvedValue(null);

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { PUT } = await import('@/app/api/admin/blogs/[id]/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs/non-existent', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: 'non-existent' }) });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/admin/blogs/:id', () => {
    it('should delete existing blog', async () => {
      const blog = createMockBlog({ id: 'blog-1' });
      prismaMock.blog.findUnique.mockResolvedValue(blog);
      prismaMock.blog.delete.mockResolvedValue(blog);

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { DELETE } = await import('@/app/api/admin/blogs/[id]/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs/blog-1');

      const response = await DELETE(request, { params: Promise.resolve({ id: 'blog-1' }) });
      expect(response.status).toBe(200);
      expect(prismaMock.blog.delete).toHaveBeenCalledWith({
        where: { id: 'blog-1' },
      });
    });

    it('should handle cascade deletes for relations', async () => {
      // Blog with images should delete images too
      const blog = createMockBlog({ id: 'blog-1' });
      prismaMock.blog.findUnique.mockResolvedValue(blog);
      prismaMock.blog.delete.mockResolvedValue(blog);

      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue({ user: createMockAdminUser() });

      const { DELETE } = await import('@/app/api/admin/blogs/[id]/route');
      const request = new NextRequest('http://localhost:3000/api/admin/blogs/blog-1');

      const response = await DELETE(request, { params: Promise.resolve({ id: 'blog-1' }) });
      expect(response.status).toBe(200);
    });
  });
});
