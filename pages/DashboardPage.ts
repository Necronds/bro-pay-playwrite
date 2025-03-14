import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  private page: Page;
  private readonly profileButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Profile button in the navigation
    this.profileButton = page.locator('button[data-sidebar="menu-button"]');

    // Logout button inside dropdown menu
    this.logoutButton = page.getByRole('menuitem', { name: 'Log out' });
  }

  /**
   * Click the profile button and logout
   */
  async logout() {
    await this.profileButton.click(); // Open dropdown
    await this.page.waitForTimeout(500); // Ensure menu is visible
    await this.logoutButton.click(); // Click logout
  }

  /**
   * Verify the user is logged out
   */
  async verifyLoggedOut() {
    await expect(this.page).toHaveURL(/login/); // Adjust if your login URL is different
    await expect(this.page.getByText('Welcome back')).toBeVisible();
  }
}
