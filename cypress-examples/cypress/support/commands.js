// Custom Cypress Commands

// Login command for authentication
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('not.include', '/login')
  })
})

// Data cleanup command
Cypress.Commands.add('cleanupTestData', () => {
  cy.task('db:seed')
})

// API testing helper
Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  return cy.request({
    method: method,
    url: `/api${endpoint}`,
    body: body,
    failOnStatusCode: false
  })
})

// File upload helper
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = '') => {
  cy.get(selector).selectFile({
    contents: `cypress/fixtures/${fileName}`,
    fileName: fileName,
    mimeType: fileType
  })
})

// Wait for loading states
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-cy=loading-spinner]').should('not.exist')
})

// Check accessibility
Cypress.Commands.add('checkA11y', (context = null, options = {}) => {
  cy.injectAxe()
  cy.checkA11y(context, options)
})

// Custom assertions
Cypress.Commands.add('assertToastMessage', (message) => {
  cy.get('[data-cy=toast-message]').should('contain', message)
})

Cypress.Commands.add('assertUrlContains', (urlPart) => {
  cy.url().should('include', urlPart)
})

// Performance testing
Cypress.Commands.add('measurePerformance', (metricName) => {
  cy.window().then((win) => {
    return win.performance.getEntriesByType('navigation')[0]
  }).then((navigation) => {
    cy.wrap(navigation[metricName]).as(metricName)
  })
})
