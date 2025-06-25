/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with username and password
       * @example cy.login('testuser', 'password123')
       */
      login(username: string, password: string): Chainable<void>;

      /**
       * Custom command to mock successful login API response
       * @example cy.mockSuccessfulLogin()
       */
      mockSuccessfulLogin(): Chainable<void>;

      /**
       * Custom command to mock failed login API response
       * @example cy.mockFailedLogin('Invalid credentials')
       */
      mockFailedLogin(errorMessage?: string): Chainable<void>;

      /**
       * Custom command to fill login form without submitting
       * @example cy.fillLoginForm('testuser', 'password123')
       */
      fillLoginForm(username: string, password: string): Chainable<void>;

      /**
       * Custom command to check if user is logged in
       * @example cy.shouldBeLoggedIn()
       */
      shouldBeLoggedIn(): Chainable<void>;

      /**
       * Custom command to check if user is logged out
       * @example cy.shouldBeLoggedOut()
       */
      shouldBeLoggedOut(): Chainable<void>;
    }
  }
}

// Custom command to login
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.mockSuccessfulLogin();
  cy.visit('/login');
  cy.fillLoginForm(username, password);
  cy.get('[data-cy="login-button"]').click();
  cy.wait('@loginRequest');
  cy.url().should('include', '/products');
});

// Custom command to mock successful login
Cypress.Commands.add('mockSuccessfulLogin', () => {
  cy.intercept('POST', '**/auth/login', {
    statusCode: 200,
    body: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      gender: 'male',
      image: 'https://example.com/avatar.jpg',
      token: 'mock-jwt-token',
    },
  }).as('loginRequest');
});

// Custom command to mock failed login
Cypress.Commands.add(
  'mockFailedLogin',
  (errorMessage: string = 'Invalid credentials') => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        message: errorMessage,
      },
    }).as('loginRequest');
  }
);

// Custom command to fill login form
Cypress.Commands.add('fillLoginForm', (username: string, password: string) => {
  cy.get('#username').clear().type(username);
  cy.get('#password').clear().type(password);
});

// Custom command to check if logged in
Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.window()
    .its('localStorage')
    .invoke('getItem', 'accessToken')
    .should('exist');

  cy.window()
    .its('localStorage')
    .invoke('getItem', 'currentUser')
    .should('exist');
});

// Custom command to check if logged out
Cypress.Commands.add('shouldBeLoggedOut', () => {
  cy.window()
    .its('localStorage')
    .invoke('getItem', 'accessToken')
    .should('not.exist');

  cy.window()
    .its('localStorage')
    .invoke('getItem', 'currentUser')
    .should('not.exist');
});

export {};
