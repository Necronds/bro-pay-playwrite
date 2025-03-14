import { Page, Locator } from '@playwright/test';

export class OrganizationsPage {
  private page: Page;
  private readonly organizationsLink: Locator;
  public readonly createOrganizationButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar navigation link
    this.organizationsLink = page.getByRole('link', { name: 'Organizations' });

    // "Create Organization" button (opens the modal)
    this.createOrganizationButton = page.getByRole('button', { name: 'Create Organization' });
  }

  /**
   * Navigate to the Organizations page
   */
  async goto() {
    await this.organizationsLink.click();
    await this.page.waitForSelector('table'); // Ensure the page fully loads
  }
}
