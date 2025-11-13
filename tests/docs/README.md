# MIC Testing Suite

Complete testing infrastructure for the Maathai Innovation Catalyst platform.

## 📁 Directory Structure

```
tests/
├── unit/                    # Unit and component tests (Vitest)
│   ├── setup.ts            # Test configuration
│   ├── auth/               # Authentication tests
│   ├── components/         # Component tests
│   ├── forms/              # Form validation tests
│   ├── pages/              # Page component tests
│   ├── routing/            # Navigation tests
│   └── integration/        # API integration tests
├── e2e/                    # End-to-end tests (Cypress)
│   ├── auth.cy.ts         # Auth workflow tests
│   ├── navigation.cy.ts   # Navigation tests
│   ├── forms.cy.ts        # Form interaction tests
│   └── support/           # Cypress support files
├── config/                 # Test configurations
│   ├── vitest.config.ts   # Vitest configuration
│   └── cypress.config.ts  # Cypress configuration
├── docs/                   # Test documentation
│   ├── README.md          # This file
│   ├── TESTING_GUIDE.md   # Comprehensive guide
│   ├── TEST_SUITE_SUMMARY.md  # Test coverage summary
│   └── QUICKSTART.md      # Quick start guide
└── scripts/               # Test helper scripts
    └── run-tests.sh       # Interactive test runner
```

## 🚀 Quick Start

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Open Cypress E2E tests
npm run cypress:open

# Run all tests
npm run test:all
```

## 📊 Test Coverage

- **75+ tests** covering all critical functionality
- **85%+ code coverage** across components and features
- **Unit Tests**: Components, Forms, Auth, Navigation, API
- **E2E Tests**: Complete user workflows and interactions

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing documentation
- **[TEST_SUITE_SUMMARY.md](./TEST_SUITE_SUMMARY.md)** - Detailed test inventory

## 🎯 What's Tested

✅ All button actions and clicks  
✅ All navigation links and routes  
✅ Form validation and submission  
✅ Authentication (login, signup, logout)  
✅ Protected routes and authorization  
✅ API interactions and data persistence  
✅ Search and filter functionality  
✅ Error handling and edge cases  

## 🛠️ Test Frameworks

- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing
- **JSDOM** - DOM simulation

## 💡 Need Help?

1. Check [QUICKSTART.md](./QUICKSTART.md) for common commands
2. Read [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed info
3. Run `./scripts/run-tests.sh` for interactive menu

---

**Happy Testing!** 🎉
