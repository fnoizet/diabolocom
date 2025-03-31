describe('Test Notification Widget', () => {
  it('shows multipe widgets', () => {
    cy.visit('/')
    cy.contains('h2', 'app');
    cy.contains('h2', 'phone');
    cy.contains('h2', 'message');
  })

  it('Notifications are synchronized across multiple widgets', () => {
    cy.visit('/')
    cy.get('[data-cy="phone1"] .p-badge').invoke('text').then((text) => {
      cy.get('[data-cy="phone2"] .p-badge').invoke('text').should('eq',text)
    });

    cy.get('[data-cy="phone1"] [data-cy="add-info"]').click();

    cy.get('[data-cy="phone1"] .p-badge').invoke('text').then((text) => {
      cy.get('[data-cy="phone2"] .p-badge').invoke('text').should('eq',text)
    });
  })

  it('Notifications persist correctly after a page refresh', () => {
    cy.visit('/')
    cy.get('[data-cy="app"] [data-cy="add-success"]').click();
    cy.get('[data-cy="app"] [data-cy="add-info"]').click();
    cy.get('[data-cy="app"] [data-cy="add-error"]').click();

    cy.get('[data-cy="app"] .p-badge').invoke('text').should('eq', '3');

    cy.reload();

    cy.get('[data-cy="app"] .p-badge').invoke('text').should('eq', '3');
  })

  it('The notification badge & list updates correctly on input', () => {
    cy.visit('/')
    cy.get('[data-cy="message"] [data-cy="add-success"]').click();
    cy.get('[data-cy="message"] [data-cy="add-info"]').click();
    cy.get('[data-cy="message"] [data-cy="add-error"]').click();

    cy.get('[data-cy="message"] .p-badge').invoke('text').should('eq', '3');
    cy.get('[data-cy="message"] .notification').should('have.length', 3);
  })
})
