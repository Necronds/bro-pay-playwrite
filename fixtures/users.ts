/**
 * Test user data for BroPay tests
 */

export const users = {
  // Valid test users
  validUser: {
    username: 'test_user',
    password: 'test_password',
    name: 'Test User',
    role: 'admin',
  },

  // Users with specific roles
  adminUser: {
    username: 'admin_user',
    password: 'admin_password',
    name: 'Admin User',
    role: 'admin',
  },

  regularUser: {
    username: 'regular_user',
    password: 'regular_password',
    name: 'Regular User',
    role: 'user',
  },

  // Invalid users for negative testing
  invalidUser: {
    username: 'invalid_user',
    password: 'invalid_password',
  },

  lockedUser: {
    username: 'locked_user',
    password: 'locked_password',
    status: 'locked',
  },
};

/**
 * Get environment-specific test user
 * Allows overriding test users with environment variables
 */
export function getTestUser(userType: keyof typeof users = 'validUser') {
  const user = users[userType];

  // For valid users, check if environment variables should override
  if (userType === 'validUser') {
    return {
      ...user,
      username: process.env.TEST_USERNAME || user.username,
      password: process.env.TEST_PASSWORD || user.password,
    };
  }

  return user;
}
