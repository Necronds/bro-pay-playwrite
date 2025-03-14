import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login page
 * Encapsulates all interactions with the login page
 */
export class LoginPage {
  private page: Page;

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly signInButton: Locator;
  private readonly errorMessage: Locator;
  private readonly passwordValidationErrors: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    
    // Use placeholder instead of label
    this.usernameInput = page.getByPlaceholder('Enter your username');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    
    // Use role for checkbox instead of label
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('[role="alert"], .text-destructive');

    this.passwordValidationErrors = page.locator('[aria-label="Password requirements"] li');

  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Fill in the login form and submit
   * @param username - The username to enter
   * @param password - The password to enter
   * @param rememberMe - Whether to check the "Remember me" checkbox
   */
  async login(username: string, password: string, rememberMe: boolean = false) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.signInButton.click();
  }

  /**
   * Check if the login page is displayed
   */
  async isDisplayed() {
    await expect(this.page.getByText('Welcome back')).toBeVisible();
    await expect(
      this.page.getByText('Sign in to access your account area')
    ).toBeVisible();
  }

  /**
   * Check if all form elements are visible
   */
  async checkFormElements() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.rememberMeCheckbox).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Check if an error message is displayed
   */
  async hasErrorMessage() {
    const validationErrors = await this.passwordValidationErrors.count();
    if (validationErrors > 0) {
        console.log(`Password validation errors detected: ${validationErrors}`);
        return;
    }

    await this.page.waitForSelector('[role="alert"], .text-destructive', { timeout: 5000 });
    await expect(this.errorMessage).toBeVisible();
  }
}
