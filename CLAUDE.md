# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Create production build
- `npm run start` - Start production server (run after build)
- `npm run lint` - Run ESLint linting
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking (tsc --noEmit)
- `npm run clean` - Clean build artifacts (.next, out)

### Testing
No testing framework is currently configured in this project.

## Architecture & Structure

This is a **Next.js 15 App Router** project with TypeScript, using:
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript
- **Content**: Markdown files with gray-matter frontmatter
- **Animation**: Framer Motion

### Key Directory Structure
```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/          # API endpoints (contact, github, projects, search, sitemap)
│   ├── projects/     # Projects listing and detail pages
│   └── *.tsx         # Pages (about, contact, layout, etc.)
├── components/       # React components
│   ├── ui/           # Reusable UI primitives
│   ├── features/     # Feature-specific components (github integration)
│   ├── layout/       # Layout components
│   └── sections/     # Page section components
├── data/             # Static data and configuration
│   ├── projects/     # Project markdown files
│   ├── personal-info.ts
│   └── site-config.ts
├── hooks/            # Custom React hooks (useGitHub.ts)
├── lib/              # Utility functions and constants
├── styles/           # CSS files (globals, components)
└── types/            # TypeScript type definitions

content/              # External content directory (empty)
public/               # Static assets
├── images/           # Project and OG images
└── schemas/          # JSON schemas for structured data
```

### Important Architecture Notes

**Routing & Pages:**
- Uses App Router with `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`
- Dynamic routes: `projects/[slug]/page.tsx` for individual project pages
- API routes in `src/app/api/` handle form submissions and data fetching

**Data Flow:**
- Project data loaded from markdown files in `src/data/projects/`
- Site configuration in `src/data/site-config.ts` and `src/data/personal-info.ts`
- GitHub integration via API route and custom hook
- Structured data validation in `src/lib/structured-data.ts`

**Styling:**
- Global styles: `src/app/globals.css`
- Component styles: `src/styles/components.css`
- Tailwind config: `tailwind.config.js`
- Uses `clsx` and `tailwind-merge` for conditional classes

**Content Management:**
- Projects are markdown files with frontmatter in `src/data/projects/`
- Uses `gray-matter` for parsing frontmatter and `marked` for rendering
- Reading time calculation with `reading-time` package

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Development Workflow

1. **Adding a new project**: Create markdown file in `src/data/projects/` with frontmatter
2. **Adding a new page**: Create `page.tsx` in appropriate `src/app/` subdirectory
3. **Adding API route**: Create `route.ts` in `src/app/api/` subdirectory
4. **Adding UI component**: Place in `src/components/ui/` and import as needed

## Configuration Files

- **Next.js**: `next.config.mjs` (with ESLint ignore for builds, webpack optimizations)
- **TypeScript**: `tsconfig.json` (ES2017 target, path aliases)
- **ESLint**: `eslint.config.mjs`
- **Tailwind**: `tailwind.config.js`
- **PostCSS**: `postcss.config.mjs`
- **Package management**: `package.json`, `package-lock.json`

## Important Notes

- ESLint errors are ignored during builds (configured in next.config.mjs)
- No testing framework is currently set up
- Uses React 19 and Next.js 15 (latest versions)
- Font optimization with Geist font family via `next/font`
- Deployment configured for Vercel platform