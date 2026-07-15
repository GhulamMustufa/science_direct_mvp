import { test, expect } from '@playwright/test';

test.describe('Search Filters', () => {
  test('should apply filters and allow clearing them', async ({ page }) => {
    // 1. Go to search page
    await page.goto('/search');
    
    // 2. Select a journal filter (first dropdown)
    const journalSelect = page.locator('select').first(); 
    // Assuming there is at least one option besides the default
    await journalSelect.selectOption({ index: 1 });
    
    // 3. Verify URL is updated with journalId
    await expect(page).toHaveURL(/journalId=/);
    
    // 4. Verify 'Clear All Filters' button appears
    const clearBtn = page.getByRole('button', { name: /Clear All Filters/i });
    await expect(clearBtn).toBeVisible();
    
    // 5. Enter a search query
    const searchInput = page.getByPlaceholder(/Search by title/i);
    await searchInput.fill('Machine Learning');
    
    // 6. Verify URL updates with query after debounce (wait for 500ms for debounce)
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/query=Machine\+Learning/);
    
    // 7. Click 'Clear All Filters'
    await clearBtn.click();
    
    // 8. Verify URL is reset to just /search
    await expect(page).toHaveURL(/\/search$/);
    
    // 9. Verify input is cleared
    await expect(searchInput).toHaveValue('');
  });
});
