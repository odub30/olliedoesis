// src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/projects';
import { ProjectDetail } from '@/components/features/projects/ProjectDetail';
import { marked } from 'marked';
import { prisma } from '@/lib/prisma';
import { logDebug } from "@/lib/logger";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Projects | Ollie Does`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Increment view count in database (if project exists in DB)
  // This tracks analytics while keeping content in markdown files
  try {
    await prisma.project.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Silently fail if project doesn't exist in database yet
    // This allows markdown projects to work without DB entries
    logDebug(`View tracking skipped for project: ${slug}`);
  }

  const htmlContent = await marked(project.longDescription || '');

  return <ProjectDetail project={project} htmlContent={htmlContent} />;
}
