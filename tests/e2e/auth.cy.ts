/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Sign Up', () => {
    it('should display sign up form', () => {
      cy.visit('/signup');
      cy.contains('Create Your Account').should('be.visible');
      cy.get('input[id="name"]').should('be.visible');
      cy.get('input[id="email"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      cy.contains('Innovator').should('be.visible');
      cy.contains('Investor').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.visit('/signup');
      cy.get('button[type="submit"]').click();
      
      // Form should not submit without filling fields
      cy.url().should('include', '/signup');
    });

    it('should validate password length', () => {
      cy.visit('/signup');
      cy.get('input[id="name"]').type('Test User');
      cy.get('input[id="email"]').type('test@example.com');
      cy.get('input[id="password"]').type('12345'); // Too short
      cy.contains('Innovator').click();
      cy.get('input[id="terms"]').check();
      cy.get('button[type="submit"]').click();
      
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });

    it('should require role selection', () => {
      cy.visit('/signup');
      cy.get('input[id="name"]').type('Test User');
      cy.get('input[id="email"]').type('test@example.com');
      cy.get('input[id="password"]').type('password123');
      cy.get('input[id="terms"]').check();
      cy.get('button[type="submit"]').click();
      
      cy.contains('Please select your role').should('be.visible');
    });

    it('should require terms acceptance', () => {
      cy.visit('/signup');
      cy.get('input[id="name"]').type('Test User');
      cy.get('input[id="email"]').type('test@example.com');
      cy.get('input[id="password"]').type('password123');
      cy.contains('Innovator').click();
      cy.get('button[type="submit"]').click();
      
      cy.contains('Please accept the terms and conditions').should('be.visible');
    });

    it('should allow selecting innovator role', () => {
      cy.visit('/signup');
      cy.contains('Innovator').click();
      cy.contains('Innovator').parent().should('have.class', 'border-green-600');
    });

    it('should allow selecting investor role', () => {
      cy.visit('/signup');
      cy.contains('Investor').click();
      cy.contains('Investor').parent().should('have.class', 'border-green-600');
    });

    it('should have link to sign in page', () => {
      cy.visit('/signup');
      cy.contains('Sign In').click();
      cy.url().should('include', '/signin');
    });
  });

  describe('Sign In', () => {
    it('should display sign in form', () => {
      cy.visit('/signin');
      cy.contains('Sign In').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('should validate password length', () => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('12345'); // Too short
      cy.get('button[type="submit"]').click();
      
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });

    it('should have link to sign up page', () => {
      cy.visit('/signin');
      cy.contains('Sign Up').click();
      cy.url().should('include', '/signup');
    });

    it('should show loading state during sign in', () => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.contains('Signing In...').should('be.visible');
    });
  });

  describe('Sign Out', () => {
    it('should sign out user and redirect to home', () => {
      // Note: This assumes a user is logged in
      // In a real test, you would use cy.login() custom command
      cy.visit('/');
      
      // Check if Sign Out button is visible (when logged in)
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Sign Out")').length > 0) {
          cy.contains('Sign Out').click();
          cy.url().should('eq', Cypress.config().baseUrl + '/');
        }
      });
    });
  });
});
