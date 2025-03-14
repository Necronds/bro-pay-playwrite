import { test, expect } from '@playwright/test';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { CreateOrganizationModal } from '../pages/CreateOrg';
import { Auth } from '../utils/auth';

// Global setup for authentication
test.beforeAll(async ({ playwright }) => {
  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    test.skip(true, 'Test credentials not provided in environment variables');
    return;
  }

  // Launch browser instance
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();

  // Get test credentials
  const { username, password } = Auth.getTestCredentials();

  // Setup authentication state
  await Auth.setupAuthState(context, username, password, './auth');

  // Close browser after authentication setup
  await browser.close();
});

// Use the saved authentication state for all tests
test.use({ storageState: './auth' });

test.describe('Create New Organization', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard before each test
    await page.goto('/');
  });

  test('should show validation errors when required fields are missing', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    const createOrgModal = new CreateOrganizationModal(page);

    // Navigate to the Organizations page
    await organizationsPage.goto();

    // Open the Create Organization modal
    await organizationsPage.createOrganizationButton.click();

    // Submit form without filling anything
    await createOrgModal.submitOrganization();

    // Verify validation errors appear
    await createOrgModal.verifyValidationErrors();
  });

  test('should not allow invalid slug or email formats', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    const createOrgModal = new CreateOrganizationModal(page);

    // Navigate to the Organizations page
    await organizationsPage.goto();

    // Open the Create Organization modal
    await organizationsPage.createOrganizationButton.click();

    // Fill in invalid details
    await createOrgModal.fillOrganizationDetails({
      name: 'Te', // Too short
      slug: 'INVALID_SLUG!', // Invalid format
      description: 'Test org with invalid data',
      email: 'invalid-email', // Invalid email
      phone: '+1234567890',
      website: 'invalid-url', // Invalid website URL
      address: 'Test Address',
    });

    // Submit form
    await createOrgModal.submitOrganization();

    // Verify validation errors appear
    await createOrgModal.verifyValidationErrors();
  });

  test('should create an organization with valid data', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    const createOrgModal = new CreateOrganizationModal(page);

    // Navigate to the Organizations page
    await organizationsPage.goto();

    // Open the Create Organization modal
    await organizationsPage.createOrganizationButton.click();

    // Fill in valid details
    await createOrgModal.fillOrganizationDetails({
      name: 'Valid Org',
      slug: 'valid-org',
      description: 'This is a valid test organization',
      email: 'test@organization.com',
      phone: '+1234567890',
      website: 'https://test-organization.com',
      address: '123 Test Street, Test City, Test Country',
    });

    // Submit form
    await createOrgModal.submitOrganization();

    // Verify no validation errors
    await createOrgModal.verifyNoValidationErrors();

    // Verify the organization was successfully created
    await createOrgModal.verifyOrganizationCreated();
  });
});
