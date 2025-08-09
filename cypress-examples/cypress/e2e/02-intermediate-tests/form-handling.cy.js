// Form Handling and Validation Tests
describe('Form Handling Tests', () => {
  beforeEach(() => {
    cy.visit('/forms')
  })

  describe('User Registration Form', () => {
    it('should validate required fields', () => {
      cy.get('[data-cy=submit-registration]').click()
      
      cy.get('[data-cy=name-error]').should('contain', 'Name is required')
      cy.get('[data-cy=email-error]').should('contain', 'Email is required')
      cy.get('[data-cy=password-error]').should('contain', 'Password is required')
    })

    it('should validate email format', () => {
      cy.get('[data-cy=email-input]').type('invalid-email')
      cy.get('[data-cy=email-error]').should('contain', 'Please enter a valid email')
    })

    it('should validate password strength', () => {
      cy.get('[data-cy=password-input]').type('weak')
      cy.get('[data-cy=password-strength]').should('contain', 'Weak')
      
      cy.get('[data-cy=password-input]').clear().type('StrongPassword123!')
      cy.get('[data-cy=password-strength]').should('contain', 'Strong')
    })

    it('should validate password confirmation', () => {
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=confirm-password-input]').type('different123')
      cy.get('[data-cy=confirm-password-error]').should('contain', 'Passwords do not match')
    })

    it('should successfully submit valid form', () => {
      cy.intercept('POST', '/api/users', {
        statusCode: 201,
        body: { id: 1, message: 'User created successfully' }
      }).as('createUser')

      cy.get('[data-cy=name-input]').type('John Doe')
      cy.get('[data-cy=email-input]').type('john@example.com')
      cy.get('[data-cy=password-input]').type('SecurePass123!')
      cy.get('[data-cy=confirm-password-input]').type('SecurePass123!')
      cy.get('[data-cy=terms-checkbox]').check()
      
      cy.get('[data-cy=submit-registration]').click()
      
      cy.wait('@createUser')
      cy.assertToastMessage('User created successfully')
    })
  })

  describe('Dynamic Form Fields', () => {
    it('should add and remove dynamic fields', () => {
      cy.get('[data-cy=add-phone]').click()
      cy.get('[data-cy=phone-input-1]').should('be.visible')
      
      cy.get('[data-cy=add-phone]').click()
      cy.get('[data-cy=phone-input-2]').should('be.visible')
      
      cy.get('[data-cy=remove-phone-1]').click()
      cy.get('[data-cy=phone-input-1]').should('not.exist')
    })

    it('should validate dynamic fields', () => {
      cy.get('[data-cy=add-phone]').click()
      cy.get('[data-cy=phone-input-0]').type('invalid-phone')
      cy.get('[data-cy=phone-error-0]').should('contain', 'Invalid phone format')
    })
  })

  describe('File Upload', () => {
    it('should upload profile picture', () => {
      cy.get('[data-cy=profile-picture-input]').selectFile({
        contents: 'cypress/fixtures/profile.jpg',
        fileName: 'profile.jpg',
        mimeType: 'image/jpeg'
      })
      
      cy.get('[data-cy=preview-image]').should('be.visible')
      cy.get('[data-cy=upload-success]').should('contain', 'File uploaded successfully')
    })

    it('should validate file type and size', () => {
      cy.get('[data-cy=profile-picture-input]').selectFile({
        contents: 'cypress/fixtures/large-file.pdf',
        fileName: 'large-file.pdf',
        mimeType: 'application/pdf'
      })
      
      cy.get('[data-cy=file-error]').should('contain', 'Invalid file type')
    })
  })
})
