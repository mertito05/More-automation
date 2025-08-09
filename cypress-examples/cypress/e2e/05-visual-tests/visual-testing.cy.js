// Visual Regression Testing
describe('Visual Regression Testing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Responsive Design Testing', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 }
    ]

    viewports.forEach(viewport => {
      it(`should render correctly on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height)
        cy.matchImageSnapshot(`homepage-${viewport.name}`)
      })
    })
  })

  describe('Component Visual Testing', () => {
    it('should match button component snapshot', () => {
      cy.get('[data-cy=primary-button]').matchImageSnapshot('primary-button')
    })

    it('should match card component snapshot', () => {
      cy.get('[data-cy=product-card]').matchImageSnapshot('product-card')
    })

    it('should match modal component snapshot', () => {
      cy.get('[data-cy=open-modal]').click()
      cy.get('[data-cy=modal]').matchImageSnapshot('modal-component')
    })
  })

  describe('Dark Mode Testing', () => {
    it('should toggle dark mode correctly', () => {
      cy.get('[data-cy=dark-mode-toggle]').click()
      cy.matchImageSnapshot('homepage-dark-mode')
      
      cy.get('[data-cy=dark-mode-toggle]').click()
      cy.matchImageSnapshot('homepage-light-mode')
    })
  })

  describe('State Changes', () => {
    it('should capture loading state', () => {
      cy.intercept('GET', '/api/products', {
        delay: 1000,
        body: []
      }).as('slowProducts')
      
      cy.visit('/products')
      cy.matchImageSnapshot('loading-state')
      
      cy.wait('@slowProducts')
      cy.matchImageSnapshot('loaded-state')
    })

    it('should capture error state', () => {
      cy.intercept('GET', '/api/products', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('errorProducts')
      
      cy.visit('/products')
      cy.wait('@errorProducts')
      cy.matchImageSnapshot('error-state')
    })
  })

  describe('Cross-Browser Testing', () => {
    it('should render consistently across browsers', () => {
      cy.visit('/')
      
      // Test key components
      cy.get('[data-cy=header]').matchImageSnapshot('header-cross-browser')
      cy.get('[data-cy=navigation]').matchImageSnapshot('navigation-cross-browser')
      cy.get('[data-cy=footer]').matchImageSnapshot('footer-cross-browser')
    })
  })

  describe('Accessibility Visual Testing', () => {
    it('should render correctly with high contrast mode', () => {
      cy.visit('/')
      
      // Enable high contrast
      cy.window().then((win) => {
        win.localStorage.setItem('high-contrast', 'true')
      })
      
      cy.reload()
      cy.matchImageSnapshot('high-contrast-mode')
    })

    it('should render correctly with large fonts', () => {
      cy.visit('/')
      
      // Increase font size
      cy.window().then((win) => {
        win.document.documentElement.style.fontSize = '24px'
      })
      
      cy.matchImageSnapshot('large-font-mode')
    })
  })

  describe('Animation Testing', () => {
    it('should capture hover states', () => {
      cy.get('[data-cy=hover-button]').trigger('mouseenter')
      cy.matchImageSnapshot('button-hover-state')
    })

    it('should capture focus states', () => {
      cy.get('[data-cy=focus-input]').focus()
      cy.matchImageSnapshot('input-focus-state')
    })

    it('should capture animation frames', () => {
      cy.get('[data-cy=start-animation]').click()
      
      // Capture animation at different stages
      cy.wait(250)
      cy.matchImageSnapshot('animation-frame-1')
      
      cy.wait(250)
      cy.matchImageSnapshot('animation-frame-2')
      
      cy.wait(250)
      cy.matchImageSnapshot('animation-frame-3')
    })
  })

  describe('Dynamic Content Testing', () => {
    it('should handle dynamic content changes', () => {
      cy.visit('/dashboard')
      
      // Initial state
      cy.matchImageSnapshot('dashboard-initial')
      
      // Add new widget
      cy.get('[data-cy=add-widget]').click()
      cy.matchImageSnapshot('dashboard-with-widget')
      
      // Remove widget
      cy.get('[data-cy=remove-widget]').click()
      cy.matchImageSnapshot('dashboard-after-removal')
    })
  })

  describe('Print Styles Testing', () => {
    it('should render correctly for print', () => {
      cy.visit('/report')
      
      // Trigger print styles
      cy.window().then((win) => {
        win.dispatchEvent(new Event('beforeprint'))
      })
      
      cy.matchImageSnapshot('print-version')
    })
  })
})
