describe('Login Flow', () => {
  it('allows a user to log in', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Welcome, test@example.com');
  });
});