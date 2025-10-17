<!-- Simple PR template for maintainers and contributors -->

# Pull Request

Summary of changes:

- What changed and why (1-3 sentences)

Checklist (maintainers & contributors):

- [ ] Ran `npm run type-check` and `npm run lint` locally
- [ ] Added/updated tests for new logic (Jest) where appropriate
- [ ] If API changes, updated any relevant `src/app/api/*/route.ts` docs or examples
- [ ] If DB changes, documented migration steps and updated `prisma/schema.prisma`
- [ ] Added a short note to `docs/` if developer workflow changed

Review notes for AI agents:

- Keep changes small and focused. For code generation tasks, include unit tests and update this PR with the test results.
