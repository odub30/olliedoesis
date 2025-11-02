// cypress/e2e/admin/blog-management.cy.ts
/**
 * E2E Test: Admin Blog Management
 *
 * Tests admin workflows:
 * Login → Create Blog → Edit Blog → Publish → Delete
 */

describe('Admin Blog Management', () => {
  beforeEach(() => {
    // Login as admin
    cy.session('admin', () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('admin@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('include', '/admin');
    });

    cy.visit('/admin/blogs');
  });

  it('should create a new blog post', () => {
    // Click create new blog
    cy.get('[data-testid="create-blog-button"]').click();
    cy.url().should('include', '/admin/blogs/new');

    // Fill in blog form
    cy.get('[data-testid="blog-title-input"]').type('Test Blog Post');
    cy.get('[data-testid="blog-slug-input"]').should('have.value', 'test-blog-post');

    // Add excerpt
    cy.get('[data-testid="blog-excerpt-input"]').type('This is a test blog post excerpt');

    // Add content
    cy.get('[data-testid="blog-content-editor"]').type('# Test Blog\n\nThis is the content.');

    // Add tags
    cy.get('[data-testid="tag-selector"]').click();
    cy.get('[data-testid="tag-option"]').contains('React').click();
    cy.get('[data-testid="tag-option"]').contains('Next.js').click();

    // Select category
    cy.get('[data-testid="category-select"]').click();
    cy.get('[data-testid="category-option"]').contains('Technology').click();

    // Save as draft
    cy.get('[data-testid="save-draft-button"]').click();

    // Verify success message
    cy.get('[data-testid="success-toast"]').should('contain', 'Blog saved as draft');

    // Verify redirected to blog list
    cy.url().should('include', '/admin/blogs');
  });

  it('should edit existing blog post', () => {
    // Click edit on first blog
    cy.get('[data-testid="blog-row"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    cy.url().should('include', '/admin/blogs/');
    cy.url().should('include', '/edit');

    // Update title
    cy.get('[data-testid="blog-title-input"]').clear().type('Updated Blog Title');

    // Update content
    cy.get('[data-testid="blog-content-editor"]').type('\n\n## New Section');

    // Save changes
    cy.get('[data-testid="save-button"]').click();

    // Verify success
    cy.get('[data-testid="success-toast"]').should('contain', 'Blog updated successfully');
  });

  it('should publish a draft blog', () => {
    // Find draft blog
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="status-option"]').contains('Draft').click();

    // Edit first draft
    cy.get('[data-testid="blog-row"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    // Toggle publish switch
    cy.get('[data-testid="publish-switch"]').click();

    // Set publish date
    cy.get('[data-testid="publish-date-input"]').should('exist');

    // Save and publish
    cy.get('[data-testid="save-button"]').click();

    // Verify published
    cy.get('[data-testid="success-toast"]').should('contain', 'Blog published');
  });

  it('should delete a blog post', () => {
    // Get initial count
    cy.get('[data-testid="blog-row"]').its('length').as('initialCount');

    // Click delete on first blog
    cy.get('[data-testid="blog-row"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });

    // Confirm deletion
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.get('[data-testid="confirm-delete-button"]').click();

    // Verify blog removed
    cy.get('@initialCount').then((initialCount) => {
      cy.get('[data-testid="blog-row"]').should('have.length', (initialCount as number) - 1);
    });

    // Verify success message
    cy.get('[data-testid="success-toast"]').should('contain', 'Blog deleted');
  });

  it('should preview blog before publishing', () => {
    cy.get('[data-testid="blog-row"]').first().within(() => {
      cy.get('[data-testid="preview-button"]').click();
    });

    // Verify preview opens in new tab/window
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('@windowOpen').should('be.called');
  });

  it('should bulk delete blogs', () => {
    // Select multiple blogs
    cy.get('[data-testid="blog-checkbox"]').eq(0).check();
    cy.get('[data-testid="blog-checkbox"]').eq(1).check();
    cy.get('[data-testid="blog-checkbox"]').eq(2).check();

    // Click bulk delete
    cy.get('[data-testid="bulk-delete-button"]').click();

    // Confirm
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.contains('3 blogs').should('be.visible');
    cy.get('[data-testid="confirm-delete-button"]').click();

    // Verify deletion
    cy.get('[data-testid="success-toast"]').should('contain', '3 blogs deleted');
  });

  it('should handle validation errors', () => {
    cy.get('[data-testid="create-blog-button"]').click();

    // Try to save without required fields
    cy.get('[data-testid="save-button"]').click();

    // Verify validation errors
    cy.get('[data-testid="title-error"]').should('contain', 'Title is required');
    cy.get('[data-testid="content-error"]').should('contain', 'Content is required');
  });
});
