import { test, expect } from '@playwright/test';
import { loginAs } from './utils/auth';
import path from 'path';

test.describe('Author Submission Flow', () => {
  test('should allow an author to submit a new manuscript', async ({ page }) => {
    // 1. Log in as author (redirects to /)
    await loginAs(page, 'author');
    
    // Navigate to Author Dashboard explicitly
    await page.goto('/author');
    await expect(page).toHaveURL(/\/author/);
    
    // 2. Click "Submit New Manuscript" (could be "Submit New Manuscript" or "Submit")
    // Wait for the submissions section to load and locate the submit button
    const submitBtn = page.getByRole('link', { name: /Submit.*Manuscript|Submit/i }).first();
    await submitBtn.click();
    
    // Verify we are on the submit page
    await expect(page).toHaveURL(/\/author\/submit/);
    
    // 3. Fill out Manuscript Details
    // Categories (select first available category)
    await page.locator('select[multiple]').selectOption({ index: 0 });
    
    // Target Journal (select second option, index 1 since index 0 is disabled 'Select Journal')
    await page.locator('select[required]').first().selectOption({ index: 1 });
    
    // Journal Section
    await page.locator('select').nth(2).selectOption('Research Article');
    
    // Language
    await page.locator('select').nth(3).selectOption('English');
    
    // 4. Fill Author Details (First author is already there)
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Affiliation').fill('University of Science');
    
    // 5. Checklist
    // Check all checkboxes in the checklist section
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    // Start from index 1 because the first checkbox might be the "Corresponding Author" one
    for (let i = 1; i < checkboxes.length; i++) {
      await checkboxes[i].check();
    }
    
    // 6. Upload Manuscript
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures/dummy.pdf'));
    
    // 7. Submit the form
    const validateBtn = page.getByRole('button', { name: /Validate & Submit/i });
    
    // It should be enabled now that everything is filled out and checked
    await expect(validateBtn).toBeEnabled();
    await validateBtn.click();
    
    // 8. We should be redirected to the validate page
    await expect(page).toHaveURL(/\/author\/submit\/validate/);
    
    // Wait for validation to finish (there's a confirmation button)
    const confirmBtn = page.getByRole('button', { name: /Confirm & Submit/i });
    await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await confirmBtn.click();
    
    // 9. Should redirect back to dashboard
    await expect(page).toHaveURL(/\/author/);
  });
});
