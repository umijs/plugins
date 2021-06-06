/// <reference types="cypress" />

describe('examples', () => {
  it('home', () => {
    cy.visit('http://localhost:8000/');
    cy.get('#root .ant-pro-basicLayout-content').should('have.text', 'Home');
  });

  it('plugin-model', () => {
    cy.visit('http://localhost:8000/plugin-model');
    cy.get('[data-cy=model-add-btn]').click();
    cy.get('[data-cy=model-add-btn]').click();
    cy.get('[data-cy=model-add-btn]').click();

    cy.get('[data-cy=model-count]').should('contain.text', '3');

    // page initial-state
    cy.get('[data-cy=go-to-plugin-initial-state]').click();
    cy.get('[data-cy=another-model-count]').should('contain.text', '999');
    cy.get('[data-cy=go-back-plugin-model]').click();
    cy.get('[data-cy=model-count]').should('contain.text', '999');
  });

  it('plugin-locale', () => {
    cy.visit('http://localhost:8000/plugin-locale');

    cy.get('[data-cy=link-en-US]').click();
    cy.get('[data-cy=locale-text]').should('contain.text', 'Hi');

    cy.get('[data-cy=link-zh-CN]').click();
    cy.get('[data-cy=locale-text]').should('contain.text', '你好');

    cy.get('[data-cy=link-zh-TW]').click();
    cy.get('[data-cy=locale-text]').should('contain.text', '妳好');
  });

  it('plugin-request', () => {
    cy.visit('http://localhost:8000/request/?delay=200');

    cy.intercept('/api/user', {
      success: true,
      data: { name: 'ycjcl868' },
      result: { name: 'name in result' },
      name: 'name outside',
    }).as('getUser');

    cy.waitUntil(() =>
      cy.get('[data-cy=data-text]').should('have.text', 'ycjcl868'),
    );
  });

  it('plugin-request', () => {
    cy.visit('http://localhost:8000/request/?delay=200');

    cy.intercept('/api/user', {
      success: true,
      data: { name: 'ycjcl868' },
      result: { name: 'name in result' },
      name: 'name outside',
    }).as('getUser');

    cy.waitUntil(() =>
      cy.get('[data-cy=data-text]').should('have.text', 'ycjcl868'),
    );
  });

  it('plugin-access', () => {
    cy.visit('http://localhost:8000/plugin-no-access');
    cy.get('[data-cy=no-access-text]').should('have.text', 'no access');

    cy.visit('http://localhost:8000/plugin-access');
    cy.get('[data-cy=access-text]').should(
      'have.text',
      'you can read the article',
    );
  });
});
