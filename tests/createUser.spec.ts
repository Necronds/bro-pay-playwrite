import { test, expect } from '@playwright/test';
import { UserPage } from '../pages/UserPage';
import { Auth } from '../utils/auth';

test.beforeAll(async ({ browser }) => {
    // Skip setup if credentials are not available
  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    test.skip(true, 'Test credentials not provided in environment variables');
    return;
  }

  // Create a new browser context
  const context = await browser.newContext();

  // Get test credentials
  const { username, password } = Auth.getTestCredentials();

  // Setup authentication state and save it to a file
  await Auth.setupAuthState(context, username, password, './auth.json');

  // Close the context
  await context.close();
});

test.use({ storageState: './auth.json' });

test.describe('Create User Test', () => {
    let userPage: UserPage;

    test.beforeEach(async ({ page }) => {
        userPage = new UserPage(page);
        await userPage.goto();
    });

    test('Successfully create user all fields', async ({ page }) => {
        await userPage.user('validUser', 'ValidPass123!', 'John Doe');
        await expect(page.getByText('User created successfully')).toBeVisible();
    });

    test('Successfully disable button when field left empty', async ({ page }) => {
        await userPage.createUserButton.click();
        await expect(userPage.createSubmitButton).toBeDisabled();
    });

    test('Fail when create user without username', async ({ page }) => {
        await userPage.user('', 'ValidPass123!', 'John Doe');
        await expect(userPage.usernameErrorMessage).toBeVisible();
    });

    test('Fail when create user without password', async ({ page }) => {
        await userPage.user('validUser', '', 'John Doe');
        await expect(userPage.passwordErrorMessage).toBeVisible();
    });

    test('Fail when create user without name', async ({ page }) => {
        await userPage.user('validUser', 'ValidPass123!', '');
        await expect(userPage.nameErrorMessage).toBeVisible();
    });

    test('Fail when create user with invalid username', async ({ page }) => {
        await userPage.user('us@er', 'ValidPass123!', 'John Doe');
        await expect(page.getByText('Invalid username format')).toBeVisible();
    });

    test('Fail when create user with invalid password', async ({ page }) => {
        await userPage.user('validUser', 'password', 'John Doe');
        await expect(page.getByText('Password must include uppercase and special character')).toBeVisible();
    });

    test('Fail when create user Name shorter than 2 characters', async ({ page }) => {
        await userPage.user('validUser', 'ValidPass123!', 'J');
        await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    });

    test('Fail when create user Username shorter than 3 characters', async ({ page }) => {
        await userPage.user('ab', 'ValidPass123!', 'John Doe');
        await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
    });

    test('Fail when create user Password shorter than 8 characters', async ({ page }) => {
        await userPage.user('validUser', 'Short1!', 'John Doe');
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('Fail when create user Password without uppercase letter and special character', async ({ page }) => {
        await userPage.user('validUser', 'password123', 'John Doe');
        await expect(page.getByText('Password must include uppercase and special character')).toBeVisible();
    });

    test('Fail when create user Username with space', async ({ page }) => {
        await userPage.user('invalid user', 'ValidPass123!', 'John Doe');
        await expect(page.getByText('Username cannot contain spaces')).toBeVisible();
    });

    test('Fail when create user Password with space', async ({ page }) => {
        await userPage.user('validUser', 'Valid Pass123!', 'John Doe');
        await expect(page.getByText('Password cannot contain spaces')).toBeVisible();
    });
});
