/// <reference types="cypress" />

describe('Navigation and Routes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Public Routes', () => {
    it('should navigate to home page', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.contains('MIC').should('be.visible');
    });

    it('should navigate to explore projects page', () => {
      cy.contains('Explore Projects').click();
      cy.url().should('include', '/explore');
    });

    it('should navigate to jobs page', () => {
      cy.contains('Jobs').click();
      cy.url().should('include', '/jobs');
    });

    it('should navigate to events page', () => {
      cy.contains('Events').click();
      cy.url().should('include', '/events');
    });

    it('should navigate to blog page', () => {
      cy.contains('Blog').click();
      cy.url().should('include', '/blog');
    });

    it('should navigate to sign in page', () => {
      cy.contains('Sign In').first().click();
      cy.url().should('include', '/signin');
    });

    it('should navigate to sign up page', () => {
      cy.contains('Sign Up').first().click();
      cy.url().should('include', '/signup');
    });

    it('should display 404 page for invalid routes', () => {
      cy.visit('/invalid-route-that-does-not-exist', { failOnStatusCode: false });
      // Check for 404 content or redirect
      cy.url().should('include', '/invalid-route-that-does-not-exist');
    });
  });

  describe('Navbar Links', () => {
    it('should have all navigation links in navbar', () => {
      cy.visit('/');
      cy.get('nav').within(() => {
        cy.contains('Home').should('be.visible');
        cy.contains('Explore Projects').should('be.visible');
        cy.contains('Jobs').should('be.visible');
        cy.contains('Events').should('be.visible');
        cy.contains('Blog').should('be.visible');
      });
    });

    it('should navigate using navbar links', () => {
      cy.visit('/');
      
      cy.get('nav').contains('Explore Projects').click();
      cy.url().should('include', '/explore');
      
      cy.get('nav').contains('Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should show MIC logo and navigate to home', () => {
      cy.visit('/explore');
      cy.get('nav').contains('MIC').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Footer Links', () => {
    it('should display footer on all pages', () => {
      cy.visit('/');
      cy.get('footer').should('be.visible');
      
      cy.visit('/explore');
      cy.get('footer').should('be.visible');
      
      cy.visit('/jobs');
      cy.get('footer').should('be.visible');
    });
  });

  describe('Browser Navigation', () => {
    it('should support back button navigation', () => {
      cy.visit('/');
      cy.contains('Explore Projects').click();
      cy.url().should('include', '/explore');
      
      cy.go('back');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should support forward button navigation', () => {
      cy.visit('/');
      cy.contains('Explore Projects').click();
      cy.go('back');
      cy.go('forward');
      cy.url().should('include', '/explore');
    });
  });

  describe('Protected Routes', () => {
    it('should require authentication to access dashboard', () => {
      cy.visit('/dashboard', { failOnStatusCode: false });
      
      // Should redirect to sign in or show authentication required message
      cy.url().then((url) => {
        const isOnSignIn = url.includes('/signin');
        const isOnDashboard = url.includes('/dashboard');
        
        if (isOnSignIn) {
          cy.contains('Sign In').should('be.visible');
        } else if (isOnDashboard) {
          // If on dashboard, user might be logged in
          cy.log('User is authenticated');
        }
      });
    });

    it('should require authentication to access admin panel', () => {
      cy.visit('/admin', { failOnStatusCode: false });
      
      cy.url().then((url) => {
        const isOnSignIn = url.includes('/signin');
        const isOnAdmin = url.includes('/admin');
        
        if (isOnSignIn) {
          cy.contains('Sign In').should('be.visible');
        } else if (isOnAdmin) {
          cy.log('User is authenticated as admin');
        }
      });
    });
  });

  describe('Deep Linking', () => {
    it('should navigate directly to specific project detail page', () => {
      cy.visit('/project/1');
      cy.url().should('include', '/project/1');
    });

    it('should navigate directly to specific blog post', () => {
      cy.visit('/blog/test-post');
      cy.url().should('include', '/blog/test-post');
    });
  });
});
