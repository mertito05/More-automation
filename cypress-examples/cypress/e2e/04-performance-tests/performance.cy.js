// Performance Testing Suite
describe('Performance Testing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Page Load Performance', () => {
    it('should load homepage within acceptable time', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start')
        },
        onLoad: (win) => {
          win.performance.mark('end')
          win.performance.measure('pageLoad', 'start', 'end')
          const measure = win.performance.getEntriesByName('pageLoad')[0]
          expect(measure.duration).to.be.lessThan(3000)
        }
      })
    })

    it('should measure Core Web Vitals', () => {
      cy.visit('/')
      
      // Measure Largest Contentful Paint (LCP)
      cy.window().then((win) => {
        return new Promise((resolve) => {
          new win.PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lcp = entries[entries.length - 1]
            expect(lcp.startTime).to.be.lessThan(2500)
            resolve()
          }).observe({ entryTypes: ['largest-contentful-paint'] })
        })
      })
    })

    it('should measure First Input Delay (FID)', () => {
      cy.visit('/')
      
      // Simulate user interaction
      cy.get('[data-cy=interactive-button]').click()
      
      cy.window().then((win) => {
        return new Promise((resolve) => {
          new win.PerformanceObserver((list) => {
            const entries = list.getEntries()
            if (entries.length > 0) {
              const fid = entries[0]
              expect(fid.processingStart - fid.startTime).to.be.lessThan(100)
              resolve()
            }
          }).observe({ entryTypes: ['first-input'] })
        })
      })
    })
  })

  describe('Network Performance', () => {
    it('should measure API response times', () => {
      cy.intercept('GET', '/api/products').as('getProducts')
      
      cy.visit('/products')
      cy.wait('@getProducts').then((interception) => {
        const duration = interception.response.duration
        expect(duration).to.be.lessThan(1000)
      })
    })

    it('should test lazy loading performance', () => {
      cy.visit('/products')
      
      // Scroll to trigger lazy loading
      cy.scrollTo('bottom')
      
      cy.get('[data-cy=lazy-loaded-image]').should('be.visible')
      cy.get('[data-cy=lazy-loaded-image]').should('have.attr', 'src')
    })

    it('should measure bundle size', () => {
      cy.visit('/')
      
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')
        const jsResources = resources.filter(r => r.name.includes('.js'))
        const totalSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
        
        // Total JS bundle should be less than 500KB
        expect(totalSize).to.be.lessThan(500000)
      })
    })
  })

  describe('Memory Usage', () => {
    it('should detect memory leaks', () => {
      cy.visit('/')
      
      // Take initial memory snapshot
      cy.window().then((win) => {
        win.gc = win.gc || function() {}
        win.gc()
        const initialMemory = win.performance.memory.usedJSHeapSize
        return initialMemory
      }).then((initialMemory) => {
        // Perform actions that might cause memory leaks
        for (let i = 0; i < 10; i++) {
          cy.get('[data-cy=load-more-button]').click()
          cy.wait(100)
        }
        
        // Force garbage collection and check memory
        cy.window().then((win) => {
          win.gc()
          const finalMemory = win.performance.memory.usedJSHeapSize
          const memoryIncrease = finalMemory - initialMemory
          
          // Memory increase should be less than 10MB
          expect(memoryIncrease).to.be.lessThan(10000000)
        })
      })
    })
  })

  describe('Rendering Performance', () => {
    it('should test virtual scrolling performance', () => {
      cy.visit('/large-list')
      
      // Measure render time for large list
      cy.window().then((win) => {
        const start = win.performance.now()
        
        cy.get('[data-cy=virtual-list]').scrollTo('bottom')
        
        const end = win.performance.now()
        expect(end - start).to.be.lessThan(100)
      })
    })

    it('should test component re-rendering', () => {
      cy.visit('/counter')
      
      const iterations = 1000
      
      cy.window().then((win) => {
        const start = win.performance.now()
        
        for (let i = 0; i < iterations; i++) {
          cy.get('[data-cy=increment-button]').click()
        }
        
        const end = win.performance.now()
        const averageTime = (end - start) / iterations
        
        // Average render time per update should be less than 1ms
        expect(averageTime).to.be.lessThan(1)
      })
    })
  })

  describe('Caching Performance', () => {
    it('should test browser caching', () => {
      cy.visit('/')
      
      // First visit
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')
        const cachedResources = resources.filter(r => r.transferSize === 0)
        expect(cachedResources.length).to.be.greaterThan(0)
      })
      
      // Second visit should use cache
      cy.visit('/')
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')
        const cachedResources = resources.filter(r => r.transferSize === 0)
        expect(cachedResources.length).to.be.greaterThan(5)
      })
    })

    it('should test service worker caching', () => {
      cy.visit('/')
      
      // Check if service worker is registered
      cy.window().then((win) => {
        return win.navigator.serviceWorker.getRegistration()
      }).then((registration) => {
        expect(registration).to.not.be.null
      })
      
      // Test offline functionality
      cy.window().then((win) => {
        win.navigator.serviceWorker.ready.then((registration) => {
          registration.active.postMessage({ type: 'OFFLINE' })
        })
      })
      
      cy.reload()
      cy.get('[data-cy=offline-indicator]').should('contain', 'Offline mode')
    })
  })

  describe('Load Testing', () => {
    it('should handle concurrent API requests', () => {
      const requests = Array(10).fill().map(() => 
        cy.apiRequest('GET', '/products')
      )
      
      Promise.all(requests).then((responses) => {
        responses.forEach(response => {
          expect(response.status).to.equal(200)
        })
      })
    })

    it('should test database query performance', () => {
      cy.intercept('GET', '/api/products?limit=1000').as('largeQuery')
      
      cy.visit('/products')
      cy.wait('@largeQuery').then((interception) => {
        expect(interception.response.duration).to.be.lessThan(2000)
      })
    })
  })
})
