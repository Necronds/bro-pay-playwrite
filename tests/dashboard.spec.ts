import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { Auth } from '../utils/auth';

// This test file demonstrates how to use storage state for authentication
// instead of logging in through the UI for each test

// Global setup - runs once before all tests
test.beforeAll(async ({ browser }) => {
  // Skip setup if credentials are not available
  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    test.skip(true, 'Test credentials not provided in environment variables');
    return;
  }

  // Create a new browser context
  // Launch a new browser instance
  // const browser = await browser.chromium.launch();
  const context = await browser.newContext();

  // Get test credentials
  const { username, password } = Auth.getTestCredentials();

  // Setup authentication state and save it to a file
  await Auth.setupAuthState(context, username, password, './auth');

  // Close the context
  await context.close();
});

// Use the saved authentication state for all tests in this file
test.use({ storageState: './auth' });

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the dashboard
    // Since we're using storageState, we're already authenticated
    await page.goto('/');
  });

  test('should display user information on dashboard', async ({ page }) => {
    // Check if user information is displayed
    await expect(page.getByTestId('user-info')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Click on a navigation item
    await page.getByRole('link', { name: 'Payments' }).click();

    // Verify navigation worked
    await expect(page).toHaveURL(/payments/);
    await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
  
    // Perform logout action
    await dashboardPage.logout();
  
    // Verify that user is redirected to login page
    await dashboardPage.verifyLoggedOut();
  });
});
