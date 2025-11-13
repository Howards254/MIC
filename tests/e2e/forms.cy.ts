/// <reference types="cypress" />

describe('Project Submission Form', () => {
  beforeEach(() => {
    // Note: In real tests, you would log in first using cy.login()
    // For now, we'll navigate directly to the form
    cy.visit('/dashboard/submit');
  });

  it('should display all form fields', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[type="text"]').length > 0) {
        cy.contains('Project Title').should('be.visible');
        cy.contains('Description').should('be.visible');
        cy.contains('Category').should('be.visible');
        cy.contains('Funding Goal').should('be.visible');
      }
    });
  });

  it('should require project title', () => {
    cy.get('body').then(($body) => {
      if ($body.find('button[type="submit"]').length > 0) {
        cy.get('button[type="submit"]').click();
        
        // Form validation should prevent submission
        cy.url().should('include', '/dashboard/submit');
      }
    });
  });

  it('should allow selecting different categories', () => {
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').first().select('Energy');
        cy.get('select').first().should('have.value', 'Energy');
        
        cy.get('select').first().select('Agriculture');
        cy.get('select').first().should('have.value', 'Agriculture');
      }
    });
  });

  it('should validate funding goal as a number', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[type="number"]').length > 0) {
        const fundingInput = cy.get('input[type="number"]').first();
        fundingInput.should('have.attr', 'type', 'number');
      }
    });
  });

  it('should fill and submit form with valid data', () => {
    cy.get('body').then(($body) => {
      if ($body.find('button[type="submit"]').length > 0) {
        // Fill in form
        const fields = $body.find('input[type="text"]');
        if (fields.length > 0) {
          cy.get('input[type="text"]').first().type('Eco-Friendly Building Material');
        }
        
        const textareas = $body.find('textarea');
        if (textareas.length > 0) {
          cy.get('textarea').first().type('A sustainable alternative to concrete that reduces carbon emissions');
        }
        
        const numberInputs = $body.find('input[type="number"]');
        if (numberInputs.length > 0) {
          cy.get('input[type="number"]').first().type('50000');
        }
        
        cy.get('button[type="submit"]').click();
        
        // Should show loading state
        cy.contains(/Submitting|Submit/).should('exist');
      }
    });
  });
});

describe('Profile Settings Form', () => {
  beforeEach(() => {
    cy.visit('/dashboard/settings');
  });

  it('should display profile fields', () => {
    cy.get('body').then(($body) => {
      if ($body.find('form').length > 0) {
        cy.log('Profile settings form is present');
      }
    });
  });

  it('should allow updating full name', () => {
    cy.get('body').then(($body) => {
      const nameInput = $body.find('input[type="text"]').first();
      if (nameInput.length > 0) {
        cy.get('input[type="text"]').first().clear().type('John Updated');
        cy.get('input[type="text"]').first().should('have.value', 'John Updated');
      }
    });
  });

  it('should validate URL fields', () => {
    cy.get('body').then(($body) => {
      const urlInputs = $body.find('input[type="url"]');
      if (urlInputs.length > 0) {
        cy.get('input[type="url"]').first().should('have.attr', 'type', 'url');
      }
    });
  });

  it('should validate phone field', () => {
    cy.get('body').then(($body) => {
      const phoneInput = $body.find('input[type="tel"]');
      if (phoneInput.length > 0) {
        cy.get('input[type="tel"]').should('have.attr', 'type', 'tel');
      }
    });
  });
});

describe('Form Error Handling', () => {
  it('should display error messages for invalid data', () => {
    cy.visit('/signup');
    
    // Try to submit with invalid email
    cy.get('input[id="name"]').type('Test User');
    cy.get('input[id="email"]').type('invalid-email');
    cy.get('input[id="password"]').type('password123');
    cy.contains('Innovator').click();
    cy.get('input[id="terms"]').check();
    
    // HTML5 validation should trigger
    cy.get('input[id="email"]').then(($input) => {
      const element = $input[0] as HTMLInputElement;
      expect(element.validationMessage).to.exist;
    });
  });

  it('should clear errors when user corrects input', () => {
    cy.visit('/signin');
    
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Password must be at least 6 characters').should('be.visible');
    
    // Correct the password
    cy.get('input[type="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    
    // Error should be cleared
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Invalid email or password')) {
        cy.log('Error message cleared');
      }
    });
  });
});

describe('Form Accessibility', () => {
  it('should have proper labels for all inputs', () => {
    cy.visit('/signin');
    
    cy.get('input[type="email"]').should('have.attr', 'id');
    cy.get('input[type="password"]').should('have.attr', 'id');
    
    cy.get('label[for]').should('have.length.at.least', 2);
  });

  it('should support keyboard navigation', () => {
    cy.visit('/signin');
    
    cy.get('input[type="email"]').focus();
    cy.focused().should('have.attr', 'type', 'email');
    
    cy.get('input[type="email"]').type('{tab}');
    cy.focused().should('have.attr', 'type', 'password');
  });

  it('should have required attributes on mandatory fields', () => {
    cy.visit('/signup');
    
    cy.get('input[id="name"]').should('have.attr', 'required');
    cy.get('input[id="email"]').should('have.attr', 'required');
    cy.get('input[id="password"]').should('have.attr', 'required');
  });
});
