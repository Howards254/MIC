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
       * Custom command to log in a user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to create a test user
       * @example cy.createUser('test@example.com', 'password123', 'innovator')
       */
      createUser(email: string, password: string, role: string): Chainable<void>;
      
      /**
       * Custom command to seed the database with test data
       * @example cy.seedDatabase()
       */
      seedDatabase(): Chainable<void>;
    }
  }
}

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/signin');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to create a user
Cypress.Commands.add('createUser', (email: string, password: string, role: string) => {
  cy.visit('/signup');
  cy.get('input[id="name"]').type('Test User');
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);
  cy.contains(role === 'innovator' ? 'Innovator' : 'Investor').click();
  cy.get('input[id="terms"]').check();
  cy.get('button[type="submit"]').click();
});

// Custom command to seed database
Cypress.Commands.add('seedDatabase', () => {
  // This would typically call your backend API to seed test data
  cy.log('Seeding database with test data');
});

export {};
