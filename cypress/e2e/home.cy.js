describe('Homepage', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Welcome'); // Adjust the text to something on your homepage
  });
});