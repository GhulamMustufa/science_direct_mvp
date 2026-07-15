import { test, expect } from '@playwright/test';
import { loginAs } from './utils/auth';

test.describe('Admin Editorial Flow', () => {
  test('should allow an admin to request revisions on a submission', async ({ page }) => {
    // 1. Log in as admin (redirects to / by default)
    await loginAs(page, 'admin');
    
    // Navigate to Admin Dashboard explicitly
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);
    
    // 2. Navigate to Editorial Submissions
    await page.getByRole('link', { name: /Editorial Submissions/i }).click();
    await expect(page).toHaveURL(/\/admin\/submissions/);
    
    // 3. Find a pending submission and click to view details
    // We look for a row that says 'SUBMITTED' and click the view button
    const submissionRow = page.locator('tr', { hasText: 'SUBMITTED' }).first();
    await expect(submissionRow).toBeVisible();
    await submissionRow.getByRole('link', { name: /View|Review/i }).click();
    
    // 4. Action - Request Revision
    // Select from dropdown
    await page.locator('select').selectOption('REVISIONS_REQUIRED');
    
    const saveDecisionBtn = page.getByRole('button', { name: /Save Decision/i });
    await expect(saveDecisionBtn).toBeVisible();
    await saveDecisionBtn.click();
    
    // 5. Post-Action Navigation / Verification
    // Verify status changes to REVISIONS_REQUIRED or similar
    await expect(page.getByText('REVISIONS_REQUIRED')).toBeVisible();
  });
});
