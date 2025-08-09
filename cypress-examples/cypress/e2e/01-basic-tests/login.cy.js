// Basic Login Tests
describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form with all required fields', () => {
    cy.get('[data-cy=email-input]').should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
    cy.get('[data-cy=login-button]').should('be.visible').and('be.disabled')
  })

  it('should enable login button when form is valid', () => {
    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('password123')
    cy.get('[data-cy=login-button]').should('not.be.disabled')
  })

  it('should show validation errors for invalid email', () => {
    cy.get('[data-cy=email-input]').type('invalid-email')
    cy.get('[data-cy=password-input]').type('password123')
    cy.get('[data-cy=login-button]').click()
    cy.get('[data-cy=email-error]').should('contain', 'Please enter a valid email')
  })

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: 1, email: 'test@example.com' }
      }
    }).as('loginRequest')

    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('password123')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')
    cy.assertToastMessage('Login successful')
  })

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginRequest')

    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('wrongpassword')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@loginRequest')
    cy.assertToastMessage('Invalid credentials')
  })
})
