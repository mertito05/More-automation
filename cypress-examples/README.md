# Cypress Examples - Comprehensive Testing Suite

This repository contains a complete set of Cypress testing examples covering various testing scenarios from basic to advanced levels.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Test Categories](#test-categories)
- [Installation](#installation)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome, Firefox, or Edge browser

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd cypress-examples

# Install dependencies
npm install

# Open Cypress Test Runner
npm run cypress:open

# Run all tests headlessly
npm run cypress:run
```

## 📁 Project Structure

```
cypress-examples/
├── cypress/
│   ├── e2e/
│   │   ├── 01-basic-tests/
│   │   │   └── login.cy.js
│   │   ├── 02-intermediate-tests/
│   │   │   └── form-handling.cy.js
│   │   ├── 03-advanced-tests/
│   │   │   └── api-testing.cy.js
│   │   ├── 04-performance-tests/
│   │   │   └── performance.cy.js
│   │   └── 05-visual-tests/
│   │       └── visual-testing.cy.js
│   ├── fixtures/
│   │   └── example.json
│   ├── support/
│   │   ├── commands.js
│   │   └── e2e.js
│   └── downloads/
├── cypress.config.js
├── package.json
└── README.md
```

## 🧪 Test Categories

### 1. Basic Tests (`01-basic-tests/`)
- **Login Tests**: Form validation, authentication flow
- **Navigation Tests**: Page routing, link verification
- **Basic UI Interactions**: Button clicks, form submissions

### 2. Intermediate Tests (`02-intermediate-tests/`)
- **Form Handling**: Dynamic forms, validation, file uploads
- **Data Management**: CRUD operations, state management
- **User Interactions**: Complex user workflows

### 3. Advanced Tests (`03-advanced-tests/`)
- **API Testing**: REST API testing, authentication, error handling
- **Database Testing**: Data validation, query performance
- **Integration Testing**: End-to-end workflows

### 4. Performance Tests (`04-performance-tests/`)
- **Page Load Performance**: Core Web Vitals, loading times
- **Network Performance**: API response times, caching
- **Memory Usage**: Memory leak detection, optimization

### 5. Visual Tests (`05-visual-tests/`)
- **Visual Regression**: Screenshot comparison, responsive design
- **Cross-browser Testing**: Consistency across browsers
- **Accessibility Testing**: A11y compliance, high contrast modes

## 🛠 Installation

```bash
# Install all dependencies
npm install

# Install additional tools for visual testing (optional)
npm install --save-dev cypress-image-snapshot
```

## 🎯 Usage

### Running Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run all tests headlessly
npm run cypress:run

# Run specific test file
npm run cypress:run -- --spec "cypress/e2e/01-basic-tests/login.cy.js"

# Run tests in headed mode
npm run cypress:headed

# Run tests in specific browser
npm run cypress:chrome
npm run cypress:firefox
npm run cypress:edge
```

### Environment Configuration

Create a `.env` file for environment-specific configurations:

```bash
# Development
CYPRESS_BASE_URL=http://localhost:3000
CYPRESS_API_URL=http://localhost:3001/api

# Staging
CYPRESS_BASE_URL=https://staging.example.com
CYPRESS_API_URL=https://api-staging.example.com

# Production
CYPRESS_BASE_URL=https://example.com
CYPRESS_API_URL=https://api.example.com
```

## 🏆 Best Practices

### 1. Test Organization
- Use descriptive test names
- Group related tests in separate files
- Use `beforeEach` and `afterEach` hooks for setup/cleanup

### 2. Selectors
- Use `data-cy` attributes for test selectors
- Avoid using CSS classes or IDs that might change
- Create custom commands for complex selectors

### 3. Assertions
- Use specific assertions over generic ones
- Test both positive and negative scenarios
- Include accessibility assertions

### 4. Data Management
- Use fixtures for test data
- Clean up test data after tests
- Use environment variables for configuration

### 5. Performance
- Use `cy.intercept()` for API mocking
- Implement proper wait strategies
- Monitor test execution time

## 🔧 Custom Commands

The project includes several custom commands in `cypress/support/commands.js`:

```javascript
// Authentication
cy.login(email, password)

// API Testing
cy.apiRequest(method, endpoint, body)

// File Upload
cy.uploadFile(selector, fileName, fileType)

// Data Cleanup
cy.cleanupTestData()
```

## 📊 Reporting

Generate test reports using:

```bash
# Generate HTML report
npm run cypress:run -- --reporter html

# Generate JUnit XML report
npm run cypress:run -- --reporter junit --reporter-options "mochaFile=results/test-results.xml"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)
- [Cypress Examples](https://github.com/cypress-io/cypress-example-recipes)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
