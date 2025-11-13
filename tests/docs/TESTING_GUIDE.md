# Testing Documentation

## Overview

This project uses a comprehensive testing strategy with multiple testing frameworks:

- **Vitest** - Unit and integration tests for components and functions
- **React Testing Library** - Component testing with user interaction simulation
- **Cypress** - End-to-end (E2E) testing for full user workflows

## Test Structure

```
src/tests/
├── setup.ts                 # Test configuration and global setup
├── auth/                    # Authentication tests
│   └── AuthContext.test.tsx
├── components/              # Component unit tests
│   ├── Button.test.tsx
│   ├── Input.test.tsx
│   ├── Modal.test.tsx
│   └── Card.test.tsx
├── forms/                   # Form validation tests
│   ├── SubmitProject.test.tsx
│   └── ProfileSettings.test.tsx
├── pages/                   # Page component tests
│   ├── SignInPage.test.tsx
│   └── SignUpPage.test.tsx
├── routing/                 # Navigation and routing tests
│   └── Navigation.test.tsx
└── integration/             # API and data integration tests
    └── api.test.tsx

cypress/
├── e2e/                     # End-to-end tests
│   ├── auth.cy.ts          # Authentication flow tests
│   ├── navigation.cy.ts    # Navigation and routing tests
│   └── forms.cy.ts         # Form interaction tests
└── support/
    ├── commands.ts          # Custom Cypress commands
    └── e2e.ts              # Cypress configuration
```

## Running Tests

### Unit and Integration Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in UI mode (interactive)
npm run test:ui
```

### End-to-End Tests (Cypress)

```bash
# Open Cypress Test Runner (interactive mode)
npm run cypress:open

# Run Cypress tests in headless mode (CI)
npm run cypress:run

# Run specific test file
npx cypress run --spec "cypress/e2e/auth.cy.ts"
```

## Test Coverage

The test suite covers the following functionality:

### 1. Authentication Tests ✅
- Sign up with validation (email, password, role, terms)
- Sign in with credentials
- Sign out and session clearing
- Authentication context state management
- Error handling for invalid credentials

### 2. Component Tests ✅
- Button variations (primary, secondary, outline, ghost)
- Input field types (text, email, password, number)
- Modal open/close functionality
- Card rendering and content display
- Loading states

### 3. Form Validation Tests ✅
- Project submission form
  - Required fields (title, description, funding goal)
  - Number validation for funding
  - Category selection
  - Optional fields handling
- Profile settings form
  - Name, bio, location fields
  - URL validation (website, LinkedIn)
  - Phone number format
  - Form submission and updates

### 4. Navigation and Routing Tests ✅
- Public route navigation
- Protected route access control
- Link navigation functionality
- Browser back/forward button support
- 404 page for invalid routes
- Admin panel access restriction

### 5. Integration Tests ✅
- Data fetching from API
- Project creation and persistence
- Data updates and deletion
- Search and filter functionality
- Pagination
- Error handling (network, authentication)

### 6. End-to-End Tests ✅
- Complete authentication workflows
- Form filling and submission
- Navigation through the application
- User interactions (clicks, typing, selections)
- Accessibility features (keyboard navigation, labels)

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../components/ui/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByText('Click');
    button.click();
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Cypress E2E Test Example

```typescript
describe('Sign Up Flow', () => {
  it('successfully creates a new account', () => {
    cy.visit('/signup');
    cy.get('input[id="name"]').type('John Doe');
    cy.get('input[id="email"]').type('john@example.com');
    cy.get('input[id="password"]').type('password123');
    cy.contains('Innovator').click();
    cy.get('input[id="terms"]').check();
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
  });
});
```

## Test Best Practices

### 1. Test Naming
- Use descriptive test names that explain what is being tested
- Start with "should" for behavior tests
- Example: `it('should display error message when email is invalid')`

### 2. Test Organization
- Group related tests using `describe` blocks
- Keep tests focused and atomic (one assertion per test)
- Use `beforeEach` for common setup

### 3. Mocking
- Mock external dependencies (API calls, Supabase)
- Use `vi.mock()` for module mocking
- Clear mocks in `beforeEach` to avoid test interference

### 4. Assertions
- Use specific assertions (`toHaveTextContent`, `toBeInTheDocument`)
- Wait for async operations with `waitFor()`
- Check both presence and absence of elements

### 5. Accessibility
- Test keyboard navigation
- Verify ARIA labels and roles
- Ensure form labels are properly associated

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run cypress:run
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Coverage Goals

- **Unit Tests**: >80% code coverage
- **Integration Tests**: All API endpoints tested
- **E2E Tests**: Critical user journeys covered

## Troubleshooting

### Common Issues

**1. Tests failing due to missing environment variables**
```bash
# Create .env.test file with test configuration
cp .env.example .env.test
```

**2. Cypress cannot connect to development server**
```bash
# Ensure dev server is running
npm run dev

# Update baseUrl in cypress.config.ts if needed
```

**3. Mock not working correctly**
```typescript
// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
```

**4. Async test timeout**
```typescript
// Increase timeout for slow operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass before submitting PR
3. Maintain or improve code coverage
4. Update this documentation if adding new test patterns
