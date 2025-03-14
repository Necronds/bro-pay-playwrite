const { chromium } = require('@playwright/test');
const { Auth } = require('./auth');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * This script sets up authentication by logging in and saving the auth state
 * Run this script before running tests that require authentication
 */
async function setupAuth() {
  console.log('Setting up authentication...');

  // Check if credentials are available
  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    console.error(
      'Error: TEST_USERNAME and TEST_PASSWORD must be set in .env file'
    );
    process.exit(1);
  }

  // Get test credentials
  const { username, password } = Auth.getTestCredentials();
  console.log(`Using credentials for user: ${username}`);

  // Launch browser and create context
  const browser = await chromium.launch();
  const context = await browser.newContext();

  try {
    // Setup authentication state
    await Auth.setupAuthState(context, username, password, './auth.json');
    console.log('Authentication state saved to auth.json');
  } catch (error) {
    console.error('Error setting up authentication:', error);
    process.exit(1);
  } finally {
    // Close browser
    await browser.close();
  }
}

// Run the setup
setupAuth().catch(console.error);
