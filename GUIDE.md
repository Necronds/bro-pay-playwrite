# Playwright Testing Best Practices Guide

## Table of Contents

- [Playwright Testing Best Practices Guide](#playwright-testing-best-practices-guide)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Structure](#project-structure)
  - [Test Organization](#test-organization)
    - [Test File Naming](#test-file-naming)
    - [Test Structure](#test-structure)
    - [Test Naming](#test-naming)
  - [Selectors](#selectors)
    - [Selector Priority (from most to least preferred)](#selector-priority-from-most-to-least-preferred)
    - [Avoid](#avoid)
  - [Authentication](#authentication)
    - [Login Patterns](#login-patterns)
  - [Environment Variables](#environment-variables)
  - [Test Data Management](#test-data-management)
    - [Approaches](#approaches)
    - [Example](#example)
  - [Page Object Model](#page-object-model)
    - [Example](#example-1)
  - [Visual Testing](#visual-testing)
  - [Performance Testing](#performance-testing)
  - [CI/CD Integration](#cicd-integration)
    - [GitHub Actions Example](#github-actions-example)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Debugging Commands](#debugging-commands)
  - [Additional Resources](#additional-resources)

## Introduction

This guide outlines best practices for writing end-to-end tests using Playwright for the BroPay application. Following these guidelines will help ensure our tests are:

- **Reliable**: Tests should produce consistent results
- **Maintainable**: Tests should be easy to update when the application changes
- **Readable**: Tests should be easy to understand
- **Efficient**: Tests should run as quickly as possible

## Project Structure

```
├── tests/                  # Test files
│   ├── auth/               # Authentication tests
│   ├── dashboard/          # Dashboard tests
│   ├── payments/           # Payment-related tests
│   └── e2e/                # End-to-end workflows
├── fixtures/               # Test data
├── pages/                  # Page object models
├── utils/                  # Helper functions
├── playwright.config.ts    # Playwright configuration
├── .env.example            # Example environment variables
└── .env                    # Actual environment variables (gitignored)
```

## Test Organization

### Test File Naming

- Use descriptive names: `login.spec.ts`, `payment-processing.spec.ts`
- Group related tests in the same file
- Keep test files focused on specific features or workflows

### Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something specific', async ({ page }) => {
    // Test code
  });

  test('should handle an edge case', async ({ page }) => {
    // Test code
  });

  test.afterEach(async ({ page }) => {
    // Cleanup code
  });
});
```

### Test Naming

- Use descriptive names that explain what the test is verifying
- Follow the pattern: `should [expected behavior] when [condition]`
- Examples:
  - `should display error message when credentials are invalid`
  - `should redirect to dashboard after successful login`

## Selectors

### Selector Priority (from most to least preferred)

1. **User-facing attributes**:

   ```typescript
   page.getByRole('button', { name: 'Sign In' });
   page.getByLabel('Username');
   page.getByPlaceholder('Enter your password');
   page.getByText('Welcome back');
   ```

2. **Test-specific attributes** (when necessary):

   ```typescript
   page.getByTestId('login-form');
   ```

3. **CSS selectors** (use sparingly):
   ```typescript
   page.locator('.login-button');
   ```

### Avoid

- Brittle selectors like XPath
- Selectors that depend on specific CSS classes that might change
- Selectors that depend on specific DOM structure

## Authentication

### Login Patterns

1. **UI Login** (for testing the login process itself):

   ```typescript
   await page.goto('/login');
   await page.getByLabel('Username').fill(username);
   await page.getByLabel('Password').fill(password);
   await page.getByRole('button', { name: 'Sign In' }).click();
   ```

2. **Programmatic Login** (for tests that require authentication but aren't testing login):

   ```typescript
   // Create a reusable authentication function in a helper file
   async function login(page, username, password) {
     // Use API calls or storage state instead of UI interaction
     // This is much faster than going through the UI
   }
   ```

3. **Storage State** (fastest approach):

   ```typescript
   // Save authenticated state
   const authFile = 'auth.json';
   await page.context().storageState({ path: authFile });

   // Use in tests
   test.use({ storageState: authFile });
   ```

## Environment Variables

- Store sensitive data like credentials in environment variables
- Use `.env.example` to document required variables
- Never commit actual credentials to the repository

```typescript
// Access environment variables
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
```

## Test Data Management

### Approaches

1. **Fixed Test Data**:

   - Predictable but can lead to test interdependence

2. **Generated Test Data**:

   - Use libraries like Faker.js to generate random data
   - Ensures test independence

3. **Test Data Cleanup**:
   - Clean up created data after tests
   - Use `test.afterEach()` or `test.afterAll()`

### Example

```typescript
import { faker } from '@faker-js/faker';

test('should create a new user', async ({ page, request }) => {
  const userData = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  // Test code using userData

  // Cleanup
  await request.delete(`/api/users/${createdUserId}`);
});
```

## Page Object Model

Use the Page Object Model pattern to encapsulate page interactions and improve maintainability.

### Example

```typescript
// pages/LoginPage.ts
export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async getErrorMessage() {
    return this.page.getByTestId('error-message').textContent();
  }
}

// In test file
import { LoginPage } from '../pages/LoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('validUser', 'validPassword');
  await expect(page).toHaveURL('/dashboard');
});
```

## Visual Testing

Playwright supports visual comparison testing to catch unexpected UI changes.

```typescript
// Take a screenshot and compare with baseline
await expect(page).toHaveScreenshot('dashboard.png');

// Screenshot a specific element
await expect(page.getByTestId('chart')).toHaveScreenshot('chart.png');
```

## Performance Testing

- Use Playwright's built-in performance metrics
- Set reasonable timeouts for actions
- Test under different network conditions

```typescript
// Measure performance
const startTime = Date.now();
await page.goto('/dashboard');
const loadTime = Date.now() - startTime;
expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds

// Simulate slow network
test.use({ networkConditions: 'slow3g' });
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: yarn install
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: yarn test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Troubleshooting

### Common Issues

1. **Flaky Tests**:

   - Add proper waiting mechanisms
   - Use `await expect(element).toBeVisible()` instead of arbitrary waits
   - Increase timeouts for slow operations

2. **Selector Issues**:

   - Use Playwright's debugging tools: `npx playwright codegen`
   - Add `page.pause()` in your test to debug interactively

3. **Authentication Problems**:
   - Check if tokens are expiring
   - Verify storage state is properly saved and loaded

### Debugging Commands

```bash
# Run with UI mode
npx playwright test --ui

# Run with debug mode
npx playwright test --debug

# Generate code from browser interactions
npx playwright codegen

# Show HTML snapshot at the moment of failure
npx playwright show-report
```

## Additional Resources

- [Official Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
