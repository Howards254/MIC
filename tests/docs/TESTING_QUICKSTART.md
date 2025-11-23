# Quick Start - Testing Guide

## 🚀 Getting Started

### Prerequisites
Ensure all dependencies are installed:
```bash
npm install
```

---

## 📝 Running Tests

### Option 1: Using NPM Scripts (Recommended)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui

# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run Cypress tests in headless mode (CI)
npm run cypress:run

# Run ALL tests (unit + E2E)
npm run test:all
```

### Option 2: Using the Helper Script

```bash
# Run the interactive menu
./run-tests.sh
```

This will show you an interactive menu:
```
1) Run all unit tests
2) Run tests in watch mode
3) Run tests with coverage
4) Run tests with UI
5) Run Cypress E2E tests (interactive)
6) Run Cypress E2E tests (headless)
7) Run ALL tests (unit + E2E)
8) View test documentation
9) Exit
```

---

## 🧪 Test Types

### Unit Tests (Vitest)
Fast, isolated tests for individual components and functions.

**When to run:** 
- During development
- Before committing code
- In CI/CD pipeline

**Example:**
```bash
npm run test
```

### Integration Tests (Vitest)
Tests that verify multiple components work together correctly.

**When to run:**
- After making API changes
- Before major releases
- In CI/CD pipeline

**Example:**
```bash
npm run test -- src/tests/integration
```

### End-to-End Tests (Cypress)
Full user workflow tests that simulate real user interactions.

**When to run:**
- Before deployments
- After major feature additions
- Weekly regression testing

**Example:**
```bash
npm run cypress:run
```

---

## 📊 Understanding Test Output

### Unit Test Output
```
✓ src/tests/components/Button.test.tsx (5)
  ✓ Button Component (5)
    ✓ renders button with text
    ✓ calls onClick when clicked
    ✓ applies correct variant classes
    ✓ applies correct size classes
    ✓ disables button correctly

Test Files  1 passed (1)
     Tests  5 passed (5)
```

### Coverage Report
```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   87.5  |   80.0   |   85.0  |   87.5  |
 Button.jsx        |   100   |   100    |   100   |   100   |
 Input.jsx         |   90.0  |   75.0   |   85.0  |   90.0  |
-------------------|---------|----------|---------|---------|
```

### Cypress Test Output
```
Running: auth.cy.ts
  Authentication Flow
    Sign Up
      ✓ should display sign up form (234ms)
      ✓ should validate required fields (189ms)
      ✓ should validate password length (156ms)

  3 passing (2s)
```

---

## 🐛 Debugging Tests

### Debug Unit Tests
```bash
# Run tests with debugger
npm run test -- --inspect-brk

# Run specific test file
npm run test -- src/tests/components/Button.test.tsx

# Run tests matching a pattern
npm run test -- -t "Button"
```

### Debug Cypress Tests
```bash
# Open Cypress with debugging enabled
npm run cypress:open

# Run specific test file
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run with browser visible
npx cypress run --headed --browser chrome
```

---

## ✅ Pre-Commit Checklist

Before committing your code:

1. ✅ Run unit tests: `npm run test`
2. ✅ Check coverage: `npm run test:coverage`
3. ✅ Run linting: `npm run lint`
4. ✅ Run type checking: `npm run typecheck`

---

## 🔧 Common Issues & Solutions

### Issue: Tests fail with "Cannot find module"
**Solution:** Install dependencies
```bash
npm install
```

### Issue: Cypress cannot connect
**Solution:** Start dev server first
```bash
npm run dev
# In another terminal:
npm run cypress:open
```

### Issue: Tests timeout
**Solution:** Increase timeout in test
```typescript
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

### Issue: Mock not working
**Solution:** Clear mocks before each test
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## 📚 Learn More

- **Full Documentation:** See `TESTING_GUIDE.md`
- **Test Summary:** See `TEST_SUITE_SUMMARY.md`
- **Vitest Docs:** https://vitest.dev/
- **Cypress Docs:** https://docs.cypress.io/
- **Testing Library:** https://testing-library.com/

---

## 💡 Tips for Success

1. **Run tests frequently** - Catch bugs early
2. **Write tests first** - TDD approach helps design better code
3. **Keep tests simple** - One assertion per test when possible
4. **Use descriptive names** - Make failures easy to understand
5. **Mock external dependencies** - Keep tests fast and reliable

---

## 🎯 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run test` | Run all unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run cypress:open` | Open Cypress UI |
| `npm run cypress:run` | Run Cypress headless |
| `npm run test:all` | Run all tests |

---

**Ready to test?** Start with:
```bash
npm run test:watch
```

This will run tests automatically as you code! 🚀
