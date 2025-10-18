// scripts/check-database.ts
// Quick diagnostic script to check database content

import { prisma } from '../src/lib/prisma';

async function checkDatabase() {
  console.log('🔍 Checking database content...\n');

  try {
    // Check users
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    console.log(`👥 Users: ${userCount}`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Created: ${user.createdAt.toISOString()}`);
    });
    console.log();

    // Check blogs
    const blogCount = await prisma.blog.count();
    const publishedBlogCount = await prisma.blog.count({ where: { published: true } });
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        featured: true,
        views: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log(`📝 Blogs: ${blogCount} total, ${publishedBlogCount} published`);
    if (blogs.length > 0) {
      blogs.forEach(blog => {
        const status = blog.published ? '✅ Published' : '❌ Draft';
        const featured = blog.featured ? ' ⭐' : '';
        console.log(`   - ${blog.title}${featured}`);
        console.log(`     ${status} | Views: ${blog.views} | /${blog.slug}`);
      });
    } else {
      console.log('   ⚠️  No blogs found in database');
    }
    console.log();

    // Check projects
    const projectCount = await prisma.project.count();
    const publishedProjectCount = await prisma.project.count({ where: { published: true } });
    console.log(`🚀 Projects: ${projectCount} total, ${publishedProjectCount} published`);
    console.log();

    // Check tags
    const tagCount = await prisma.tag.count();
    console.log(`🏷️  Tags: ${tagCount}`);
    console.log();

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
