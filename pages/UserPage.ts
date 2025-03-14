import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login page
 * Encapsulates all interactions with the login page
 */
export class UserPage {
  private page: Page;

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly nameInput: Locator;
  private readonly createUserButton: Locator;
  private readonly createSubmitButton: Locator;
  private readonly usernameErrorMessage: Locator;
  private readonly passwordErrorMessage: Locator;
  private readonly nameErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.usernameInput = page.getByPlaceholder('johndoe');
    this.passwordInput = page.getByPlaceholder('Password');
    this.nameInput = page.getByPlaceholder('John Doe');
    this.createUserButton = page.getByRole('button', { name: 'Create User' });
    this.createSubmitButton = page.getByRole('button', { name: 'Create User' });
    this.usernameErrorMessage = page.getByText('Username must be at least 3 characters');
    this.passwordErrorMessage = page.getByText('Password must be at least 8 characters');
    this.nameErrorMessage = page.getByText('Name must be at least 2 characters');
  }

  /**
   * Navigate to the user page
   */
  async goto() {
    await this.page.goto('/user');
  }

  /**
   * Fill in the login form and submit
   * @param username - The username to enter
   * @param password - The password to enter
   * @param name - The name to enter
   */
  async user(username: string, password: string, name: string) {
    await this.createUserButton.click();

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.nameInput.fill(name);

    await this.createSubmitButton.click();
  }

  /**
   * Check if the login page is displayed
   */
  async isDisplayed() {
    await expect(this.page.getByText('Create New User')).toBeVisible();
    await expect(
      this.page.getByText('Add a new user to the system with their details and permissions.')
    ).toBeVisible();
  }

  /**
   * Check if all form elements are visible
   */
  async checkFormElements() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
  }

  /**
   * Check if an error message is displayed
   */
  async assertErrorMessage() {
    await expect(this.usernameErrorMessage).toBeVisible();
    await expect(this.passwordErrorMessage).toBeVisible();
    await expect(this.nameErrorMessage).toBeVisible();
  }
}
