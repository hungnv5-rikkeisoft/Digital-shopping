describe('Login Form E2E Tests', () => {
  beforeEach(() => {
    // Clear any existing auth data from both storage types
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });

    // Visit the login page
    cy.visit('/login');
  });

  describe('Form Validation', () => {
    it('should display validation errors for empty fields', () => {
      // Try to submit form without filling fields
      cy.get('[data-cy="login-button"]').should('be.disabled');

      // Touch username field and leave it empty
      cy.get('#username').focus().blur();
      cy.get('[data-cy="username-error"]')
        .should('be.visible')
        .and('contain', 'Username is required');

      // Touch password field and leave it empty
      cy.get('#password').focus().blur();
      cy.get('[data-cy="password-error"]')
        .should('be.visible')
        .and('contain', 'Password is required');
    });

    it('should enable submit button when form is valid', () => {
      // Fill in valid credentials
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass');

      // Submit button should be enabled
      cy.get('[data-cy="login-button"]').should('not.be.disabled');
    });

    it('should clear validation errors when fields are filled', () => {
      // Trigger validation errors first
      cy.get('#username').focus().blur();
      cy.get('#password').focus().blur();

      // Verify errors are shown
      cy.get('[data-cy="username-error"]').should('be.visible');
      cy.get('[data-cy="password-error"]').should('be.visible');

      // Fill the fields
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass');

      // Errors should be hidden
      cy.get('[data-cy="username-error"]').should('not.exist');
      cy.get('[data-cy="password-error"]').should('not.exist');
    });
  });

  describe('Form Interaction', () => {
    it('should have proper form structure and accessibility', () => {
      // Check page title and welcome text
      cy.get('[data-cy="brand-title"]')
        .should('be.visible')
        .and('contain', 'SHOPPING NOW');

      cy.get('[data-cy="welcome-title"]')
        .should('be.visible')
        .and('contain', 'Welcome Back');

      cy.get('[data-cy="welcome-text"]')
        .should('be.visible')
        .and('contain', 'Access your intelligent shopping platform');

      // Check form fields have proper labels and placeholders
      cy.get('label[for="username"]')
        .should('be.visible')
        .and('contain', 'Username');

      cy.get('#username')
        .should('have.attr', 'placeholder', 'Enter your username')
        .and('have.attr', 'autocomplete', 'username');

      cy.get('label[for="password"]')
        .should('be.visible')
        .and('contain', 'Password');

      cy.get('#password')
        .should('have.attr', 'placeholder', 'Enter your password')
        .and('have.attr', 'autocomplete', 'current-password')
        .and('have.attr', 'type', 'password');

      // Check submit button
      cy.get('[data-cy="login-button"]')
        .should('be.visible')
        .and('contain', 'Access Platform');

      // Check security badge
      cy.get('[data-cy="security-badge"]')
        .should('be.visible')
        .and('contain', '256-bit SSL Encrypted');
    });

    it('should show password field as masked', () => {
      cy.get('#password').type('secretpassword');
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('should allow form submission with Enter key', () => {
      // Mock successful API response
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

      // Fill form and press Enter
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass{enter}');

      // Should make API call and redirect
      cy.wait('@loginRequest');
      cy.url().should('include', '/products');
    });
  });

  describe('API Integration', () => {
    it('should handle successful login', () => {
      // Mock successful API response
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

      // Fill and submit form
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass');
      cy.get('[data-cy="login-button"]').click();

      // Verify API call was made
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          username: 'testuser',
          password: 'testpass',
        });
      });

      // Should redirect to products page
      cy.url().should('include', '/products');

      // Should store token in sessionStorage
      cy.window()
        .its('sessionStorage')
        .invoke('getItem', 'accessToken')
        .should('equal', 'mock-jwt-token');
    });

    it('should handle login failure with generic error', () => {
      // Mock failed API response
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: {
          message: 'Invalid credentials',
        },
      }).as('loginRequest');

      // Fill and submit form
      cy.get('#username').type('wronguser');
      cy.get('#password').type('wrongpass');
      cy.get('[data-cy="login-button"]').click();

      // Wait for API call
      cy.wait('@loginRequest');

      // Should show error message
      cy.get('[data-cy="api-error"]')
        .should('be.visible')
        .and('contain', 'Invalid credentials');

      // Should stay on login page
      cy.url().should('include', '/login');
    });

    it('should handle network error', () => {
      // Mock network error
      cy.intercept('POST', '**/auth/login', {
        forceNetworkError: true,
      }).as('loginRequest');

      // Fill and submit form
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass');
      cy.get('[data-cy="login-button"]').click();

      // Wait for API call
      cy.wait('@loginRequest');

      // Should show generic error message
      cy.get('[data-cy="api-error"]')
        .should('be.visible')
        .and('contain', 'Login failed. Please try again.');
    });

    it('should handle server error (500)', () => {
      // Mock server error
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: {
          message: 'Internal server error',
        },
      }).as('loginRequest');

      // Fill and submit form
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass');
      cy.get('[data-cy="login-button"]').click();

      // Wait for API call
      cy.wait('@loginRequest');

      // Should show error message
      cy.get('[data-cy="api-error"]')
        .should('be.visible')
        .and('contain', 'Internal server error');
    });
  });

  describe('Form State Management', () => {
    it('should clear error message on new login attempt', () => {
      // Mock failed API response first
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('failedLogin');

      // Attempt login and see error
      cy.get('#username').type('wronguser');
      cy.get('#password').type('wrongpass');
      cy.get('[data-cy="login-button"]').click();
      cy.wait('@failedLogin');

      cy.get('[data-cy="api-error"]').should('be.visible');

      // Mock successful response for second attempt
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
      }).as('successfulLogin');

      // Clear form and try again
      cy.get('#username').clear().type('testuser');
      cy.get('#password').clear().type('testpass');
      cy.get('[data-cy="login-button"]').click();

      // Error should be cleared before API call
      cy.get('[data-cy="api-error"]').should('not.exist');

      cy.wait('@successfulLogin');
      cy.url().should('include', '/products');
    });

    it('should reset form state after successful login', () => {
      // Mock successful API response
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

      // Fill and submit form
      cy.get('#username').type('testuser');
      cy.get('#password').type('testpass');

      // Make fields dirty
      cy.get('#username').blur();
      cy.get('#password').blur();

      cy.get('[data-cy="login-button"]').click();
      cy.wait('@loginRequest');

      // Go back to login (simulate logout or direct navigation)
      cy.visit('/login');

      // Form should be in pristine state
      cy.get('#username').should('have.value', '');
      cy.get('#password').should('have.value', '');
      cy.get('[data-cy="login-button"]').should('be.disabled');
    });
  });

  describe('UI/UX Features', () => {
    it('should display proper visual elements', () => {
      // Check brand icon is visible
      cy.get('[data-cy="brand-icon"]').should('be.visible');

      // Check input icons are present
      cy.get('[data-cy="username-icon"]').should('be.visible');
      cy.get('[data-cy="password-icon"]').should('be.visible');

      // Check button icon
      cy.get('[data-cy="button-icon"]').should('be.visible');

      // Check security icon
      cy.get('[data-cy="security-icon"]').should('be.visible');
    });

    it('should have proper button states', () => {
      // Initially disabled
      cy.get('[data-cy="login-button"]').should('be.disabled');

      // Fill only username
      cy.get('#username').type('testuser');
      cy.get('[data-cy="login-button"]').should('be.disabled');

      // Fill password too
      cy.get('#password').type('testpass');
      cy.get('[data-cy="login-button"]').should('not.be.disabled');

      // Clear username
      cy.get('#username').clear();
      cy.get('[data-cy="login-button"]').should('be.disabled');
    });
  });
});
