import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Auth } from '../utils/auth';

test.describe('BroPay Admin Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Initialize the LoginPage object
    loginPage = new LoginPage(page);

    // Navigate to the login page before each test
    await loginPage.goto();
  });

  test('should display login page elements', async () => {
    // Check if the login page is displayed correctly
    await loginPage.isDisplayed();

    // Check if all form elements are visible
    await loginPage.checkFormElements();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Attempt to login with invalid credentials
    await loginPage.login('invalid_user', 'invalid_password');

    // Verify that an error message is displayed
    await loginPage.hasErrorMessage();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Skip this test if test credentials are not provided
    test.skip(
      !process.env.TEST_USERNAME || !process.env.TEST_PASSWORD,
      'Test credentials not provided in environment variables'
    );

    // Get test credentials from environment variables
    const { username, password } = Auth.getTestCredentials();

    // Login with valid credentials
    await loginPage.login(username, password);

    // Wait for navigation to dashboard or authenticated area
    await expect(page).toHaveURL('/');

    // Verify some element that confirms successful login
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({
      timeout: 5000,
    });
  });
});
