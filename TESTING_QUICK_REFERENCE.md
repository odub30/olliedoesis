# Testing Quick Reference Card

## 🚀 Commands

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode (development)
npm run test:coverage     # With coverage report
npm run test:ci           # CI mode (GitHub Actions)
npm run test:e2e          # Cypress E2E tests
npm run test:e2e:headed   # Cypress with UI
```

## 📝 Test Structure

```typescript
describe('Component/Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, setup common data
  });

  // Teardown
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Group related tests
  describe('Specific Feature', () => {
    it('should do something specific', () => {
      // Arrange - Set up test data
      // Act - Execute the functionality
      // Assert - Verify results
    });
  });
});
```

## 🧪 Common Patterns

### Component Test
```typescript
import { render, screen } from '@/__tests__/utils/test-utils';

it('renders correctly', () => {
  render(<MyComponent prop="value" />);
  expect(screen.getByText('Expected')).toBeInTheDocument();
});
```

### User Interaction
```typescript
import { setupUser } from '@/__tests__/utils/test-utils';

it('handles click', async () => {
  const user = setupUser();
  const onClick = jest.fn();

  render(<Button onClick={onClick}>Click</Button>);
  await user.click(screen.getByText('Click'));

  expect(onClick).toHaveBeenCalled();
});
```

### API Test
```typescript
import { prismaMock, createMockBlog } from '@/__tests__/utils/prisma-mock';

it('fetches blogs', async () => {
  prismaMock.blog.findMany.mockResolvedValue([createMockBlog()]);

  const { GET } = await import('@/app/api/blogs/route');
  const response = await GET(request);

  expect(response.status).toBe(200);
});
```

### E2E Test
```typescript
it('completes user journey', () => {
  cy.visit('/');
  cy.contains('Link Text').click();
  cy.url().should('include', '/expected-path');
  cy.get('[data-testid="element"]').should('be.visible');
});
```

## 🛠️ Utilities Cheatsheet

### Rendering
```typescript
render(<Component />)                    // Basic render
render(<Component />, { wrapper: Wrapper }) // With provider

screen.getByText('text')                // Find by text
screen.getByRole('button')              // Find by role
screen.getByTestId('my-element')        // Find by test ID
screen.queryByText('text')              // Returns null if not found
screen.findByText('text')               // Async find

await waitFor(() => {                   // Wait for condition
  expect(screen.getByText('Done')).toBeInTheDocument();
});
```

### User Events
```typescript
const user = setupUser();

await user.click(element)               // Click
await user.dblClick(element)            // Double click
await user.type(input, 'text')          // Type text
await user.clear(input)                 // Clear input
await user.selectOptions(select, 'opt') // Select option
await user.upload(fileInput, file)      // Upload file
await user.keyboard('{Enter}')          // Keyboard
await user.hover(element)               // Hover
```

### Matchers
```typescript
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveTextContent('text')
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('className')
expect(element).toBeDisabled()
expect(element).toHaveFocus()
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toHaveBeenCalledTimes(2)
```

### Mock Data
```typescript
createMockBlog()                        // Single blog
createMockBlogs(5)                      // 5 blogs
createMockBlog({ title: 'Custom' })     // With overrides

createMockUser()                        // User
createMockAdminUser()                   // Admin
createMockTag()                         // Tag
createMockCategory()                    // Category
```

### Prisma Mocks
```typescript
prismaMock.blog.findUnique.mockResolvedValue(blog)
prismaMock.blog.findMany.mockResolvedValue([blog1, blog2])
prismaMock.blog.create.mockResolvedValue(newBlog)
prismaMock.blog.update.mockResolvedValue(updatedBlog)
prismaMock.blog.delete.mockResolvedValue(deletedBlog)
prismaMock.blog.findMany.mockRejectedValue(error)
```

### Other Utilities
```typescript
mockMatchMedia(true)                    // Mock responsive
mockIntersectionObserver()              // Mock lazy load
mockNextRouter({ pathname: '/' })       // Mock router
createMockSession()                     // Mock auth
mockFetch(response)                     // Mock fetch
testA11y(container)                     // Test accessibility
```

## 📊 Coverage Commands

```bash
npm run test:coverage                   # Generate coverage
open coverage/lcov-report/index.html    # View report
```

## 🐛 Debugging

```bash
npm test -- myfile.test.tsx             # Run specific file
npm test -- --testNamePattern="pattern" # Run matching tests
npm test -- --watch                     # Watch mode
```

```typescript
// In test:
screen.debug()                          // Print DOM
console.log(screen.logTestingPlaygroundURL()) // Testing Playground

// Cypress:
cy.pause()                              // Pause execution
cy.debug()                              // Debug
```

## 🔧 Test IDs

Add to components for stable selectors:
```tsx
<button data-testid="submit-button">Submit</button>
<div data-testid="blog-card">...</div>
<input data-testid="search-input" />
```

Then use:
```typescript
screen.getByTestId('submit-button')
cy.get('[data-testid="submit-button"]')
```

## 📝 Common Test Cases

### Component
- ✅ Renders correctly
- ✅ Props work
- ✅ User interactions
- ✅ Edge cases (empty, loading, error)
- ✅ Accessibility
- ✅ Responsive

### API Route
- ✅ Success (200)
- ✅ Not found (404)
- ✅ Unauthorized (401)
- ✅ Validation error (400)
- ✅ Server error (500)
- ✅ Authorization checks

### E2E
- ✅ Happy path
- ✅ Form validation
- ✅ Navigation
- ✅ Error states
- ✅ Mobile responsive

## 🎯 Coverage Targets

- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

## 📚 Documentation

- `TESTING_STRATEGY.md` - Overall strategy
- `TESTING_GUIDE.md` - Detailed guide
- `TESTING_IMPLEMENTATION_SUMMARY.md` - What was built
- Example tests in `src/__tests__/`

---

**Pro Tip**: Keep this file open while writing tests! 🚀
