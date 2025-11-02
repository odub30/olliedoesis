# Testing Guide - olliedoesis.dev

## 🚀 Quick Start

```bash
# Run all unit tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode (see the browser)
npm run test:e2e:headed

# Run all tests (CI mode)
npm run test:ci
```

---

## 📁 Test File Organization

```
olliedoesis/
├── src/
│   ├── __tests__/                 # Test utilities and integration tests
│   │   ├── utils/
│   │   │   ├── test-utils.tsx     # Custom render & helpers
│   │   │   └── prisma-mock.ts     # Database mocking
│   │   ├── fixtures/
│   │   │   └── mockData.ts        # Test data factories
│   │   ├── unit/
│   │   │   ├── lib/               # Utility function tests
│   │   │   ├── components/        # Shared component tests
│   │   │   └── hooks/             # Custom hook tests
│   │   └── integration/
│   │       ├── api/               # API route tests
│   │       └── database/          # Database operation tests
│   │
│   └── components/
│       └── ui/
│           ├── button.tsx
│           └── button.test.tsx    # Co-located component tests
│
├── cypress/
│   ├── e2e/
│   │   ├── public/                # Public user journeys
│   │   ├── admin/                 # Admin workflows
│   │   └── auth/                  # Authentication flows
│   ├── fixtures/                  # Test data files
│   └── support/                   # Custom commands
│
└── coverage/                      # Generated coverage reports
    ├── lcov-report/               # HTML coverage report
    └── coverage-summary.json      # JSON summary
```

---

## 🧪 Writing Tests

### Unit Tests (Components)

```typescript
// src/components/ui/button.test.tsx
import { render, screen, setupUser } from '@/__tests__/utils/test-utils';
import { Button } from './button';

describe('Button Component', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const user = setupUser();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', async () => {
    const { container } = render(<Button>Click me</Button>);
    await testA11y(container);
  });
});
```

### Unit Tests (Utilities)

```typescript
// src/__tests__/unit/lib/utils.test.ts
import { formatDate, slugify } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      expect(formatDate(date)).toBe('January 15, 2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('Invalid date');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('React & Next.js')).toBe('react-nextjs');
    });
  });
});
```

### Integration Tests (API Routes)

```typescript
// src/__tests__/integration/api/blogs.test.ts
import { prismaMock, createMockBlog } from '@/__tests__/utils/prisma-mock';
import { NextRequest } from 'next/server';

describe('GET /api/admin/blogs', () => {
  it('should return all blogs', async () => {
    const mockBlogs = [createMockBlog(), createMockBlog()];
    prismaMock.blog.findMany.mockResolvedValue(mockBlogs);

    const { GET } = await import('@/app/api/admin/blogs/route');
    const request = new NextRequest('http://localhost/api/admin/blogs');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.blogs).toHaveLength(2);
  });
});
```

### E2E Tests (Cypress)

```typescript
// cypress/e2e/public/blog-journey.cy.ts
describe('Blog User Journey', () => {
  it('should navigate from homepage to blog post', () => {
    cy.visit('/');
    cy.contains('Blog').click();
    cy.url().should('include', '/blogs');

    cy.get('[data-testid="blog-card"]').first().click();
    cy.url().should('include', '/blogs/');

    cy.get('article').should('exist');
  });
});
```

---

## 🛠️ Testing Utilities

### Custom Render

Use our custom render function that includes necessary providers:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils';

render(<MyComponent />);
```

### User Interactions

Simulate realistic user interactions:

```typescript
import { setupUser } from '@/__tests__/utils/test-utils';

const user = setupUser();
await user.click(button);
await user.type(input, 'Hello');
await user.keyboard('{Enter}');
```

### Mock Data Factories

Create consistent test data:

```typescript
import {
  createMockBlog,
  createMockBlogs,
  createMockUser,
} from '@/__tests__/fixtures/mockData';

const blog = createMockBlog({ title: 'Custom Title' });
const blogs = createMockBlogs(5); // Creates 5 blogs
const user = createMockUser({ role: 'admin' });
```

### Database Mocking

Mock Prisma operations:

```typescript
import {
  prismaMock,
  mockPrismaResponses,
} from '@/__tests__/utils/prisma-mock';

// Mock a database query
prismaMock.blog.findUnique.mockResolvedValue(
  mockPrismaResponses.blog()
);

// Mock multiple records
prismaMock.blog.findMany.mockResolvedValue([
  mockPrismaResponses.blog(),
  mockPrismaResponses.blog({ title: 'Another Post' }),
]);

// Mock errors
prismaMock.blog.create.mockRejectedValue(new Error('Constraint failed'));
```

### Accessibility Testing

Test for accessibility violations:

```typescript
import { testA11y } from '@/__tests__/utils/test-utils';

it('should be accessible', async () => {
  const { container } = render(<MyComponent />);
  await testA11y(container);
});
```

---

## 📊 Coverage Reports

### View Coverage Locally

```bash
# Run tests with coverage
npm run test:coverage

# Open HTML report in browser
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
xdg-open coverage/lcov-report/index.html # Linux
```

### Coverage Thresholds

We maintain enterprise-level coverage targets:

| Metric | Threshold |
|--------|-----------|
| Statements | >80% |
| Branches | >75% |
| Functions | >80% |
| Lines | >80% |

Tests will fail if coverage drops below these thresholds.

---

## 🔧 Common Testing Patterns

### Testing Async Components

```typescript
it('should load data asynchronously', async () => {
  render(<AsyncComponent />);

  // Wait for loading to finish
  await waitForLoadingToFinish();

  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

### Testing Forms

```typescript
it('should submit form with validation', async () => {
  const user = setupUser();
  const onSubmit = jest.fn();

  render(<MyForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByText('Submit'));

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  });
});
```

### Testing Error States

```typescript
it('should display error message on failure', async () => {
  // Mock API error
  mockFetch({ error: 'Failed to load' }, { ok: false, status: 500 });

  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
```

### Testing Responsive Behavior

```typescript
it('should adapt to mobile viewport', () => {
  mockMatchMedia(true); // Mobile viewport

  render(<ResponsiveComponent />);

  expect(screen.getByTestId('mobile-menu')).toBeVisible();
  expect(screen.queryByTestId('desktop-menu')).not.toBeInTheDocument();
});
```

---

## 🐛 Debugging Tests

### Run Specific Test File

```bash
npm test -- button.test.tsx
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="should handle click"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "${file}"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Cypress Debug

```bash
# Open Cypress in headed mode
npm run test:e2e:headed

# Add debugger in test
it('test name', () => {
  cy.get('button').click();
  cy.pause(); // Pauses execution
});
```

---

## ✅ Testing Checklist

Before pushing code, ensure:

- [ ] All new features have tests
- [ ] Test coverage is >80%
- [ ] All tests pass locally
- [ ] No console errors in tests
- [ ] Accessibility tests pass
- [ ] E2E critical paths tested
- [ ] Edge cases covered
- [ ] Error handling tested

---

## 📚 Best Practices

### DO ✅

- **Write tests first** (TDD approach)
- **Test behavior, not implementation**
- **Use meaningful test descriptions**
- **Mock external dependencies**
- **Test edge cases and errors**
- **Keep tests independent**
- **Use data-testid for stable selectors**

### DON'T ❌

- **Don't test implementation details**
- **Don't copy-paste test code**
- **Don't skip cleanup**
- **Don't use fragile selectors (text, nth-child)**
- **Don't mock everything**
- **Don't write flaky tests**

---

## 🚨 Troubleshooting

### Tests Pass Locally but Fail in CI

- Check environment variables
- Verify Node.js version matches
- Ensure database is properly seeded
- Check for timezone issues
- Review CI logs carefully

### Flaky Tests

- Add proper wait conditions
- Avoid hardcoded timeouts
- Check for race conditions
- Ensure proper test isolation
- Mock time-dependent functions

### Slow Tests

- Use `jest.mock()` for expensive operations
- Run tests in parallel
- Optimize database queries
- Use shallow rendering when possible
- Profile with `--verbose`

---

## 📞 Getting Help

- **Documentation**: See `TESTING_STRATEGY.md` for overall strategy
- **Examples**: Check existing tests in `src/__tests__/`
- **CI/CD**: See `.github/workflows/test.yml`
- **Issues**: Report testing problems in GitHub Issues

---

**Last Updated**: January 2025
**Maintained By**: Engineering Team
