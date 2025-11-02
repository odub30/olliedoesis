// cypress/e2e/public/gallery-journey.cy.ts
/**
 * E2E Test: Gallery User Journey
 *
 * Tests the complete gallery flow:
 * Homepage → Gallery → Image Click → Lightbox → Tags
 */

describe('Gallery User Journey', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should browse gallery and view images in lightbox', () => {
    // Navigate to gallery
    cy.contains('Gallery').click();
    cy.url().should('include', '/gallery');

    // Verify gallery loaded
    cy.get('[data-testid="gallery-grid"]').should('exist');
    cy.get('[data-testid="gallery-image"]').should('have.length.greaterThan', 0);

    // Click on first image
    cy.get('[data-testid="gallery-image"]').first().click();

    // Verify lightbox opened
    cy.get('[data-testid="lightbox"]').should('be.visible');
    cy.get('[data-testid="lightbox-image"]').should('be.visible');

    // Navigate to next image
    cy.get('[data-testid="lightbox-next"]').click();
    cy.get('[data-testid="lightbox-image"]').should('be.visible');

    // Navigate to previous image
    cy.get('[data-testid="lightbox-prev"]').click();

    // Close lightbox
    cy.get('[data-testid="lightbox-close"]').click();
    cy.get('[data-testid="lightbox"]').should('not.exist');
  });

  it('should filter gallery by tags', () => {
    cy.visit('/gallery');

    // Click on a tag filter
    cy.get('[data-testid="tag-filter-button"]').first().click();

    // Verify filtered results
    cy.get('[data-testid="gallery-image"]').should('exist');
    cy.get('[data-testid="active-filter"]').should('be.visible');

    // Clear filter
    cy.get('[data-testid="clear-filter"]').click();
  });

  it('should support keyboard navigation in lightbox', () => {
    cy.visit('/gallery');

    cy.get('[data-testid="gallery-image"]').first().click();
    cy.get('[data-testid="lightbox"]').should('be.visible');

    // Use arrow keys
    cy.get('body').type('{rightarrow}');
    cy.wait(300);
    cy.get('body').type('{leftarrow}');

    // Close with Escape
    cy.get('body').type('{esc}');
    cy.get('[data-testid="lightbox"]').should('not.exist');
  });

  it('should navigate from gallery tag to tag archive page', () => {
    cy.visit('/gallery');

    // Click image to open lightbox
    cy.get('[data-testid="gallery-image"]').first().click();

    // Click tag in lightbox
    cy.get('[data-testid="image-tag"]').first().click();

    // Verify tag archive page
    cy.url().should('include', '/tags/');
    cy.contains('Media').should('be.visible');
  });

  it('should toggle grid size', () => {
    cy.visit('/gallery');

    // Initial grid state
    cy.get('[data-testid="gallery-grid"]').should('have.class', 'grid-cols-3');

    // Toggle to 2 columns
    cy.get('[data-testid="grid-size-2"]').click();
    cy.get('[data-testid="gallery-grid"]').should('have.class', 'grid-cols-2');

    // Toggle back to 3 columns
    cy.get('[data-testid="grid-size-3"]').click();
    cy.get('[data-testid="gallery-grid"]').should('have.class', 'grid-cols-3');
  });

  it('should load more images with infinite scroll', () => {
    cy.visit('/gallery');

    // Get initial image count
    cy.get('[data-testid="gallery-image"]').its('length').as('initialCount');

    // Scroll to bottom
    cy.scrollTo('bottom');
    cy.wait(500);

    // Verify more images loaded
    cy.get('@initialCount').then((initialCount) => {
      cy.get('[data-testid="gallery-image"]').should('have.length.greaterThan', initialCount as number);
    });
  });
});
