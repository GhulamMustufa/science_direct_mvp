import { Page, expect } from '@playwright/test';

export const TEST_USERS = {
  admin: {
    email: 'ojsadmin@gmail.com',
    password: 'Admin123!'
  },
  author: {
    email: 'author@gmail.com',
    password: 'Author123!'
  },
  reader: {
    email: 'reader@gmail.com',
    password: 'Reader123!'
  }
};

/**
 * Helper to log in a user through the UI
 */
export async function loginAs(page: Page, role: keyof typeof TEST_USERS) {
  const user = TEST_USERS[role];

  await page.goto('/login');

  // Wait for the login form to be visible
  await page.waitForSelector('form');

  // Fill in credentials
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);

  // Click submit (Next.js uses soft navigation, so we don't wait for a hard navigation event)
  await page.click('button[type="submit"]');

  // Verify successful login by checking for the presence of the sign out button
  // Note: we use getByRole or similar if possible, but getByText works for our navbar
  await expect(page.getByText('Sign Out').first()).toBeVisible();
}
