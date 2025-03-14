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

// Use the saved authentication state for all tests in this file
test.use({ storageState: './auth.json' });

test.describe('Create User Test', () => {
    let userPage: UserPage;

    // Initialize the UserPage object before each test
    test.beforeEach(async ({ page }) => {
        userPage = new UserPage(page);
        await userPage.goto(); // Navigate directly to the user page
    });

    test('Successfully create user all fields', async ({ page }) => {
        // Fill in the user form
        await userPage.user('validUser', 'ValidPass123!', 'John Doe'); 
        
        // Check for success message
        await expect(page.getByText('User created successfully')).toBeVisible(); 
    });

    test('Successfully disable button when field left empty', async ({ page }) => {
        // Click on the create user button
        await userPage.createUserButton.click();   
       
       // Check if the submit button is disabled
        await expect(userPage.createSubmitButton).toBeDisabled(); 
    });

    test('Fail when create user without username', async ({ page }) => {
        // Fill in the user form without username
        await userPage.user('', 'ValidPass123!', 'John Doe'); 
        
        // Check for error message   
        await expect(userPage.usernameErrorMessage).toBeVisible(); 
    });

    test('Fail when create user without password', async ({ page }) => {
        // Fill in the user form without password
        await userPage.user('validUser', '', 'John Doe'); 

        // Check for error message
        await expect(userPage.passwordErrorMessage).toBeVisible(); 
    });

    test('Fail when create user without name', async ({ page }) => {
        // Fill in the user form without name
        await userPage.user('validUser', 'ValidPass123!', ''); 
        
        // Check for error message
        await expect(userPage.nameErrorMessage).toBeVisible(); 
    });

    test('Fail when create user with invalid username', async ({ page }) => {
        // Fill in the user form with invalid username
        await userPage.user('us@er', 'ValidPass123!', 'John Doe'); 
        
        // Check for error message
        await expect(page.getByText('Username must be at least 3 characters')).toBeVisible(); 
    });

    test('Fail when create user with invalid password', async ({ page }) => {
        // Fill in the user form with invalid password
        await userPage.user('validUser', 'password', 'John Doe'); 

        // Check for error messages
        await expect(page.getByText('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')).toBeVisible();
    });

    test('Fail when create user Name shorter than 2 characters', async ({ page }) => {
        // Fill in the user form with invalid name
        await userPage.user('validUser', 'ValidPass123!', 'J'); 
        
        // Check for error message
        await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    });

    test('Fail when create user Username shorter than 3 characters', async ({ page }) => {
        // Fill in the user form with invalid username
        await userPage.user('ab', 'ValidPass123!', 'John Doe');

        // Check for error message
        await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
    });

    test('Fail when create user Password shorter than 8 characters', async ({ page }) => {
        // Fill in the user form with invalid password
        await userPage.user('validUser', 'Short1!', 'John Doe');

        // Check for error message
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('Fail when create user Password without uppercase letter and special character', async ({ page }) => {
        // Fill in the user form with invalid password
        await userPage.user('validUser', 'password123', 'John Doe');

        // Check for error message
        await expect(page.getByText('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')).toBeVisible();
    });

    test('Fail when create user Username with space', async ({ page }) => {
        // Fill in the user form with invalid username
        await userPage.user('invalid user', 'ValidPass123!', 'John Doe');

        // Check for error message
        await expect(page.getByText('Username can only contain letters, numbers, underscores, and hyphens')).toBeVisible();
    });

    test('Fail when create user Password with space', async ({ page }) => {
        // Fill in the user form with invalid password
        await userPage.user('validUser', 'Valid Pass123!', 'John Doe');
        
        // Check for error message
        await expect(page.getByText('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')).toBeVisible();
    });
});
