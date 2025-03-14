import { Page, Locator, expect } from '@playwright/test';

export class CreateOrganizationModal {
  private page: Page;
  private readonly nameInput: Locator;
  private readonly slugInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly websiteInput: Locator;
  private readonly addressInput: Locator;
  private readonly selectUsersDropdown: Locator;
  private readonly selectParentOrgDropdown: Locator;
  private readonly createButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorToast: Locator;
  private readonly nameErrorMessage: Locator;
  private readonly slugErrorMessage: Locator;
  private readonly emailErrorMessage: Locator;
  private readonly websiteErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form fields
    this.nameInput = page.getByPlaceholder('Acme Inc.');
    this.slugInput = page.getByPlaceholder('acme-inc');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.emailInput = page.getByPlaceholder('Email');
    this.phoneInput = page.getByPlaceholder('Phone');
    this.websiteInput = page.getByPlaceholder('Website');
    this.addressInput = page.locator('textarea[name="address"]');

    // Dropdowns
    this.selectUsersDropdown = page.getByRole('combobox', { name: 'Search users...' });
    this.selectParentOrgDropdown = page.getByRole('combobox', { name: 'Select parent organization' });

    // Buttons
    this.createButton = page.getByRole('button', { name: 'Create Organization' });

    // Success/Error Messages
    this.successMessage = page.getByText('Organization created successfully');
    this.errorToast = page.locator('li[data-type="error"]'); // Toast message for errors

    // Validation Error Messages
    this.nameErrorMessage = page.getByText('Organization name must be at least 3 characters');
    this.slugErrorMessage = page.getByText(/Slug can only contain|Invalid slug format|Organization slug already exists/);
    this.emailErrorMessage = page.getByText('Invalid email format');
    this.websiteErrorMessage = page.getByText('Invalid website URL format');
  }

  /**
   * Fill in the organization details
   */
  async fillOrganizationDetails(orgDetails: {
    name: string;
    slug: string;
    description: string;
    email: string;
    phone: string;
    website: string;
    address: string;
  }) {
    await this.nameInput.fill(orgDetails.name);
    await this.slugInput.fill(orgDetails.slug);
    await this.descriptionInput.fill(orgDetails.description);
    await this.emailInput.fill(orgDetails.email);
    await this.phoneInput.fill(orgDetails.phone);
    await this.websiteInput.fill(orgDetails.website);
    await this.addressInput.fill(orgDetails.address);
  }

  /**
   * Click the create organization button
   */
  async submitOrganization() {
    await this.createButton.click();
  }

  /**
   * Verify the organization was successfully created
   */
  async verifyOrganizationCreated() {
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Verify that no validation errors appear
   */
  async verifyNoValidationErrors() {
    await expect(this.nameErrorMessage).not.toBeVisible();
    await expect(this.slugErrorMessage).not.toBeVisible();
    await expect(this.emailErrorMessage).not.toBeVisible();
    await expect(this.websiteErrorMessage).not.toBeVisible();
  }

  /**
   * Verify validation errors are displayed
   */
  async verifyValidationErrors() {
    if (await this.nameErrorMessage.isVisible()) {
      console.log('Error: Organization Name is too short.');
    }
    if (await this.slugErrorMessage.isVisible()) {
      console.log('Error: Slug format is invalid.');
    }
    if (await this.emailErrorMessage.isVisible()) {
      console.log('Error: Invalid email format.');
    }
    if (await this.websiteErrorMessage.isVisible()) {
      console.log('Error: Invalid website URL format.');
    }
  }

  /**
   * Check if an error toast appears
   */
  async checkErrorToast() {
    if (await this.errorToast.isVisible()) {
      console.log('Error: ' + (await this.errorToast.innerText()));
    }
  }
}
