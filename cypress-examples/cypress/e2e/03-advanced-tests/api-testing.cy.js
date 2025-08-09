// API Testing with Cypress
describe('API Testing Suite', () => {
  const apiBaseUrl = '/api'

  describe('Authentication API', () => {
    it('should successfully authenticate user', () => {
      cy.apiRequest('POST', '/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('token')
        expect(response.body.user).to.have.property('email', 'test@example.com')
      })
    })

    it('should return 401 for invalid credentials', () => {
      cy.apiRequest('POST', '/auth/login', {
        email: 'test@example.com',
        password: 'wrongpassword'
      }).then((response) => {
        expect(response.status).to.equal(401)
        expect(response.body).to.have.property('error', 'Invalid credentials')
      })
    })

    it('should refresh token', () => {
      cy.apiRequest('POST', '/auth/refresh', {
        refreshToken: 'valid-refresh-token'
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('token')
      })
    })
  })

  describe('User Management API', () => {
    let authToken

    before(() => {
      // Get authentication token
      cy.apiRequest('POST', '/auth/login', {
        email: 'admin@example.com',
        password: 'admin123'
      }).then((response) => {
        authToken = response.body.token
      })
    })

    it('should create a new user', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/users`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'New User',
          email: 'newuser@example.com',
          role: 'user'
        }
      }).then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body).to.have.property('id')
        expect(response.body.email).to.equal('newuser@example.com')
      })
    })

    it('should get user list', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/users`,
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should update user details', () => {
      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/users/1`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Updated Name',
          email: 'updated@example.com'
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.name).to.equal('Updated Name')
      })
    })

    it('should delete user', () => {
      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/users/1`,
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.equal(204)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 for non-existent endpoint', () => {
      cy.apiRequest('GET', '/non-existent-endpoint').then((response) => {
        expect(response.status).to.equal(404)
      })
    })

    it('should handle validation errors', () => {
      cy.apiRequest('POST', '/users', {
        email: 'invalid-email',
        name: ''
      }).then((response) => {
        expect(response.status).to.equal(422)
        expect(response.body.errors).to.have.property('email')
        expect(response.body.errors).to.have.property('name')
      })
    })

    it('should handle rate limiting', () => {
      // Make multiple rapid requests
      for (let i = 0; i < 10; i++) {
        cy.apiRequest('GET', '/users')
      }
      
      cy.apiRequest('GET', '/users').then((response) => {
        expect(response.status).to.equal(429)
      })
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', () => {
      cy.apiRequest('POST', '/users', {}).then((response) => {
        expect(response.status).to.equal(422)
        expect(response.body.errors).to.have.property('email')
        expect(response.body.errors).to.have.property('name')
      })
    })

    it('should validate email format', () => {
      cy.apiRequest('POST', '/users', {
        email: 'invalid-email',
        name: 'Test User'
      }).then((response) => {
        expect(response.status).to.equal(422)
        expect(response.body.errors.email).to.include('valid email')
      })
    })

    it('should validate password strength', () => {
      cy.apiRequest('POST', '/users', {
        email: 'test@example.com',
        name: 'Test User',
        password: 'weak'
      }).then((response) => {
        expect(response.status).to.equal(422)
        expect(response.body.errors.password).to.include('at least 8 characters')
      })
    })
  })
})
