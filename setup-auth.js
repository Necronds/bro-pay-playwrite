const fs = require('fs');
const path = require('path');

/**
 * This script creates an empty auth.json file
 * This is a temporary solution until proper authentication is set up
 */
function createEmptyAuthFile() {
  console.log('Creating empty auth.json file...');

  const authFile = path.join(__dirname, 'auth.json');

  // Create an empty authentication state
  const emptyAuthState = {
    cookies: [],
    origins: [],
  };

  // Write to file
  fs.writeFileSync(authFile, JSON.stringify(emptyAuthState, null, 2));

  console.log(`Empty auth.json file created at ${authFile}`);
  console.log('Note: This is a temporary solution. For proper authentication:');
  console.log('1. Update your .env file with valid credentials');
  console.log('2. Run tests that include authentication setup');
}

// Run the function
createEmptyAuthFile();
