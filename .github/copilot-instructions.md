<!-- .github/copilot-instructions.md - guidance for AI coding agents working on olliedoesis -->

# OllieDoesIs — Copilot instructions

Quick, actionable guidance for an AI coding agent contributing to this repository. Keep changes small, follow existing patterns, and prefer non-destructive edits.

- Project type: Next.js 15 (App Router) + TypeScript + Tailwind. Source is under `src/`.
- Key folders: `src/app/` (routes & API), `src/components/`, `src/data/` (markdown content), `prisma/` (DB schema & seeds), `public/` (assets), `scripts/` (utilities and seeds).

Core rules and expectations

- Default to server components: most `page.tsx` and `layout.tsx` files are server components. Only add `'use client'` at the top of a file when the component needs hooks, browser APIs, or event handlers.
- Path aliases: `@/*` => `./src/*` (check `tsconfig.json`) — use these in imports.
- Styling: Tailwind classes and `clsx`/`tailwind-merge` for conditional classes. Match component class patterns already present (rounded-xl, p-6, bg-white, etc.).
- Tests & CI: `npm test` runs Jest; e2e tests use Cypress (`npm run test:e2e`). CI is configured in GitHub Actions (see workflow badge in README).

Developer workflows (commands you should use)

- Dev server: `npm run dev` (Next on http://localhost:3000).
- Build: `npm run build` then `npm run start` to serve production build.
- Lint: `npm run lint`; lint is ignored during CI builds per `next.config.mjs` but still expected locally.
- Type check: `npm run type-check` (tsc --noEmit).
- Strict app-only type check: `npm run type-check:src` (tsc -p tsconfig.build.json) — use this to validate `src/` with stricter checks while legacy scripts/tests are remediated.
- DB seed: `npm run db:seed:blog` (uses ts-node to run prisma seed script). Ensure `DATABASE_URL` is set.
- Image optimization: `npm run optimize:image`.

Patterns & examples to follow

- API routes: `src/app/api/*/route.ts` export `GET`, `POST`, `PUT`, `DELETE` functions that return Next responses. Protect admin routes with `requireAdmin()` in `src/lib/admin.ts`.
- Data sources: content is often loaded from `src/data/*` (markdown + frontmatter parsed by `gray-matter`). Example: projects and blogs under `src/data/`.
- Prisma: models defined in `prisma/schema.prisma`. Use `@prisma/client` and `prisma` singleton patterns in `src/lib/` utilities.
- Admin UI: admin layout and components live under `src/app/admin/` and `src/components/admin/`. Follow existing patterns for sidebar, cards, and table UIs.

Conventions and gotchas

- ESLint is temporarily ignored during Next.js builds (see `next.config.mjs`). Don't rely on build-time linting; run lint locally and fix issues.
- React version 19 and Next 15 introduce server-first defaults. Avoid client-only code in server components.
- Image component usage: prefer optimized images and include width/height or `fill` per Next image rules.
- Environment files: `.env` / `.env.local` used by scripts (seed scripts load `.env.local` then `.env`). Seed and local DB tasks require `DATABASE_URL`.

Integration points

- Vercel: project configured for Vercel (Speed Insights, Analytics). Deploys expect environment variables set in Vercel dashboard.
- Resend, pino, prisma and vercel/og are external dependencies used in server code. Keep secrets out of code.

When editing

- Keep PRs small and scoped. Add tests for new logic (Jest) and a simple e2e if behavior affects UI flows (Cypress).
- Update `README.md` or add a short note under `docs/` for any new developer-facing workflow.

If unsure

- Search for similar files under `src/` before adding new patterns (e.g., new API route or component).
- If a change touches build, run `npm run build` locally and `npm run type-check` to avoid CI surprises.

Files to inspect first (high value)

- `src/app/layout.tsx`, `src/app/page.tsx` — app structure
- `src/app/api/*/route.ts` — API conventions
- `src/data/` — where content lives
- `prisma/schema.prisma` and `scripts/seed-nextjs-15-blog.ts` — DB model and seed conventions
- `next.config.mjs`, `package.json`, `tsconfig.json` — build and runtime settings

Templates

- Small example templates live under `src/app/api/example/route.ts`. Use this file as a starter for new API routes (GET/POST, Zod validation, error handling, and example `requireAdmin()` usage commented).

PRs and templates

- A basic PR template exists at `.github/PULL_REQUEST_TEMPLATE.md`. Follow that checklist before opening a PR. Important items: run `npm run type-check`, run `npm run lint`, and include tests for new logic.
- Exported templates (like `ExampleBody` in `src/app/api/example/route.ts`) are intentionally exported for reuse and testability. Use them in unit tests where appropriate.

End of instructions. Ask maintainers when privileged operations (DB migrations, secrets, deploy updates) are required.
