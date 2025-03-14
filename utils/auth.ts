import { Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Authentication utilities for tests
 */
export class Auth {
  /**
   * Login through the UI
   * Use this for tests that specifically test the login functionality
   */
  static async loginViaUI(
    page: Page,
    username: string,
    password: string
  ): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
  }

  /**
   * Login and save authentication state to a file
   * This is useful for setting up auth state that can be reused across tests
   */
  static async setupAuthState(
    context: BrowserContext,
    username: string,
    password: string,
    authFile: string = './auth.json'
  ): Promise<void> {
    const page = await context.newPage();

    // Login via UI
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);

    // Wait for login to complete (adjust based on your app's behavior)
    await page.waitForURL('/**');

    // Save storage state to file
    await context.storageState({ path: authFile });

    await page.close();
  }

  /**
   * Get test credentials from environment variables
   * Returns default test credentials if environment variables are not set
   */
  static getTestCredentials(): { username: string; password: string } {
    return {
      username: process.env.TEST_USERNAME || 'test_user',
      password: process.env.TEST_PASSWORD || 'test_password',
    };
  }
}
