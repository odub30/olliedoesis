# Copilot Instructions for olliedoesis

## Project Overview
- This is a Next.js (App Router) project, bootstrapped with `create-next-app`.
- Uses TypeScript, Tailwind CSS, and PostCSS for styling.
- Content is organized under `src/app/` (pages, API routes) and `components/` (UI, features, layout, sections, and UI primitives).
- Data and configuration live in `src/data/` and `src/lib/`.
- Public assets are in `public/` (including images, SVGs, and JSON schemas).

## Key Patterns & Conventions
- **Pages & Routing:**
  - All routes are in `src/app/`, using the App Router convention (`page.tsx`, `layout.tsx`, etc.).
  - Dynamic routes use `[param]` syntax (e.g., `projects/[slug]/page.tsx`).
  - API endpoints are in `src/app/api/` (e.g., `src/app/api/contact/route.ts`).
- **Components:**
  - UI components are in `src/components/ui/`.
  - Feature-specific components are in `src/components/features/`.
  - Layout and section components are in their respective subfolders.
- **Data & Config:**
  - Site config and personal info: `src/data/site-config.ts`, `src/data/personal-info.ts`.
  - Project data: `src/data/projects/` (markdown files).
  - Utility functions and constants: `src/lib/`.
- **Styling:**
  - Global styles: `src/app/globals.css`.
  - Component styles: `src/styles/components.css`.
  - Tailwind config: `tailwind.config.js`.

## Developer Workflows
- **Development:**
  - Start dev server: `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
  - Edit pages/components; changes auto-reload.
- **Build:**
  - Production build: `npm run build`.
  - Preview: `npm run start` after build.
- **Linting:**
  - Lint: `npm run lint` (uses ESLint config in `eslint.config.mjs`).
- **Type Checking:**
  - TypeScript config: `tsconfig.json`.

## Integration & Data Flow
- **API routes** handle form submissions and data fetching (see `src/app/api/`).
- **GitHub integration** via `src/components/features/github/` and `src/hooks/useGitHub.ts`.
- **Project and personal data** are loaded from markdown and TypeScript files in `src/data/`.
- **Structured data** and validation utilities in `src/lib/structured-data.ts` and `src/lib/validations.ts`.

## Project-Specific Notes
- **Schema files** for structured data are in `public/schemas/`.
- **Images** for Open Graph and projects are in `public/images/og/` and `public/images/projects/`.
- **Navbar** is implemented in both JS and TSX (`components/Navbar.jsx` and `components/Navbar.tsx`); prefer TSX for new work.
- **About and Projects** pages have preview/alternate versions (see `components/sections/`).

## Examples
- To add a new project: create a markdown file in `src/data/projects/` and update `src/lib/projects.ts` if needed.
- To add a new API route: add a folder with `route.ts` under `src/app/api/`.
- To add a new UI component: place it in `src/components/ui/` and import as needed.

---
For more details, see `README.md` and explore the `src/` and `public/` directories for structure and examples.
