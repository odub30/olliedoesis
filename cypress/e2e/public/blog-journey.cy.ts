// cypress/e2e/public/blog-journey.cy.ts
/**
 * E2E Test: Blog User Journey
 *
 * Tests the complete user flow:
 * Homepage → Blog List → Blog Post → Related Post → Tag Archive
 */

describe('Blog User Journey', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full blog discovery journey', () => {
    // Step 1: Navigate from homepage to blog list
    cy.contains('Blog').click();
    cy.url().should('include', '/blogs');
    cy.contains('Blog').should('be.visible');

    // Step 2: Verify blog list loads
    cy.get('[data-testid="blog-card"]').should('have.length.greaterThan', 0);

    // Step 3: Click on a blog post
    cy.get('[data-testid="blog-card"]').first().within(() => {
      cy.get('h2').invoke('text').as('blogTitle');
      cy.get('a').first().click();
    });

    // Step 4: Verify blog post page loaded
    cy.url().should('include', '/blogs/');
    cy.get('@blogTitle').then((title) => {
      cy.contains(title as string).should('be.visible');
    });

    // Step 5: Verify blog post content
    cy.get('article').should('exist');
    cy.get('[data-testid="blog-author"]').should('be.visible');
    cy.get('[data-testid="blog-date"]').should('be.visible');
    cy.get('[data-testid="blog-content"]').should('exist');

    // Step 6: Click on a tag
    cy.get('[data-testid="blog-tags"]').within(() => {
      cy.get('a').first().click();
    });

    // Step 7: Verify tag archive page
    cy.url().should('include', '/tags/');
    cy.contains('Blog Posts').should('be.visible');
    cy.get('[data-testid="blog-card"]').should('have.length.greaterThan', 0);

    // Step 8: Navigate back and check related posts
    cy.go('back');
    cy.get('[data-testid="related-posts"]').should('exist');
    cy.get('[data-testid="related-posts"]').within(() => {
      cy.get('[data-testid="blog-card"]').should('have.length.greaterThan', 0);
      cy.get('[data-testid="blog-card"]').first().click();
    });

    // Step 9: Verify related post loaded
    cy.url().should('include', '/blogs/');
  });

  it('should allow searching for blog posts', () => {
    cy.visit('/blogs');

    // Use search functionality
    cy.get('[data-testid="search-input"]').type('test');
    cy.get('[data-testid="blog-card"]').should('exist');

    // Clear search
    cy.get('[data-testid="search-input"]').clear();
  });

  it('should filter blogs by tag', () => {
    cy.visit('/blogs');

    // Open tag filter
    cy.get('[data-testid="tag-filter"]').click();
    cy.get('[data-testid="tag-option"]').first().click();

    // Verify filtered results
    cy.get('[data-testid="blog-card"]').should('exist');
  });

  it('should handle blog not found', () => {
    cy.visit('/blogs/non-existent-post', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
  });
});
