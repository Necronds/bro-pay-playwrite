# BroPay Playwright Tests

This repository contains end-to-end tests for the BroPay Admin website using Playwright.

## Project Structure

```
├── tests/                  # Test files
│   ├── auth/               # Authentication tests
│   ├── dashboard/          # Dashboard tests
│   ├── payments/           # Payment-related tests
│   └── e2e/                # End-to-end workflows
├── fixtures/               # Test data
├── pages/                  # Page object models
│   └── components/         # Reusable component objects
├── utils/                  # Helper functions
├── playwright.config.ts    # Playwright configuration
├── .env.example            # Example environment variables
└── .env                    # Actual environment variables (gitignored)
```

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your test credentials

## Running Tests

Run all tests:

```bash
yarn test
```

Run a specific test file:

```bash
yarn test:login
```

Run tests in UI mode:

```bash
yarn test:ui
```

View test report:

```bash
yarn report
```

## Test Structure

- `tests/login.spec.ts` - Tests for the login functionality
- `tests/dashboard.spec.ts` - Tests for the dashboard functionality

## Page Object Model

We use the Page Object Model pattern to organize our tests. This helps with:

- **Maintainability**: Changes to the UI only require updates in one place
- **Readability**: Tests focus on business logic, not implementation details
- **Reusability**: Page objects can be reused across multiple tests

Example:

```typescript
// Using a page object
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('username', 'password');

// Instead of raw selectors
await page.goto('/login');
await page.getByLabel('Username').fill('username');
await page.getByLabel('Password').fill('password');
await page.getByRole('button', { name: 'Sign In' }).click();
```

## Authentication Strategies

We support multiple authentication strategies:

1. **UI Login**: For testing the login process itself
2. **Storage State**: For tests that require authentication but aren't testing login

## Notes

- The tests use environment variables for credentials. Make sure to set them in the `.env` file.
- Screenshots are captured on test failures.
- HTML reports are generated after test runs.

## Best Practices

For detailed best practices, see the [GUIDE.md](./GUIDE.md) file.
