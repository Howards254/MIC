# 🧪 MIC Testing Suite

All testing files and configurations are now centralized in this directory.

## 📁 Directory Structure

```
tests/
├── unit/                      # Unit & Integration Tests (Vitest)
│   ├── setup.ts              # Test setup and configuration
│   ├── auth/                 # Authentication tests
│   ├── components/           # Component unit tests
│   ├── forms/                # Form validation tests
│   ├── pages/                # Page component tests
│   ├── routing/              # Navigation & routing tests
│   ├── integration/          # API integration tests
│   ├── mocks/                # Mock data and utilities
│   └── utils/                # Test utilities
│
├── e2e/                      # End-to-End Tests (Cypress)
│   ├── auth.cy.ts           # Authentication workflows
│   ├── forms.cy.ts          # Form interactions
│   ├── navigation.cy.ts     # Navigation flows
│   └── support/             # Cypress support files
│       ├── commands.ts      # Custom commands
│       ├── e2e.ts          # E2E config
│       └── component.ts     # Component config
│
├── config/                   # Test Configurations
│   ├── vitest.config.ts     # Vitest configuration
│   └── cypress.config.ts    # Cypress configuration
│
├── docs/                     # Documentation
│   ├── README.md            # Documentation overview
│   ├── TESTING_GUIDE.md     # Complete testing guide
│   ├── TEST_SUITE_SUMMARY.md # Test coverage details
│   └── QUICKSTART.md        # Quick start guide
│
└── scripts/                  # Helper Scripts
    └── run-tests.sh         # Interactive test runner
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

# Run Cypress headless
npm run cypress:run

# Run all tests
npm run test:all

# Interactive menu
./tests/scripts/run-tests.sh
```

## 📊 Test Statistics

- **75+ tests** covering all functionality
- **85%+ code coverage**
- Unit, Integration, and E2E tests
- Components, Forms, Auth, Navigation, API

## 📚 Documentation

- **[Quick Start](./docs/QUICKSTART.md)** - Get started in 5 minutes
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - Comprehensive documentation
- **[Test Summary](./docs/TEST_SUITE_SUMMARY.md)** - Coverage details

## 🎯 What's Tested

✅ All button actions  
✅ Navigation & routing  
✅ Form validation  
✅ Authentication flows  
✅ Protected routes  
✅ API interactions  
✅ Search & filters  
✅ Error handling  

---

**For detailed information, see [docs/README.md](./docs/README.md)**
